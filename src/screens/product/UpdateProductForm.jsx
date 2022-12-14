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
        message.success('C???p nh???t s???n ph???m th??nh c??ng');
        setSubmitLoading(false);
        navigate('/product/list');
      })
      .catch(() => {
        message.error('C???p nh???t s???n ph???m th???t b???i');
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
      <Typography.Title level={2}>C???p nh???t s???n ph???m</Typography.Title>
      <Typography.Title level={4}>Th??ng tin c?? b???n</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[20, 0]}>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label="t??n s???n ph???m"
              rules={[
                { required: true, message: 'Kh??ng ???????c ????? tr???ng t??n s???n ph???m' },
              ]}
            >
              <Input placeholder="Nh???p v??o" />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="brand"
              label="th????ng hi???u"
              rules={[{ required: true, message: 'Kh??ng ???????c ????? tr???ng ??' }]}
            >
              <Select placeholder="Vui l??ng ch???n">
                <Option key="dang-cap-nhat" value="??ang c???p nh???t">
                  ??ang c???p nh???t
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
              label="danh m???c s???n ph???m"
              rules={[{ required: true, message: 'Kh??ng ???????c ????? tr???ng ??' }]}
            >
              <Select mode="multiple" placeholder="Vui l??ng ch???n">
                <Option key="tat-ca-san-pham" value="T???t c??? s???n ph???m">
                  T???t c??? s???n ph???m
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
              label="h??nh ???nh s???n ph???m"
              name="upload"
              rules={[{ required: true, message: 'Vui l??ng t???i ???nh l??n' }]}
            >
              <Upload
                multiple={true}
                accept="image/*"
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
              >
                <Button icon={<UploadOutlined />}>T???i ???nh l??n</Button>
              </Upload>
            </Form.Item>
          </Col> */}
          <Col span={16} md={16} lg={16}>
            <Form.Item name="description" label="m?? t??? s???n ph???m">
              <Input.TextArea rows={4} placeholder="Nh???p m?? t??? cho s???n ph???m" />
            </Form.Item>
          </Col>

          <div style={{ width: '100%', height: 20 }} />
          <Col span={24}>
            <Typography.Title level={4}>Th??ng tin b??n h??ng</Typography.Title>
          </Col>
          <Col span={24}>{/* <DynamicFormList /> */}</Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name={'price'}
              label="gi?? b??n"
              rules={[
                {
                  required: true,
                  message: 'Kh??ng ???????c ????? tr???ng ??',
                },
              ]}
            >
              <InputNumber
                placeholder="Nh???p v??o"
                min={0}
                style={{ width: '100%' }}
                prefix="???"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name={'stock'}
              label="s??? l?????ng th??m v??o kho"
              rules={[
                {
                  required: true,
                  message: 'Kh??ng ???????c ????? tr???ng ??',
                },
              ]}
            >
              <InputNumber
                placeholder="Nh???p v??o"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name={'status'}
              label="Tr???ng th??i"
              tooltip="???n: Kh??ch h??ng kh??ng th??? nh??n th???y s???n ph???m trong shop. C?? th??? thay ?????i sau"
              rules={[
                {
                  required: true,
                  message: 'Kh??ng ???????c ????? tr???ng ??',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={'visible'}>Hi???n th???</Radio>
                <Radio value={'hidden'}>???n</Radio>
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
            C???p nh???t s???n ph???m
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
