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
  Radio,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  doc,
  getFirestore,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { toKebabCase, removeVietnameseTones } from '~/utils';
import { useFirestoreCollection } from '~/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import uploadImages from './uploadImages';
import { useEffect } from 'react';

const { Option } = Select;

function UpdateProductForm() {
  const [form] = Form.useForm();
  const [defaultValues, setDefaultValues] = useState({});
  const navigate = useNavigate();
  const firestore = getFirestore();
  const [fileList, setFileList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, categoriesLoading] = useFirestoreCollection('categories');
  const [brands, brandsLoading] = useFirestoreCollection('brands');
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, `products/${productId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDefaultValues({
          ...data,
          price: data.inventory.price,
          stock: data.inventory.stock,
        });
      } else {
        console.log('No such document!');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [form, defaultValues]);

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const { title, brand, categories, description, price, stock, status } =
      values;
      
    //**Add product to firestore */
    const productData = {
      productId,
      bookmarkName: `${toKebabCase(removeVietnameseTones(title?.trim()))}`,
      title: title?.trim(),
      brand: brand?.trim() || '',
      categories: categories,
      description: description?.trim() || '',
      status: status,
      createAt: serverTimestamp(),
    };

    const inventoryData = {
      productId,
      price: Number(price),
      stock: Number(stock),
      reservations: [],
      createAt: serverTimestamp(),
    };

    // console.log(({ ...productData, inventory: inventoryData }));
    const productRef = doc(firestore, `products/${productId}`)
    updateDoc(productRef, { ...productData, inventory: inventoryData })
      .then(() => {
        message.success('Cập nhật sản phẩm thành công');
        setSubmitLoading(false);
        navigate('/product/list');
      })
      .catch(() => {
        message.error('Cập nhật sản phẩm thất bại');
        setSubmitLoading(false);
      });
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
      <Typography.Title level={2}>Cập nhật sản phẩm</Typography.Title>
      <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                  <Option key={brand.id} value={brand.value}>
                    {brand.value}
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
                  <Option key={category.id} value={category.value}>
                    {category.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={24} md={12} lg={8}>
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
          </Col> */}
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
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name={'status'}
              label="Trạng thái"
              tooltip="Ẩn: Khách hàng không thể nhìn thấy sản phẩm trong shop. Có thể thay đổi sau"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống ô',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={'visible'}>Hiển thị</Radio>
                <Radio value={'hidden'}>Ẩn</Radio>
              </Radio.Group>
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
            Cập nhật sản phẩm
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

export default UpdateProductForm;
