import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, List } from 'antd';
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

const apiBase = import.meta.env.VITE_BASE_URL;

const RegisteredOMC: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOmc, setSelectedOmc] = useState<Omc | null>(null);
  const [form] = Form.useForm();
  const [omcData, setOmcData] = useState<Omc[]>([]);

  // Fetch OMCs on component mount
  useEffect(() => {
    const fetchOmcData = async () => {
      try {
        const response = await axios.get<Omc[]>(`${apiBase}/user/omcs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setOmcData(response.data);
      } catch (error) {
        console.error('Error fetching OMC data:', error);
        toast.error('Failed to fetch OMCs');
      }
    };
    fetchOmcData();
  }, []);

  // Handle opening the edit modal
  const showModal = (omc: Omc) => {
    setSelectedOmc(omc);
    form.setFieldsValue({
      name: omc.name,
      location: omc.location,
      logo: omc.logo || '',
      contactPerson: omc.contactPerson || '',
      contact: omc.contact,
      email: omc.email || '',
      products: omc.products || [],
    });
    setIsModalOpen(true);
  };

  // Handle modal submission
  const handleOk = () => {
    form
          .validateFields()
    .then(async (values) => {
      try {
        const payload = {
          name: values.name,
          location: values.location,
          logo: values.logo || undefined,
          contactPerson: values.contactPerson || undefined,
          contact: values.contact,
          email: values.email || undefined,
          products: values.products.map((p: { name: string; price: string }) => ({
            name: p.name,
            price: parseFloat(p.price) || 0,
          })),
          };
         await axios.patch(`${apiBase}/user/omc/${selectedOmc!.id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
          // Update local OMC data
          setOmcData((prev) =>
            prev.map((omc) =>
              omc.id === selectedOmc!.id
                ? { ...omc, ...payload, products: payload.products }
                : omc
            )
          );
          setIsModalOpen(false);
          setSelectedOmc(null);
          form.resetFields();
          message.success('OMC updated successfully!');
          toast.success('OMC updated successfully!');
        } catch (error: any) {
          console.error('Error updating OMC:', error);
          toast.error(
            error.response?.data?.message || 'Failed to update OMC. Please try again.'
          );
        }
      })
      .catch((error) => {
        console.log('Validation Failed:', error);
        toast.error('Please fill in all required fields correctly.');
      });
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedOmc(null);
    form.resetFields();
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
                      ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${import.meta.env.VITE_SUPABASE_BUCKET}/${omc.logo}`
                      : '/bidi-logo.svg'
                  }
                  alt={`${omc.name} Logo`}
                  className="w-24 h-24 object-contain mr-6 bg-[#E2F3E9] rounded-md p-3 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#3C3939] mb-1">
                    {omc.name}
                  </h3>
                  <p className="text-sm text-[#625E5C] mb-1">{omc.location}</p>
                  <p className="text-sm text-[#625E5C]">{omc.contact}</p>
                </div>
              </div>
              {/* Second Section: Registration Number and Edit Button (Mobile/Tablet) */}
              <div className="flex-1 flex flex-col items-center lg:hidden space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    Registration No.
                  </h4>
                  <p className="text-base text-[#625E5C]">{`OMC-${omc.id}`}</p>
                </div>
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md !border-none hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => showModal(omc)}
                >
                  Edit
                </Button>
              </div>
              {/* Second Section: Registration Number (Laptop) */}
              <div className="hidden lg:flex flex-1 flex-col items-center">
                <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                  Registration Number
                </h4>
                <p className="text-base text-[#625E5C]">{`OMC-${omc.id}`}</p>
              </div>
              {/* Third Section: Edit Button (Laptop) */}
              <div className="hidden lg:flex flex-1 justify-end pr-4">
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#427c72] hover:!text-white"
                  onClick={() => showModal(omc)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal with Form */}
      <Modal
        title={<span className="text-xl font-bold">Edit OMC</span>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button
            className="font-semibold rounded-md !bg-[#5b6d6a] hover:!bg-[#3a4242] !border-none"
            key="cancel"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="!bg-[#1F806E] hover:!bg-[#427c72] !border-none"
          >
            Save
          </Button>,
        ]}
        bodyStyle={{ padding: '5px' }}
      >
        <Form form={form} layout="vertical" className="space-y-4">
          {/* OMC Name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter OMC name' }]}
            className="!mt-3"
          >
            <Input />
          </Form.Item>
          {/* Location */}
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input />
          </Form.Item>
          {/* Logo URL */}
          {/* <Form.Item
            label="Logo URL"
            name="logo"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item> */}
          {/* Contact Person */}
          <Form.Item
            label="Contact Person"
            name="contactPerson"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          {/* Contact */}
          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <Input />
          </Form.Item>
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: false, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input />
          </Form.Item>
          {/* Products */}
          <div>
            <h4 className="text-md font-bold text-[#3C3939] mb-2">Products</h4>
            <Form.List name="products">
              {(fields) => (
                <List
                  dataSource={fields}
                  renderItem={(field, _index) => (
                    <List.Item>
                      <div className="flex w-fit !space-x-4">
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          rules={[{ required: true, message: 'Product name is required' }]}
                          className="flex-1"
                        >
                          <Input disabled />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'price']}
                          rules={[{ required: true, message: 'Price is required' }]}
                          className="w-24"
                        >
                          <Input type="number" step="0.01" suffix={<span style={{ fontSize: '12px', color: '#625E5C'}}>/ltr</span>}/>
                        </Form.Item>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisteredOMC;