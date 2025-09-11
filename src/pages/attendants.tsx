import React, { useState, useEffect } from 'react';
import {
  Table,
  Select,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  Space,
  Tooltip,
  type UploadProps,
  Upload,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, InboxOutlined, EyeOutlined  } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import '../components/PersonnelSelection.css';

const { Option } = Select;
const { Text } = Typography;

interface Station {
  id: number;
  name: string;
  omcId: number;
}

interface Omc {
  id: number;
  name: string;
}

interface Pump {
  id: number;
  pumpNumber: string;
  stationId: number;
}

interface PumpAttendant {
  id: number;
  name: string;
  nationalId: string;
  contact: string;
  gender: string;
  cardUrl: string;
  email: string;
  station: Station | null;
  omc: Omc | null;
  pumps: Pump[]; // Add pumps to interface
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const Attendants: React.FC = () => {
  const { role } = useAuth();
  const [pumpAttendants, setPumpAttendants] = useState<PumpAttendant[]>([]);
  const [filteredAttendants, setFilteredAttendants] = useState<PumpAttendant[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [omcs, setOmcs] = useState<Omc[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]); // State for pumps
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState<PumpAttendant | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const apiBase = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPumpAttendants = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBase}/user/attendants`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data: PumpAttendant[] = await response.json();
        if (response.ok) {
          setPumpAttendants(data);
          setFilteredAttendants(data);
        } else {
          toast.error((data as any).message || 'Failed to load pump attendants');
        }
      } catch (error) {
        toast.error('Failed to load pump attendants');
      } finally {
        setLoading(false);
      }
    };

    const fetchStations = async () => {
      try {
        const response = await fetch(`${apiBase}/user/stations`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data: Station[] = await response.json();
        if (response.ok) {
          setStations(data);
        } else {
          toast.error((data as any).message || 'Failed to load stations');
        }
      } catch (error) {
        toast.error('Failed to load stations');
      }
    };

    const fetchOmcs = async () => {
      try {
        const response = await fetch(`${apiBase}/user/omcs`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data: Omc[] = await response.json();
        if (response.ok) {
          setOmcs(data);
        } else {
          toast.error((data as any).message || 'Failed to load OMCs');
        }
      } catch (error) {
        toast.error('Failed to load OMCs');
      }
    };

    if (role === 'OMC_ADMIN') {
      fetchPumpAttendants();
      fetchStations();
      fetchOmcs();
    }
  }, [role]);

  // Fetch pumps when stationId changes in create or edit form
  const fetchPumps = async (stationId: number) => {
    if (!stationId) {
      setPumps([]);
      return;
    }
    try {
      const response = await fetch(`${apiBase}/user/pumps?stationId=${stationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data: Pump[] = await response.json();
      if (response.ok) {
        setPumps(data);
      } else {
        toast.error((data as any).message || 'Failed to load pumps');
      }
    } catch (error) {
      toast.error('Failed to load pumps');
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAttendants(pumpAttendants);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = pumpAttendants.filter(
      (attendant) =>
        attendant.name.toLowerCase().includes(lowerQuery) ||
        attendant.nationalId.toLowerCase().includes(lowerQuery) ||
        attendant.contact.toLowerCase().includes(lowerQuery) ||
        attendant.email.toLowerCase().includes(lowerQuery) ||
        attendant.station?.name.toLowerCase().includes(lowerQuery) ||
        attendant.omc?.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredAttendants(filtered);
  };

const handleCreateAttendant = async (values: {
  name: string;
  nationalId: string;
  contact: string;
  gender: string;
  cardImage?: any; // FileList from Upload component
  email: string;
  password: string;
  stationId: number;
  omcId: number;
  pumpIds?: number[];
}) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('nationalId', values.nationalId);
    formData.append('contact', values.contact);
    formData.append('gender', values.gender);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('stationId', values.stationId.toString());
    formData.append('omcId', values.omcId.toString());
    if (values.cardImage && values.cardImage.length > 0) {
      formData.append('cardImage', values.cardImage[0].originFileObj);
    }

    // Step 1: Create the pump attendant
    const response = await fetch(`${apiBase}/user/attendant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create pump attendant');
    }

    // Step 2: Assign pumps if pumpIds are provided
    if (values.pumpIds && values.pumpIds.length > 0) {
      await Promise.all(
        values.pumpIds.map(async (pumpId) => {
          await fetch(`${apiBase}/user/pump/${pumpId}/attendants`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ attendantIds: [data.id] }),
          });
        })
      );
    }

    setPumpAttendants((prev) => [...prev, { ...data, pumps: values.pumpIds ? pumps.filter(p => values.pumpIds!.includes(p.id)) : [] }]);
    setFilteredAttendants((prev) => [...prev, { ...data, pumps: values.pumpIds ? pumps.filter(p => values.pumpIds!.includes(p.id)) : [] }]);
    setCreateModalVisible(false);
    form.resetFields();
    setPumps([]);
    toast.success('Pump Attendant created successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to create pump attendant');
  } finally {
    setLoading(false);
  }
};

 const handleUpdateAttendant = async (values: {
  name?: string;
  nationalId?: string;
  contact?: string;
  gender?: string;
  cardImage?: any; // FileList from Upload component
  email?: string;
  password?: string;
  stationId?: number;
  omcId?: number | null;
  pumpIds?: number[];
}) => {
  if (!selectedAttendant) return;

  setLoading(true);
  try {
    const formData = new FormData();
    values.name && formData.append('name', values.name);
    values.nationalId && formData.append('nationalId', values.nationalId);
    values.contact && formData.append('contact', values.contact);
    values.gender && formData.append('gender', values.gender);
    values.email && formData.append('email', values.email);
    values.password && formData.append('password', values.password);
    values.stationId && formData.append('stationId', values.stationId.toString());
    values.omcId && formData.append('omcId', values.omcId.toString());
    if (values.cardImage && values.cardImage.length > 0) {
      formData.append('cardImage', values.cardImage[0].originFileObj);
    }

    // Step 1: Update the pump attendant
    const response = await fetch(`${apiBase}/user/update/attendants/${selectedAttendant.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update pump attendant');
    }

    // Step 2: Update pump assignments
    const currentPumps = await fetch(`${apiBase}/user/attendant/${selectedAttendant.id}/pumps`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const currentPumpData = await currentPumps.json();
    const currentPumpIds = currentPumpData.map((pump: Pump) => pump.id);

    const newPumpIds = values.pumpIds || [];
    const pumpsToAdd = newPumpIds.filter((id: number) => !currentPumpIds.includes(id));
    const pumpsToRemove = currentPumpIds.filter((id: number) => !newPumpIds.includes(id));

    await Promise.all(
      pumpsToAdd.map(async (pumpId: number) => {
        await fetch(`${apiBase}/user/pump/${pumpId}/attendants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ attendantIds: [selectedAttendant.id] }),
        });
      })
    );

    await Promise.all(
      pumpsToRemove.map(async (pumpId: number) => {
        await fetch(`${apiBase}/user/pump/${pumpId}/attendants`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ attendantIds: [selectedAttendant.id] }),
        });
      })
    );

    setPumpAttendants((prev) =>
      prev.map((attendant) =>
        attendant.id === selectedAttendant.id
          ? { ...attendant, ...data, pumps: newPumpIds.map(id => pumps.find(p => p.id === id)!).filter(p => p) }
          : attendant
      )
    );
    setFilteredAttendants((prev) =>
      prev.map((attendant) =>
        attendant.id === selectedAttendant.id
          ? { ...attendant, ...data, pumps: newPumpIds.map(id => pumps.find(p => p.id === id)!).filter(p => p) }
          : attendant
      )
    );
    setEditModalVisible(false);
    editForm.resetFields();
    setPumps([]);
    toast.success('Pump Attendant updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to update pump attendant');
  } finally {
    setLoading(false);
  }
};

  const handleDeleteAttendant = async () => {
    if (!selectedAttendant) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user/attendant/${selectedAttendant.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        setPumpAttendants((prev) =>
          prev.filter((attendant) => attendant.id !== selectedAttendant.id)
        );
        setFilteredAttendants((prev) =>
          prev.filter((attendant) => attendant.id !== selectedAttendant.id)
        );
        setEditModalVisible(false);
        setConfirmDeleteVisible(false);
        toast.success('Pump Attendant deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete pump attendant');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete pump attendant');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStations = (omcId: number | undefined) => {
    if (!omcId) return [];
    return stations.filter((station) => station.omcId === omcId);
  };

  if (!role || role !== 'OMC_ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-lg text-[#3C3939]">Access restricted.</Text>
      </div>
    );
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'National ID',
      dataIndex: 'nationalId',
      key: 'nationalId',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      width: 150,
      ellipsis: true,
    },
    // {
    //   title: 'Gender',
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   width: 100,
    //   ellipsis: true,
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      width: 150,
      ellipsis: true,
      render: (station: Station | null) => station?.name || 'N/A',
    },
    // {
    //   title: 'Pumps',
    //   dataIndex: 'pumps',
    //   key: 'pumps',
    //   width: 150,
    //   ellipsis: true,
    //   render: (pumps: Pump[]) => pumps.map(p => p.pumpNumber).join(', ') || 'None',
    // },
    {
      title: 'OMC',
      dataIndex: 'omc',
      key: 'omc',
      width: 150,
      ellipsis: true,
      render: (omc: Omc | null) => omc?.name || 'N/A',
    },
     {
    title: 'Card',
    dataIndex: 'cardUrl',
    key: 'cardUrl',
    width: 100,
    render: (cardUrl: string) => (
      cardUrl ? (
        <Button
          type="link"
          icon={<EyeOutlined className="!text-[#064021]" />}
          onClick={() => {
            setPreviewImage(`${apiBase}/${cardUrl.replace(/\\/g, '/')}`);
            setPreviewVisible(true);
          }}
        />
      ) : (
        ''
      )
    ),
  },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      width: 50,
      ellipsis: true,
      render: (_: any, record: PumpAttendant) => (
        <Tooltip title="Edit">
          <Button
            type="link"
            icon={<EditOutlined className="!text-[#064021]" />}
            onClick={() => {
              setSelectedAttendant(record);
              setEditModalVisible(true);
              editForm.setFieldsValue({
                name: record.name,
                nationalId: record.nationalId,
                contact: record.contact,
                gender: record.gender,
                cardUrl: record.cardUrl,
                email: record.email,
                stationId: record.station?.id,
                omcId: record.omc?.id,
                pumpIds: record.pumps.map(p => p.id),
              });
              if (record.station?.id) {
                fetchPumps(record.station.id);
              }
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const uploadProps: UploadProps = {
  name: 'cardImage',
  multiple: false,
  accept: '.jpg,.jpeg,.png',
  maxCount: 1,
  beforeUpload: (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      toast.error('Image must be smaller than 1MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent automatic upload, handle it manually in form submission
  },
  onChange: ({ fileList }) => {
    // Update form field with the selected file
    form.setFieldsValue({ cardImage: fileList });
    editForm.setFieldsValue({ cardImage: fileList });
  },
};

  return (
    <div className="flex flex-col min-h-screen px-2 py-4">
      <div className="w-full max-w-full mx-auto">
        <h2 className="text-xl font-bold text-[#3C3939] mb-4 text-center">
          Pump Attendants
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-end mb-3 gap-2">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              className="!bg-[#064021] hover:!bg-[#0e522e] !border-0"
            >
              Add Pump Attendant
            </Button>
          </Space>
          <Input
            placeholder="Search attendants by name, national ID, contact, email, station, or OMC"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="rounded-md border-[#a9a7a7] w-full sm:w-auto"
            allowClear
            style={{ maxWidth: '250px' }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredAttendants}
          rowKey="id"
          loading={loading}
          className="rounded-md"
          scroll={{ x: 'max-content' }}
          size="large"
          pagination={{ pageSize: 10 }}
        />
        {/* Create Pump Attendant Modal */}
        <Modal
          title="Create New Pump Attendant"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            form.resetFields();
            setPumps([]);
          }}
          footer={null}
          className="centered-modal"
        >
          <Form
            form={form}
            onFinish={handleCreateAttendant}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              name="nationalId"
              label="National ID"
              rules={[{ required: true, message: 'Please enter national ID' }]}
            >
              <Input placeholder="Enter national ID" />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact"
              rules={[{ required: true, message: 'Please enter contact number' }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="cardImage"
              label="Upload Card Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[{ required: true, message: 'Please upload a card image' }]}
            >
              <Upload.Dragger {...uploadProps} className="w-full custom-dragger">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-2xl text-[#625E5C]" />
                </p>
                <p className="ant-upload-text text-blue-500 font-medium">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint text-gray-500">
                  JPG, JPEG, PNG less than 1MB
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Form.Item
              name="omcId"
              label="OMC"
              rules={[{ required: true, message: 'Please select an OMC' }]}
            >
              <Select
                placeholder="Select OMC"
                onChange={(value) => {
                  form.setFieldsValue({ omcId: value, stationId: undefined, pumpIds: [] });
                  setPumps([]);
                }}
              >
                {omcs.map((omc) => (
                  <Option key={omc.id} value={omc.id}>
                    {omc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {(() => {
              const omcId = Form.useWatch('omcId', form);
              return (
                <Form.Item
                  name="stationId"
                  label="Station"
                  rules={[{ required: true, message: 'Please select a station' }]}
                >
                  <Select
                    placeholder="Select station"
                    disabled={!omcId}
                    onChange={(value) => {
                      form.setFieldsValue({ pumpIds: [] });
                      fetchPumps(value);
                    }}
                  >
                    {getFilteredStations(omcId).map((station) => (
                      <Option key={station.id} value={station.id}>
                        {station.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            })()}
            {(() => {
              const stationId = Form.useWatch('stationId', form);
              return (
                <Form.Item
                  name="pumpIds"
                  label="Pumps"
                  rules={[{ required: false }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select pumps"
                    disabled={!stationId}
                    allowClear
                  >
                    {pumps.map((pump) => (
                      <Option key={pump.id} value={pump.id}>
                        {pump.pumpNumber}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            })()}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!bg-[#064021] hover:!bg-[#0e522e] !border-0"
                >
                  Create
                </Button>
                <Button
                  className="!bg-[#c95757] !border-0"
                  onClick={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                    setPumps([]);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
        {/* Edit Pump Attendant Modal */}
        <Modal
          title="Edit Pump Attendant"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedAttendant(null);
            editForm.resetFields();
            setPumps([]);
          }}
          footer={null}
          className="centered-modal"
        >
          <Form
            form={editForm}
            onFinish={handleUpdateAttendant}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              name="nationalId"
              label="National ID"
              rules={[{ required: true, message: 'Please enter national ID' }]}
            >
              <Input placeholder="Enter national ID" />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact"
              rules={[{ required: true, message: 'Please enter contact number' }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="cardImage"
              label="Upload Card Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[{ required: false, message: 'Please upload a card image' }]} // Optional for edit
            >
              <Upload.Dragger {...uploadProps} className="w-full custom-dragger">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-2xl text-[#625E5C]" />
                </p>
                <p className="ant-upload-text text-blue-500 font-medium">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint text-gray-500">
                  JPG, JPEG, PNG less than 1MB
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: false },
                {
                  validator: async (_, value) => {
                    if (value && value.length < 6) {
                      return Promise.reject(new Error('Password must be at least 6 characters'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password placeholder="Enter new password (optional)" />
            </Form.Item>
            <Form.Item
              name="omcId"
              label="OMC"
              rules={[{ required: true, message: 'Please select an OMC' }]}
            >
              <Select
                placeholder="Select OMC"
                onChange={(value) => {
                  editForm.setFieldsValue({ omcId: value, stationId: undefined, pumpIds: [] });
                  setPumps([]);
                }}
              >
                {omcs.map((omc) => (
                  <Option key={omc.id} value={omc.id}>
                    {omc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {(() => {
              const omcId = Form.useWatch('omcId', editForm);
              return (
                <Form.Item
                  name="stationId"
                  label="Station"
                  rules={[{ required: true, message: 'Please select a station' }]}
                >
                  <Select
                    placeholder="Select station"
                    disabled={!omcId}
                    onChange={(value) => {
                      editForm.setFieldsValue({ pumpIds: [] });
                      fetchPumps(value);
                    }}
                  >
                    {getFilteredStations(omcId).map((station) => (
                      <Option key={station.id} value={station.id}>
                        {station.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            })()}
            {(() => {
              const stationId = Form.useWatch('stationId', editForm);
              return (
                <Form.Item
                  name="pumpIds"
                  label="Pumps"
                  rules={[{ required: false }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select pumps"
                    disabled={!stationId}
                    allowClear
                  >
                    {pumps.map((pump) => (
                      <Option key={pump.id} value={pump.id}>
                        {pump.pumpNumber}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            })()}
            <Form.Item>
              <div className="flex justify-between">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="!bg-[#064021] hover:!bg-[#0e522e] !border-0"
                  >
                    Update
                  </Button>
                  <Button
                    className="!bg-[#999696] !border-0"
                    onClick={() => {
                      setEditModalVisible(false);
                      setSelectedAttendant(null);
                      editForm.resetFields();
                      setPumps([]);
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
                <Button
                  className="!bg-[#b95a5a] !border-0"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setConfirmDeleteVisible(true)}
                  loading={loading}
                >
                  Delete
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          open={confirmDeleteVisible}
          onOk={handleDeleteAttendant}
          onCancel={() => setConfirmDeleteVisible(false)}
          okText="Delete"
          okButtonProps={{
            danger: true,
            className: '!bg-[#b95a5a]',
            loading: loading,
          }}
          cancelButtonProps={{ disabled: loading, className: '!bg-[#999696]' }}
          className="centered-modal"
        >
          <p>
            Are you sure you want to delete this pump attendant? This action cannot be undone.
          </p>
        </Modal>
        {/* Image Preview Modal */}
        <Modal
          open={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          centered
          width={400}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt="Attendant Card"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Attendants;