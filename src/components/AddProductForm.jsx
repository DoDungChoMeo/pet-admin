import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Row,
  Col,
  message,
} from 'antd';
import { ConsoleSqlOutlined, UploadOutlined } from '@ant-design/icons';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import toKebabCase from '~/utils/toKebabCase';
import removeVietnameseTones from '~/utils/removeVietnameseTones';
import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/leetb/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'petfriends';

function AddProductForm() {
  const firestore = getFirestore();
  const [fileList, setFileList] = useState([]);

  // const [defaultFileList, setDefaultFileList] = useState([]);
  // const [progress, setProgress] = useState(0);

  const handleSubmit = async (values) => {
    const {
      brand,
      category,
      description,
      price,
      stock,
      title,
      discountPercentage,
    } = values;

    //**Upload image to cloudianry */
    const formData = new FormData();
    formData.append('file', fileList[fileList.length - 1]);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData,
      });

      //**Add product to firestore */
      const timestamp = new Date().getTime();
      const data = {
        id: `${toKebabCase(
          removeVietnameseTones(title?.trim())
        )}--${timestamp}`,
        title: title?.trim() || '',
        brand: brand?.trim() || '',
        category: category?.trim() || '',
        description: description?.trim() || '',
        image: res.data.secure_url || '',
        price: (price && Number(price)) || 0,
        discountPercentage: (price && Number(discountPercentage)) || 0,
        stock: (price && Number(stock)) || 0,
        createAt: serverTimestamp(),
      };

      const productsRef = doc(firestore, `products/${data.id}`);
      setDoc(productsRef, data)
        .then(() => {
          message.success('Thêm sản phẩm thành công');
        })
        .catch(() => {
          message.error('Thêm sản phẩm thất bại');
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setFileList((prev) => [...prev, e.target.files[0]]);
  };

  return (
    <Container>
      <h1>Thêm sản phẩm</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[20, 0]}>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label="tên sản phẩm"
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="price"
              label="giá bán"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào giá bán',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="stock"
              label="số lượng thêm vào kho"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng',
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="brand" label="nhãn hiệu">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="description" label="mô tả sản phẩm">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="category" label="danh mục sản phẩm">
              <Select />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="discountPercentage" label="tỷ lệ chiết khấu">
              <InputNumber />
            </Form.Item>
          </Col>
          {/* <Col span={24} md={12} lg={8}>
            <Form.Item
              label="ảnhnh sản phẩm"
              // name="upload"
              // getValueFromEvent={normFile}
            >
              <Upload
                accept="image/*"
                listType="picture"
                defaultFileList={fileList}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col> */}
          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="ảnhnh sản phẩm"
              name="upload"
              rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
            >
              <input type="file" onChange={handleChange} />
              {/* <ul>
                {fileList.map((file, index) => (
                  <li key={index}>{file?.name}</li>
                ))}
              </ul> */}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button htmlType="submit" type="primary" size="large">
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  .ant-form-item-label {
    text-transform: capitalize;
  }

  h1 {
    margin-bottom: 2rem;
  }
`;

export default AddProductForm;
