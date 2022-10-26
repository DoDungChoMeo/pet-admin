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
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  doc,
  collection,
  setDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { toKebabCase, removeVietnameseTones } from '~/utils';
import { useFirestoreCollection } from '~/hooks';
import { useNavigate } from 'react-router-dom';
import uploadImages from './uploadImages';

const { Option } = Select;

function AddProductForm() {
  const navigate = useNavigate();
  const firestore = getFirestore();
  const [fileList, setFileList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, categoriesLoading] = useFirestoreCollection('categories');
  const [brands, brandsLoading] = useFirestoreCollection('brands');

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const { title, brand, categories, description, price, stock } = values;
    /**Upload image to cloudianry */
    try {
      const imageURLs = await uploadImages(fileList); // res image URLs

      //**Add product to firestore */
      const timestamp = new Date().getTime();

      const productRef = doc(collection(firestore, `products`));
      const productData = {
        productId: productRef.id,
        bookmarkName: `${toKebabCase(removeVietnameseTones(title?.trim()))}`,
        title: title?.trim(),
        brand: brand?.trim() || '',
        categories: categories,
        description: description?.trim() || '',
        images: imageURLs,
        createAt: serverTimestamp(),
      };

      const inventoryRef = doc(collection(firestore, 'inventories'));
      const inventoryData = {
        id: inventoryRef.id,
        productId: productData.productId,
        price: Number(price),
        stock: Number(stock),
        reservations: [],
        createAt: serverTimestamp(),
      };

      console.log(JSON.stringify({ productData, inventoryData }));
      const batch = writeBatch(firestore);
      batch.set(productRef, productData);
      batch.set(inventoryRef, inventoryData);
      batch
        .commit()
        .then(() => {
          message.success('Thêm sản phẩm thành công');
          setSubmitLoading(false);
          navigate('/product/list');
        })
        .catch(() => {
          message.error('Thêm sản phẩm thất bại');
          setSubmitLoading(false);
        });
    } catch (e) {
      console.log(e);
      message.error(e);
      setSubmitLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    const newFileList = fileList.map((file) => ({
      ...file,
      status: 'done',
    }));
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
            <Form.Item
              name="brand"
              label="thương hiệu"
              rules={[{ required: true, message: 'Không được để trống ô' }]}
            >
              <Select placeholder="Vui lòng chọn">
                <Option key="dang-cap-nhat" value="Đang cập nhật">
                  Đang cập nhật
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
            <Form.Item
              name="categories"
              label="danh mục sản phẩm"
              rules={[{ required: true, message: 'Không được để trống ô' }]}
            >
              <Select mode="multiple" placeholder="Vui lòng chọn">
                <Option key="tat-ca-san-pham" value="Tất cả sản phẩm">
                  Tất cả sản phẩm
                </Option>
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
          <Col span={24}>{/* <DynamicFormList /> */}</Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name={'price'}
              label="giá bán"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống ô',
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
              name={'stock'}
              label="số lượng thêm vào kho"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống ô',
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
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="submit-button"
            loading={submitLoading}
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
