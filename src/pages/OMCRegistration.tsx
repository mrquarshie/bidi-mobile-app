import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, message, type UploadFile, type UploadProps, InputNumber } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Dragger } = Upload;

const OMCRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const navigate = useNavigate();

  // Custom validation for file upload (size < 1MB, JPG/JPEG/PNG)
  const beforeUpload = (file: UploadFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG, JPEG, or PNG files!');
      return false;
    }
    const isLt1MB = file.size! / 1024 / 1024 < 1;
    if (!isLt1MB) {
      message.error('Image must be smaller than 1MB!');
      return false;
    }
    return true;
  };

  // Upload props for Dragger
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: beforeUpload,
    accept: 'image/jpeg,image/png',
    maxCount: 1,
    listType: 'picture',
    fileList,
    onChange(info) {
      setFileList(info.fileList);
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // Handle product selection change
  const handleProductChange = (value: string[]) => {
    setSelectedProducts(value);
    // Update form field to include price fields for selected products
    const products = value.map((name) => ({
      name,
      price: form.getFieldValue(`productPrice_${name}`) || 0,
    }));
    form.setFieldsValue({ products });
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('name', values.omcName);
      formData.append('location', values.omcLocation);
      if (values.email) {
        formData.append('email', values.email);
      }
      formData.append('contactPerson', values.contactPerson);
      formData.append('contact', values.contactNumber);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('logo', fileList[0].originFileObj);
      }

      // Prepare products array
      const products = selectedProducts.map((name) => ({
        name,
        price: parseFloat(form.getFieldValue(`productPrice_${name}`)) || 0,
      }));
      formData.append('products', JSON.stringify(products));

      // Get JWT token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        message.error('Please log in to register an OMC.');
        navigate('/login');
        return;
      }

      // Send POST request to register endpoint
      const response = await axios.post('http://localhost:3000/auth/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('OMC Registration submitted successfully!');
      form.resetFields();
      setFileList([]);
      setSelectedProducts([]);
      navigate('/dashboard'); // Adjust the redirect path as needed
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to register OMC. Please try again.';
      message.error(errorMessage);
    }
  };

  // Handle cancel button
  const onCancel = () => {
    form.resetFields();
    setFileList([]);
    setSelectedProducts([]);
    message.info('Form cancelled');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[20px] md:pl-[100px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-6">
          OMC Registration
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="p-6 rounded-lg"
        >
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Left Side: OMC Name, Location, Email */}
            <div className="flex-1">
              <Form.Item
                name="omcName"
                label="OMC Name"
                rules={[{ required: true, message: 'Please enter OMC Name' }]}
              >
                <Input className="rounded-md" />
              </Form.Item>
              <Form.Item
                name="omcLocation"
                label="OMC Location"
                rules={[{ required: true, message: 'Please enter OMC Location' }]}
              >
                <Input className="rounded-md" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email (Optional)"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input className="rounded-md" />
              </Form.Item>
            </div>
            {/* Right Side: Upload OMC Logo */}
            <div className="flex-1">
              <Form.Item
                name="omcLogo"
                label="Upload OMC Logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                rules={[{ required: false, message: 'Please upload an OMC logo' }]} // Made optional
              >
                <Dragger {...uploadProps} className="w-[90%] custom-dragger">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-2xl text-[#625E5C]" />
                  </p>
                  <p className="ant-upload-text text-blue-500 font-medium">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint text-gray-500">
                    JPG, JPEG, PNG less than 1MB
                  </p>
                </Dragger>
              </Form.Item>
            </div>
          </div>

          {/* Horizontal Border Line */}
          <div className="border-b border-[#625E5C]/20 mb-6"></div>

          {/* Lower Section: Contact Person, Contact Number, Products */}
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[{ required: true, message: 'Please enter Contact Person' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { required: true, message: 'Please enter Contact Number' },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            ]}
          >
            <Input className="rounded-md" type="tel" />
          </Form.Item>
          <Form.Item
            name="products"
            label="Products"
            rules={[{ required: true, message: 'Please select at least one product' }]}
          >
            <Select
              mode="multiple"
              allowClear
              className="rounded-md"
              placeholder="Select fuel products"
              onChange={handleProductChange}
              tagRender={({ label, onClose }) => (
                <span className="inline-flex items-center px-2 py-1 m-1 bg-green-100 text-green-800 rounded">
                  {label}
                  <span className="ml-2 cursor-pointer" onClick={onClose}>
                    &times;
                  </span>
                </span>
              )}
            >
              <Option value="Petrol">Petrol</Option>
              <Option value="Diesel">Diesel</Option>
              <Option value="Gas">Gas</Option>
              <Option value="V-Power">V-Power</Option>
            </Select>
          </Form.Item>

          {/* Dynamic Price Inputs for Selected Products */}
          {selectedProducts.map((product) => (
            <Form.Item
              key={product}
              name={`productPrice_${product}`}
              label={`Price for ${product} ($)`}
              rules={[
                { required: true, message: `Please enter price for ${product}` },
                { type: 'number', min: 0, message: 'Price must be a positive number' },
              ]}
            >
              <InputNumber
                className="rounded-md w-full"
                min={0}
                step={0.01}
                onChange={(value) => {
                  const products = selectedProducts.map((name) => ({
                    name,
                    price: name === product ? value : form.getFieldValue(`productPrice_${name}`) || 0,
                  }));
                  form.setFieldsValue({ products });
                }}
              />
            </Form.Item>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              className="!bg-[#1F806E] !text-white font-semibold rounded-md hover:!bg-[#4c857a] hover:!text-white !border-none"
              htmlType="submit"
            >
              Register
            </Button>
            <Button
              className="font-semibold rounded-md !bg-[#98C5BD] hover:!bg-[#abc0be] !border-none"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default OMCRegistration;