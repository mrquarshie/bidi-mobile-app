import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Omc {
  id: string;
  name: string;
  location: string;
  logo: string | null;
  contact: string;
  contactPerson: string | null;
  email: string | null;
  products: { name: string; price: number }[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Pump {
  productName: string;
  pumpNumber: string;
}

const { Option } = Select;

const BACKEND_BASE_URL = 'https://bidi-backend-2lpo.onrender.com';

const RegisteredOMC: React.FC = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [pumps, setPumps] = useState<Pump[]>([]);
  const [selectedOmcId, setSelectedOmcId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [omcData, setOmcData] = useState<Omc[]>([]);

  // Placeholder OMC data (replace with actual data)
    useEffect(() => {
    const fetchOmcData = async () => {
      try {
        const response = await axios.get<Omc[]>('https://bidi-backend-2lpo.onrender.com/user/omcs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOmcData(response.data);
      } catch (error) {
        console.error('Error fetching OMC data:', error);
      }
    };

    fetchOmcData();
  }, []);

  const showModal = (omcId: string) => {
    setSelectedOmcId(omcId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const payload = {
            name: values.stationName,
            omcId: parseInt(selectedOmcId!),
            region: values.region,
            district: values.district,
            town: values.town,
            managerName: values.stationMasterName,
            managerContact: values.contactNumber,
            pumps,
          };
          await axios.post(`${BACKEND_BASE_URL}/auth/stations`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        console.log('Form Values:', values);
        setIsModalOpen(false);
        setPumps([]);
        setSelectedOmcId(null);
          form.resetFields();
          message.success('Station added successfully!');
          toast.success('Station added successfully!');
      } catch (error: any) {
        console.error('Error creating station:', error);
          toast.error(
            error.response?.data?.message || 'Failed to add station. Please try again.'
          );
        }
      })
      .catch((error) => {
        console.log('Validation Failed:', error);
        toast.error('Please fill in all required fields correctly.', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPumps([]);
    setSelectedOmcId(null);
    form.resetFields();
  };

  const handleAddPump = (productName: string, pumpNumber: string) => {
  if (!pumps.some((p) => p.pumpNumber === pumpNumber)) {
    setPumps([...pumps, { productName, pumpNumber }]);
  } else {
    toast.error('Pump number must be unique.');
  }
  };

  const handleRemovePump = (pumpNumber: string) => {
    setPumps(pumps.filter((p) => p.pumpNumber !== pumpNumber));
  };

   const getAvailableProducts = () => {
    if (!selectedOmcId) return [];
    const selectedOmc = omcData.find((omc) => omc.id === selectedOmcId);
    return selectedOmc?.products?.map((p) => p.name) || [];
  };

    const PumpForm = () => {
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [pumpNumber, setPumpNumber] = useState<string>('');

    const handleAdd = () => {
      if (selectedProduct && pumpNumber) {
        handleAddPump(selectedProduct, pumpNumber);
        setSelectedProduct(null);
        setPumpNumber('');
      }
    };

     return (
      <div className="flex space-x-4 mb-4">
        <Select
          placeholder="Select Product"
          value={selectedProduct}
          onChange={setSelectedProduct}
          className="w-1/2"
        >
          {getAvailableProducts().map((product) => (
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
          onClick={handleAdd}
          disabled={!selectedProduct || !pumpNumber}
          className="!bg-[#1F806E] hover:!bg-[#427c72] !border-none !text-white"
        >
          Add Pump
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] md:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-6">
          Registered OMC
        </h2>
        <div className="space-y-4">
          {omcData.map((omc) => (
            <div
              key={omc.id} 
              className="flex flex-col lg:flex-row items-center p-6 rounded-lg shadow-md bg-white"
            >
              {/* First Section: Logo, Name, Location, Phone */}
              <div className="flex-1 flex items-center mb-4 lg:mb-0">
               <img
                  src={
                    omc.logo
                      ? `${BACKEND_BASE_URL}/uploads/${omc.logo.split('\\').pop()}` // Extract filename and use forward slashes
                      : '/bidi-logo.svg'
                  }
                  alt={`${omc.name} Logo`}
                  className="w-24 h-24 object-contain mr-6 bg-[#E2F3E9] rounded-md p-3 shadow-sm"
                
                />
                <div>
                  <h3 className="text-xl font-bold text-[#3C3939] mb-1">
                    {omc.name}
                  </h3>
                  <p className="text-sm text-[#625E5C] mb-1">
                    {omc.location}
                  </p>
                  <p className="text-sm text-[#625E5C]">
                    {omc.contact}
                  </p>
                </div>
              </div>
              {/* Second Section: Registration Number and Add Station Button (Mobile/Tablet) */}
              <div className="flex-1 flex flex-col items-center lg:hidden space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    Registration No.
                  </h4>
                  <p className="text-base text-[#625E5C]">
                    {`OMC-${omc.id}`}
                  </p>
                </div>
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md !border-none hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => showModal(omc.id)}
                >
                  Add Station
                </Button>
              </div>
              {/* Second Section: Registration Number (Laptop) */}
              <div className="hidden lg:flex flex-1 flex-col items-center">
                <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                  Registration Number
                </h4>
                <p className="text-base text-[#625E5C]">
                   {`OMC-${omc.id}`}
                </p>
              </div>
              {/* Third Section: Add Station Button (Laptop) */}
              <div className="hidden lg:flex flex-1 justify-end pr-4">
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => showModal(omc.id)}
                >
                  Add Station
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal with Form */}
      <Modal
        title={<span className="text-xl font-bold">Add Station</span>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button className='font-semibold rounded-md !bg-[#5b6d6a] hover:!bg-[#3a4242] !border-none' key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="!bg-[#1F806E] hover:!bg-[#427c72] !border-none"
          >
            Submit
          </Button>,
        ]}
        bodyStyle={{ padding: '5px' }}
      >
        <Form form={form} layout="vertical" className="space-y-4">
          {/* Station Name */}
          <Form.Item
            label="Station Name"
            name="stationName"
            rules={[{ required: true, message: 'Please enter station name' }]}
            className="!mt-3"
          >
            <Input />
          </Form.Item>

          {/* Station Location Section */}
          <div>
            <h4 className="text-md font-bold text-[#3C3939] mb-2">
              Station Location
            </h4>
            <div className="flex space-x-4">
              <Form.Item
                label="Region"
                name="region"
                rules={[{ required: true, message: 'Please select a region' }]}
                className="flex-1 !mr-2"
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
                className="flex-1 !mr-2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Town"
                name="town"
                rules={[{ required: true, message: 'Please enter town' }]}
                className="flex-1"
              >
                <Input />
              </Form.Item>
            </div>
          </div>

          <div>
            <h4 className="text-md font-bold text-[#3C3939] mb-2">Pumps</h4>
            <PumpForm />
            <div className="flex flex-wrap space-x-2 mb-4">
              {pumps.map((pump) => (
                <div
                  key={pump.pumpNumber}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded-md mb-2"
                >
                  <span>{`${pump.productName} (Pump: ${pump.pumpNumber})`}</span>
                  <button
                    className="ml-2 cursor-pointer text-red-500"
                    onClick={() => handleRemovePump(pump.pumpNumber)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>


          {/* Station Master Section */}
          <div>
            <h4 className="text-md font-bold text-[#3C3939] mb-2">
              Station Master
            </h4>
            <div className="flex space-x-4">
              <Form.Item
                label="Name"
                name="stationMasterName"
                rules={[{ required: true, message: 'Please enter name' }]}
                className="flex-1 !mr-2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[
                  { required: true, message: 'Please enter contact number' },
                ]}
                className="flex-1"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisteredOMC;