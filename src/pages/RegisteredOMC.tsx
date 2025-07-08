import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const RegisteredOMC: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [form] = Form.useForm();

  // Placeholder OMC data (replace with actual data)
  const omcData = [
    {
      logo: '/goil-logo.svg',
      name: 'Goil',
      location: 'Accra, Ghana',
      phone: '030-123-4567',
      regNumber: 'OMC-123456',
    },
    {
      logo: '/total-logo.svg',
      name: 'Total Energies',
      location: 'Tema, Ghana',
      phone: '030-234-5678',
      regNumber: 'OMC-789012',
    },
    {
      logo: '/shell-logo.svg',
      name: 'Shell',
      location: 'Kumasi, Ghana',
      phone: '030-345-6789',
      regNumber: 'OMC-345678',
    },
    {
      logo: '/allied-logo.svg',
      name: 'Allied',
      location: 'Takoradi, Ghana',
      phone: '030-456-7890',
      regNumber: 'OMC-901234',
    },
    {
      logo: '/staroil-logo.svg',
      name: 'Star Oil',
      location: 'Cape Coast, Ghana',
      phone: '030-567-8901',
      regNumber: 'OMC-567890',
    },
    {
      logo: '/zenoil-logo.svg',
      name: 'Zen Oil',
      location: 'Tamale, Ghana',
      phone: '030-678-9012',
      regNumber: 'OMC-678901',
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form Values:', values);
        setIsModalOpen(false);
        setProducts([]);
        form.resetFields();
      })
      .catch((error) => {
        console.log('Validation Failed:', error);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setProducts([]);
    form.resetFields();
  };

  const handleAddProduct = (product: string) => {
    if (!products.includes(product)) {
      setProducts([...products, product]);
    }
  };

  const handleRemoveProduct = (product: string) => {
    setProducts(products.filter((p) => p !== product));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] md:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-6">
          Registered OMC
        </h2>
        <div className="space-y-4">
          {omcData.map((omc, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center p-6 rounded-lg shadow-md bg-white"
            >
              {/* First Section: Logo, Name, Location, Phone */}
              <div className="flex-1 flex items-center mb-4 lg:mb-0">
                <img
                  src={omc.logo}
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
                    {omc.phone}
                  </p>
                </div>
              </div>
              {/* Second Section: Registration Number and Add Station Button (Mobile/Tablet) */}
              <div className="flex-1 flex flex-col items-center lg:hidden space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-[#3C3939] mb-1">
                    Registration Number
                  </h4>
                  <p className="text-base text-[#625E5C]">
                    {omc.regNumber}
                  </p>
                </div>
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md !border-none hover:!bg-[#427c72] hover:!text-white"
                  onClick={showModal}
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
                  {omc.regNumber}
                </p>
              </div>
              {/* Third Section: Add Station Button (Laptop) */}
              <div className="hidden lg:flex flex-1 justify-end pr-4">
                <Button
                  className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#427c72] hover:!text-white"
                   onClick={showModal}
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
          <Button className='font-semibold rounded-md !bg-[#98C5BD] hover:!bg-[#abc0be] !border-none' key="cancel" onClick={handleCancel}>
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
                  <Option value="Ashanti">Ashanti</Option>
                  <Option value="Western">Western</Option>
                  {/* Add more regions as needed */}
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

          {/* Pump Number */}
          <Form.Item
            label="Pump Number"
            name="pumpNumber"
            rules={[{ required: true, message: 'Please enter pump number' }]}
          >
            <InputNumber min={0} step={0.1} className="w-full" />
          </Form.Item>

          {/* Add Product Section */}
          <div className="flex items-center space-x-4 mb-7">
            <Button className='!bg-[#1F806E] hover:!bg-[#427c72] !border-none'
              onClick={() => {
                const availableProducts = ['Petrol', 'Diesel', 'Gas'];
                const nextProduct = availableProducts.find(
                  (p) => !products.includes(p)
                );
                if (nextProduct) handleAddProduct(nextProduct);
              }}
              disabled={products.length >= 3}
            >
              Add Product
            </Button>
            <div className="flex space-x-2">
              {products.map((product) => (
                <div
                  key={product}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
                >
                  <span>{product}</span>
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveProduct(product)}
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