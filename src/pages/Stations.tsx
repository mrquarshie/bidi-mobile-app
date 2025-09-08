import React, { useEffect, useState, memo } from 'react';
import { Select, Modal, Form, Input, Button, Table, Space } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';

interface Pump {
  id: string;
  pumpNumber: string;
  product: { id: string; type: string };
}

interface Station {
  id: string;
  name: string;
  region: string;
  district: string;
  town: string;
  managerName: string;
  managerContact: string;
  omcId: string;
  omc: { id: string; name: string };
  pumps: Pump[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Omc {
  id: string;
  name: string;
  products?: { name: string; price: number }[] | null;
}

interface StationFormValues {
  name: string;
  region: string;
  district: string;
  town: string;
  managerName: string;
  managerContact: string;
}

interface AddStationFormValues extends StationFormValues {
  omcId: string;
  stationName: string;
  stationMasterName: string;
  contactNumber: string;
}

interface PumpFormValues {
  productName: string;
  pumpNumber: string;
}

const { Option } = Select;

const apiBase = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    toast.error('Please log in to continue.');
    throw new Error('No authentication token found.');
  }
  return { Authorization: `Bearer ${token}` };
};

const handleApiError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
};

const validatePumps = (pumps: PumpFormValues[], availableProducts: string[]) => {
  const uniquePumpNumbers = new Set();
  for (const pump of pumps) {
    if (!pump.productName || !pump.pumpNumber) {
      return 'All pumps must have a product name and pump number.';
    }
    if (!availableProducts.includes(pump.productName)) {
      return `Product "${pump.productName}" is not available for this OMC.`;
    }
    if (uniquePumpNumbers.has(pump.pumpNumber)) {
      return `Pump number "${pump.pumpNumber}" is duplicated.`;
    }
    uniquePumpNumbers.add(pump.pumpNumber);
  }
  return null;
};

