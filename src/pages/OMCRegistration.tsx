import React from 'react';
import { Form, Input, Select, Button, Upload, message, type UploadFile, type UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

const OMCRegistration: React.FC = () => {
  const [form] = Form.useForm();

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
    multiple: false, // Set to false since you want only one file
    beforeUpload: beforeUpload,
    accept: 'image/jpeg,image/png',
    maxCount: 1,
    listType: 'picture',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
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

  // Handle form submission
  const onFinish = (values: any) => {
    console.log('Form values:', values);
    message.success('OMC Registration submitted successfully!');
    form.resetFields();
  };

  // Handle cancel button
  const onCancel = () => {
    form.resetFields();
    message.info('Form cancelled');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pl-[260px] md:pl-[100px]">
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
            {/* Left Side: OMC Name and Location */}
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
                rules={[{ required: true, message: 'Please upload an OMC logo' }]}
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

          {/* Lower Section: Contact Person, Contact Number, Product */}
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
            label="Product"
            rules={[{ required: true, message: 'Please select at least one product' }]}
          >
            <Select
              mode="multiple"
              allowClear
              className="rounded-md"
              placeholder="Select fuel products"
              tagRender={({ label, onClose }) => (
                <span className="inline-flex items-center px-2 py-1 m-1 bg-green-100 text-green-800 rounded">
                  {label}
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={onClose}
                  >
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