import React from 'react';
import {
  Input,
  Row,
  Col,
  Button,
  Form,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { toKebabCase, removeVietnameseTones } from '~/utils';
import randomColor from '~/utils/randomColor';
import styled from 'styled-components';
import { useFirestoreCollection } from '~/hooks';
import { Spin } from '~/components';

function AddCategory() {
  const [categories, categoriesLoading] = useFirestoreCollection('categories');
  const firestore = getFirestore();

  const handleAdd = (values) => {
    const { category } = values;
    const id = toKebabCase(removeVietnameseTones(category));
    const data = {
      id,
      category: category?.trim() || '',
    };
    setDoc(doc(firestore, `categories/${id}`), data)
      .then(() => {
        message.success('Thêm thành công');
      })
      .catch((e) => {
        message.error('Thêm thất bại');
      });
  };

  const handleDelete = (id) =>
    deleteDoc(doc(firestore, `categories/${id}`))
      .then(() => {
        message.info('Xóa thành công');
      })
      .catch((e) => {
        message.error('Xóa thất bại');
        console.log(e);
      });

  return (
    <div>
      <Typography.Title level={2}>Thêm danh mục sản phẩm</Typography.Title>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form layout="inline" onFinish={handleAdd}>
            <Form.Item
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên danh mục',
                },
              ]}
            >
              <Input placeholder="Tên danh mục" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                icon={<PlusCircleOutlined />}
              >
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={24}>
          <Spin spinning={categoriesLoading}>
            <TagContainer>
              {categories.map((category) => (
                <TagStyled
                  color={randomColor([70, 150], [70, 150], [70, 150])}
                  key={category?.id}
                >
                  <span>{category?.category}</span>
                  <Popconfirm
                    title="Bạn có muốn xóa danh mục này?"
                    onConfirm={() => handleDelete(category?.id)}
                    okText="Xóa"
                    cancelText="Không"
                    okButtonProps={{ danger: true }}
                  >
                    <CloseOutlined />
                  </Popconfirm>
                </TagStyled>
              ))}
            </TagContainer>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

const TagContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const TagStyled = styled.li`
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  color: var(--white-color);
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  padding: 2px 6px;

  svg {
    margin-left: 4px;
    &:hover {
      color: #ccc;
      transform: translate(0, -1px);
    }
  }
`;

export default AddCategory;
