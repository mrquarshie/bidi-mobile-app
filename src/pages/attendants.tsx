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
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import '../components/PersonnelSelection.css';

const { Option } = Select;
const { Text } = Typography;

interface Station {
  id: number;
  name: string;
  omcId: number; // Added to link station to OMC
}

interface Omc {
  id: number;
  name: string;
}

interface PumpAttendant {
  id: number;
  email: string;
  station: Station | null;
  omc: Omc | null;
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
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState<PumpAttendant | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Define API base URL
  const apiBase = import.meta.env.VITE_BASE_URL;

  // Fetch data
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

    // Fetch stations with omcId
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

    // Fetch OMCs
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

  // Search functionality
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAttendants(pumpAttendants);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = pumpAttendants.filter(
      (attendant) =>
        attendant.email.toLowerCase().includes(lowerQuery) ||
        attendant.station?.name.toLowerCase().includes(lowerQuery) ||
        attendant.omc?.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredAttendants(filtered);
  };

  // Create pump attendant
  const handleCreateAttendant = async (values: {
    email: string;
    password: string;
    stationId: number;
    omcId: number;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user/attendant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setPumpAttendants((prev) => [...prev, data]);
        setFilteredAttendants((prev) => [...prev, data]);
        setCreateModalVisible(false);
        form.resetFields();
        toast.success('Pump Attendant created successfully');
      } else {
        toast.error(data.message || 'Failed to create pump attendant');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create pump attendant');
    } finally {
      setLoading(false);
    }
  };

  // Update pump attendant
  const handleUpdateAttendant = async (values: {
    email?: string;
    password?: string;
    stationId?: number;
    omcId?: number;
  }) => {
    if (!selectedAttendant) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/user/update/attendants/${selectedAttendant.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setPumpAttendants((prev) =>
          prev.map((attendant) =>
            attendant.id === selectedAttendant.id ? { ...attendant, ...data } : attendant
          )
        );
        setFilteredAttendants((prev) =>
          prev.map((attendant) =>
            attendant.id === selectedAttendant.id ? { ...attendant, ...data } : attendant
          )
        );
        setEditModalVisible(false);
        editForm.resetFields();
        toast.success('Pump Attendant updated successfully');
      } else {
        toast.error(data.message || 'Failed to update pump attendant');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update pump attendant');
    } finally {
      setLoading(false);
    }
  };

  // Delete pump attendant
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

  // Filter stations based on selected OMC
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
    {
      title: 'OMC',
      dataIndex: 'omc',
      key: 'omc',
      width: 150,
      ellipsis: true,
      render: (omc: Omc | null) => omc?.name || 'N/A',
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
                email: record.email,
                stationId: record.station?.id,
                omcId: record.omc?.id,
              });
            }}
          />
        </Tooltip>
      ),
    },
  ];

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
            placeholder="Search attendants by email, station, or OMC"
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
                form.setFieldsValue({ omcId: value, stationId: undefined });
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
            { required: true, message: 'Please enter new password' },
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
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item
          name="omcId"
          label="OMC"
          rules={[{ required: true, message: 'Please select an OMC' }]}
        >
          <Select
            placeholder="Select OMC"
            onChange={(value) => {
              editForm.setFieldsValue({ omcId: value, stationId: undefined });
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
      </div>
    </div>
  );
};

export default Attendants;