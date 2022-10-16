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
import styled from 'styled-components';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';

import { toKebabCase, removeVietnameseTones } from '~/utils';
import randomColor from '~/utils/randomColor';
import { useFirestoreCollection } from '~/hooks';
import { Spin } from '~/components';

function AddSelectList({ title, collectionName, keyName }) {
  const [collection, loading] = useFirestoreCollection(collectionName);
  const firestore = getFirestore();

  const handleAdd = (values) => {
    const { v } = values;
    const id = toKebabCase(removeVietnameseTones(v));
    const data = {
      id,
      k: keyName,
      v: v?.trim() || '',
    };

    setDoc(doc(firestore, `${collectionName}/${id}`), data)
      .then(() => {
        message.success('Thêm thành công');
      })
      .catch((e) => {
        message.error('Thêm thất bại');
      });
  };

  const handleDelete = (id) =>
    deleteDoc(doc(firestore, `${collectionName}/${id}`))
      .then(() => {
        message.info('Xóa thành công');
      })
      .catch((e) => {
        message.error('Xóa thất bại');
        console.log(e);
      });

  return (
    <Container>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form layout="inline" onFinish={handleAdd}>
            <Form.Item
              name="v"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
              <Input placeholder="Nhập vào" />
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
          <Spin spinning={loading}>
            <TagContainer>
              {collection.map((document) => (
                <TagStyled
                  color={randomColor([70, 150], [70, 150], [70, 150])}
                  key={document?.id}
                >
                  <span>{document?.v}</span>
                  <Popconfirm
                    title="Bạn có muốn xóa?"
                    onConfirm={() => handleDelete(document?.id)}
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
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  background-color: var(--white-color);
`;

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

export default AddSelectList;
