import React, { useState, useEffect } from 'react';
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
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { toKebabCase, removeVietnameseTones } from '~/utils';
import randomColor, { ranInt } from '~/utils/randomColor';
import styled from 'styled-components';

const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

function AddCategory() {
  const [categories, setCategories] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'categories'),
      (snapshot) => {
        setCategories(snapshot.docs.map((e) => e.data()));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = (values) => {
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
        message.success('Xóa thành công');
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
          <Form layout="inline" onFinish={handleSubmit}>
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
