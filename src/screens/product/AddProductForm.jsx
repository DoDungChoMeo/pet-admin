import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  message,
  Typography,
  Upload,
  Space,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { toKebabCase, removeVietnameseTones } from '~/utils';
import { useFirestoreCollection } from '~/hooks';
const { Option } = Select;

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/leetb/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'petfriends';

const uploadImages = async (fileList) => {
  const imageURLs = [];
  const config = {
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  for (const file of fileList) {
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await axios({ ...config, data: formData });
    imageURLs.push(res.data.secure_url);
  }

  return new Promise((resolve) => {
    resolve(imageURLs);
  });
};

function AddProductForm() {
  const firestore = getFirestore();
  const [fileList, setFileList] = useState([]);
  const [categories, categoriesLoading] = useFirestoreCollection('categories');
  const [brands, brandsLoading] = useFirestoreCollection('brands');

  const handleSubmit = async (values) => {
    const { title, brand, categories, description, price, stock } = values;

    //**Upload image to cloudianry */
    try {
      const imageURLs = await uploadImages(fileList); // res image URLs

      //**Add product to firestore */
      const timestamp = new Date().getTime();
      const productData = {
        productId: `${toKebabCase(
          removeVietnameseTones(title?.trim())
        )}--${timestamp}`,
        title: title?.trim() || '',
        brand: brand?.trim() || '',
        categories: categories,
        description: description?.trim() || '',
        images: imageURLs,
        createAt: serverTimestamp(),
      };

      const inventoryData = {
        productId: productData.productId,
        stock: (stock && Number(stock)) || 0,
        price: (price && Number(price)) || 0,
        createAt: serverTimestamp(),
      };

      console.log({ productData, inventoryData });

      const batch = writeBatch(firestore);

      // add to product collection
      const productRef = doc(firestore, `products/${productData.productId}`);
      batch.set(productRef, productData);

      // add to inventory collection
      const inventoryRef = doc(
        firestore,
        `inventories/${inventoryData.productId}`
      );
      batch.set(inventoryRef, inventoryData);

      batch
        .commit()
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

  const handleUploadChange = ({ fileList }) => {
    const newFileList = fileList.map((file) => ({ ...file, status: 'done' }));
    setFileList(newFileList);
  };

  return (
    <Container>
      <Typography.Title level={2}>Thêm sản phẩm</Typography.Title>
      <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[20, 0]}>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label="tên sản phẩm"
              rules={[
                { required: true, message: 'Không được để trống tên sản phẩm' },
              ]}
            >
              <Input placeholder="Nhập vào" />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item name="brand" label="thương hiệu">
              <Select placeholder="Vui lòng chọn">
                <Option key="no-brand" value="No brand">
                  No brand
                </Option>
                {brands.map((brand) => (
                  <Option key={brand.id} value={brand.brand}>
                    {brand.brand}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="categories" label="danh mục sản phẩm">
              <Select mode="multiple" placeholder="Vui lòng chọn">
                {categories.map((category) => (
                  <Option key={category.id} value={category.category}>
                    {category.category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="hình ảnh sản phẩm"
              name="upload"
              rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
            >
              <Upload
                multiple={true}
                accept="image/*"
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={16} md={16} lg={16}>
            <Form.Item name="description" label="mô tả sản phẩm">
              <Input.TextArea rows={4} placeholder="Nhập mô tả cho sản phẩm" />
            </Form.Item>
          </Col>

          <div style={{ width: '100%', height: 20 }} />
          <Col span={24}>
            <Typography.Title level={4}>Thông tin bán hàng</Typography.Title>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="price"
              label="giá bán"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập vào"
                min={0}
                style={{ width: '100%' }}
                prefix="₫"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="stock"
              label="số lượng thêm vào kho"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập vào"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          {/* <div style={{ width: '100%', height: 20 }} />
          <Col span={24}>
            <Typography.Title level={4}>Thông tin khác</Typography.Title>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="size" label="kích thước">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="color" label="màu sắc">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="material" label="chất liệu">
              <Input />
            </Form.Item>
          </Col> */}
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="submit-button"
          >
            Thêm sản phẩm
          </Button>
        </div>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);

  .ant-form-item-label {
    text-transform: capitalize;
  }

  .submit-button {
    @media screen and (max-width: 576px) {
      width: 100%;
    }
  }
`;

export default AddProductForm;