const PumpForm = memo(
  ({
    pumps,
    setPumps,
    availableProducts,
  }: {
    pumps: PumpFormValues[];
    setPumps: (pumps: PumpFormValues[]) => void;
    availableProducts: string[];
  }) => {
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [pumpNumber, setPumpNumber] = useState<string>('');

    const handleAddPump = () => {
      if (selectedProduct && pumpNumber) {
        if (!pumps.some((p) => p.pumpNumber === pumpNumber)) {
          setPumps([...pumps, { productName: selectedProduct, pumpNumber }]);
          setSelectedProduct(null);
          setPumpNumber('');
        } else {
          toast.error('Pump number must be unique.');
        }
      }
    };

    return (
      <div>
        {availableProducts.length === 0 ? (
          <p className="text-sm text-gray-500 mb-2">Please select an OMC to add pumps.</p>
        ) : (
          <div className="flex space-x-4 mb-4">
            <Select
              placeholder="Select Product"
              value={selectedProduct}
              onChange={setSelectedProduct}
              allowClear
              className="w-1/2"
            >
              {availableProducts.map((product) => (
                <Option key={product} value={product}>
                  {product}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Pump Number"
              value={pumpNumber}
              onChange={(e) => setPumpNumber(e.target.value)}
              className="w-1/3 !mx-1.5"
            />
            <Button
              onClick={handleAddPump}
              disabled={!selectedProduct || !pumpNumber || availableProducts.length === 0}
              className="!bg-[#1F806E] hover:!bg-[#427c72] !border-none !text-white"
            >
              Add Pump
            </Button>
          </div>
        )}
      </div>
    );
  }
);

const Stations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [omcs, setOmcs] = useState<Omc[]>([]);
  const [selectedOmcId, setSelectedOmcId] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editPumps, setEditPumps] = useState<PumpFormValues[]>([]);
  const [addPumps, setAddPumps] = useState<PumpFormValues[]>([]);
  const [isLoadingOmcs, setIsLoadingOmcs] = useState(false);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const selectedOmccId = Form.useWatch('omcId', addForm);

  useEffect(() => {
    const fetchOmcs = async () => {
      setIsLoadingOmcs(true);
      try {
        const response = await axios.get<Omc[]>(`${apiBase}/user/omcs`, {
          headers: getAuthHeaders(),
        });
        setOmcs(response.data);
      } catch (error) {
        handleApiError(error, 'Failed to load OMCs.');
      } finally {
        setIsLoadingOmcs(false);
      }
    };
    fetchOmcs();
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true);
      try {
        const response = await axios.get<Station[]>(`${apiBase}/user/stations`, {
          params: { omcId: selectedOmcId },
          headers: getAuthHeaders(),
        });
        setStations(response.data);
      } catch (error) {
        handleApiError(error, 'Failed to load stations.');
      } finally {
        setIsLoadingStations(false);
      }
    };
    fetchStations();
  }, [selectedOmcId]);

  const handleOmcChange = (value: string | undefined) => {
    setSelectedOmcId(value || null);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setEditPumps(
      station.pumps.map((pump) => ({
        productName: pump.product.type,
        pumpNumber: pump.pumpNumber,
      }))
    );
    editForm.setFieldsValue({
      name: station.name,
      region: station.region,
      district: station.district,
      town: station.town,
      managerName: station.managerName,
      managerContact: station.managerContact,
    });
    setIsEditModalVisible(true);
  };

  const handleAddStation = () => {
    setIsAddModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingStation(null);
    editForm.resetFields();
    setEditPumps([]);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
    setAddPumps([]);
  };

  const handleEditSubmit = async (values: StationFormValues) => {
    if (!editingStation) return;
    setIsSubmittingEdit(true);
    try {
      const availableProducts = getAvailableProducts(editingStation.omcId);
      const validationError = validatePumps(editPumps, availableProducts);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      const payload = {
        ...values,
        pumps: editPumps,
      };
      await axios.patch(`${apiBase}/user/station/${editingStation.id}`, payload, {
        headers: getAuthHeaders(),
      });
      toast.success('Station updated successfully!');
      const response = await axios.get<Station[]>(`${apiBase}/user/stations`, {
        params: { omcId: selectedOmcId },
        headers: getAuthHeaders(),
      });
      setStations(response.data);
      handleEditCancel();
    } catch (error) {
      handleApiError(error, 'Failed to update station.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleAddSubmit = async (values: AddStationFormValues) => {
    setIsSubmittingAdd(true);
    try {
      const availableProducts = getAvailableProducts(values.omcId);
      const validationError = validatePumps(addPumps, availableProducts);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      const payload = {
        name: values.stationName,
        omcId: parseInt(values.omcId),
        region: values.region,
        district: values.district,
        town: values.town,
        managerName: values.stationMasterName,
        managerContact: values.contactNumber,
        pumps: addPumps,
      };
      await axios.post(`${apiBase}/auth/stations`, payload, {
        headers: getAuthHeaders(),
      });
      toast.success('Station added successfully!');
      const response = await axios.get<Station[]>(`${apiBase}/user/stations`, {
        params: { omcId: selectedOmcId },
        headers: getAuthHeaders(),
      });
      setStations(response.data);
      handleAddCancel();
    } catch (error) {
      handleApiError(error, 'Failed to add station.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const updateEditPump = (index: number, field: keyof PumpFormValues, value: string) => {
    const newPumps = [...editPumps];
    newPumps[index] = { ...newPumps[index], [field]: value };
    setEditPumps(newPumps);
  };

  const removeEditPump = (index: number) => {
    setEditPumps(editPumps.filter((_, i) => i !== index));
  };

  const removeAddPump = (index: number) => {
    setAddPumps(addPumps.filter((_, i) => i !== index));
  };

  const getAvailableProducts = (omcId: string | undefined) => {
    if (!omcId) return [];
    const selectedOmc = omcs.find((omc) => omc.id === omcId);
    return selectedOmc?.products?.map((p) => p.name) || [];
  };

  const editPumpColumns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: PumpFormValues, index: number) => (
        <Select
          value={record.productName}
          onChange={(value) => updateEditPump(index, 'productName', value)}
          placeholder="Select Product"
          className="w-full"
        >
          {getAvailableProducts(editingStation?.omcId).map((product) => (
            <Option key={product} value={product}>
              {product}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Pump Number',
      dataIndex: 'pumpNumber',
      key: 'pumpNumber',
      render: (_: any, record: PumpFormValues, index: number) => (
        <Input
          value={record.pumpNumber}
          onChange={(e) => updateEditPump(index, 'pumpNumber', e.target.value)}
          placeholder="e.g., PUMP001"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <Button type="link" danger onClick={() => removeEditPump(index)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const addPumpColumns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: PumpFormValues) => <span>{record.productName}</span>,
    },
    {
      title: 'Pump Number',
      dataIndex: 'pumpNumber',
      key: 'pumpNumber',
      render: (_: any, record: PumpFormValues) => <span>{record.pumpNumber}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <Button type="link" danger onClick={() => removeAddPump(index)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] sm:pl-[50px] lg:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000]">
            Stations
          </h2>
          <Button
            type="primary"
            onClick={handleAddStation}
            className="!bg-[#1F806E] hover:!bg-[#427c72] !border-none"
          >
            Add Station
          </Button>
        </div>

        <div className="mb-6">
          <Select
            placeholder="Select OMC (All)"
            allowClear
            onChange={handleOmcChange}
            className="w-full max-w-xs"
            loading={isLoadingOmcs}
            aria-label="Select OMC"
          >
            {omcs.map((omc) => (
              <Option key={omc.id} value={omc.id}>
                {omc.name}
              </Option>
            ))}
          </Select>
        </div>

        {isLoadingStations ? (
          <p>Loading stations...</p>
        ) : stations.length === 0 ? (
          <p className="text-[#625E5C]">No stations found.</p>
        ) : (
          stations.map((station) => (
            <div
              key={station.id}
              className="flex flex-col lg:flex-row items-start p-6 rounded-lg shadow-md bg-white mb-4"
            >
              <div className="flex-1 mb-4 lg:mb-0">
                <h3 className="text-xl font-bold text-[#3C3939] mb-1">
                  {station.name}
                </h3>
                <p className="text-sm text-[#625E5C] mb-1">
                  OMC: {station.omc.name}
                </p>
                <p className="text-sm text-[#625E5C] mb-1">
                  Location: {station.region}, {station.district}, {station.town}
                </p>
                <p className="text-sm text-[#625E5C]">
                  Number of Pumps: {station.pumps.length}
                </p>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                  Station Manager
                </h4>
                <p className="text-sm text-[#625E5C] mb-1">
                  Name: {station.managerName}
                </p>
                <p className="text-sm text-[#625E5C]">
                  Contact: {station.managerContact}
                </p>
              </div>

              <div className="flex-1 lg:text-right">
                <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                  History
                </h4>
                <p className="text-sm text-[#625E5C] mb-1">
                  Created: {new Date(station.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#625E5C]">
                  Updated: {new Date(station.updatedAt).toLocaleDateString()}
                </p>
                <Button
                  type="primary"
                  onClick={() => handleEdit(station)}
                  className="mt-2 !bg-[#737b81] hover:!bg-[#5a5e60] border-0"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}

        <Modal
          title="Edit Station"
          open={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          aria-labelledby="edit-station-modal-title"
        >
          <Form
            form={editForm}
            onFinish={handleEditSubmit}
            layout="vertical"
            aria-label="Edit Station Form"
          >
            <Form.Item
              name="name"
              label="Station Name"
              rules={[{ required: true, message: 'Please enter station name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="region" label="Region">
              <Input />
            </Form.Item>
            <Form.Item name="district" label="District">
              <Input />
            </Form.Item>
            <Form.Item name="town" label="Town">
              <Input />
            </Form.Item>
            <Form.Item name="managerName" label="Manager Name">
              <Input />
            </Form.Item>
            <Form.Item
              name="managerContact"
              label="Manager Contact"
              rules={[
                { required: true, message: 'Please enter contact number' },
                {
                  pattern: /^\+?\d{10,15}$/,
                  message: 'Please enter a valid phone number (10-15 digits, optional + prefix)',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Pumps">
              <Table
                columns={editPumpColumns}
                dataSource={editPumps}
                pagination={false}
                rowKey={(_, index) => (index !== undefined ? index.toString() : '')}
              />
              <Button
                type="dashed"
                onClick={() => setEditPumps([...editPumps, { productName: '', pumpNumber: '' }])}
                className="mt-2 w-full"
              >
                Add Pump
              </Button>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!bg-[#105a32f1] hover:!bg-[#11472af1] border-0"
                  loading={isSubmittingEdit}
                >
                  Save
                </Button>
                <Button
                  onClick={handleEditCancel}
                  className="!bg-[#737b81] hover:!bg-[#5a5e60] border-0"
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={<span className="text-xl font-bold">Add Station</span>}
          open={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={null}
          aria-labelledby="add-station-modal-title"
        >
          <Form
            form={addForm}
            onFinish={handleAddSubmit}
            layout="vertical"
            aria-label="Add Station Form"
          >
            <Form.Item
              label="OMC"
              name="omcId"
              rules={[{ required: true, message: 'Please select an OMC' }]}
            >
              <Select placeholder="Select OMC">
                {omcs.map((omc) => (
                  <Option key={omc.id} value={omc.id}>
                    {omc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Station Name"
              name="stationName"
              rules={[{ required: true, message: 'Please enter station name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Region"
              name="region"
              rules={[{ required: true, message: 'Please select a region' }]}
            >
              <Select>
                <Option value="Greater Accra">Greater Accra</Option>
                <Option value="Ahafo">Ahafo</Option>
                <Option value="Ashanti">Ashanti</Option>
                <Option value="Bono">Bono</Option>
                <Option value="Bono East">Bono East</Option>
                <Option value="Central">Central</Option>
                <Option value="Eastern">Eastern</Option>
                <Option value="North East">North East</Option>
                <Option value="Northern">Northern</Option>
                <Option value="Oti">Oti</Option>
                <Option value="Savannah">Savannah</Option>
                <Option value="Upper East">Upper East</Option>
                <Option value="Upper West">Upper West</Option>
                <Option value="Volta">Volta</Option>
                <Option value="Western">Western</Option>
                <Option value="Western North">Western North</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true, message: 'Please enter district' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Town"
              name="town"
              rules={[{ required: true, message: 'Please enter town' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Station Master Name"
              name="stationMasterName"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                { required: true, message: 'Please enter contact number' },
                {
                  pattern: /^\+?\d{10,15}$/,
                  message: 'Please enter a valid phone number (10-15 digits, optional + prefix)',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Pumps">
              {/* <p className="text-sm text-gray-500 mb-2">
                Use the form below to add pumps.
              </p> */}
              <PumpForm
                pumps={addPumps}
                setPumps={setAddPumps}
                availableProducts={getAvailableProducts(selectedOmccId)}
              />
              <Table
                columns={addPumpColumns}
                dataSource={addPumps}
                pagination={false}
                rowKey={(_, index) => (index !== undefined ? index.toString() : '')}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!bg-[#105a32f1] hover:!bg-[#11472af1] border-0"
                  loading={isSubmittingAdd}
                >
                  Submit
                </Button>
                <Button onClick={handleAddCancel} className='!bg-[#737b81] hover:!bg-[#5a5e60] border-0'>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Stations;