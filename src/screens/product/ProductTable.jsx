import React from 'react';
import {
  Table,
  Typography,
  Button,
  Image,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import styled from 'styled-components';
import {
  getFirestore,
  query,
  where,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import _ from 'lodash';
import { useFirestoreQuery } from '~/hooks';
import { Price } from '~/components';

const columns = [
  {
    title: 'Hình ảnh',
    dataIndex: 'photo',
    key: 'photo',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Kho',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
    key: 'action',
  },
];

const STATUS_MAP = {
  visible: <Tag color="#87d068">Hiển thị</Tag>,
  hidden: <Tag color="#108ee9">Ẩn</Tag>,
  deleted: <Tag color="#f50">Đã xóa</Tag>,
};

function ProductTable({ title, productStatus }) {
  const firestore = getFirestore();
  const productQuery = query(
    collection(firestore, 'products'),
    where('status', '==', productStatus)
  );
  let [products] = useFirestoreQuery(productQuery);
  products = products?.sort((a, b) =>
    a.createAt < b.createAt ? 1 : a.createAt > b.createAt ? -1 : 0
  );

  const handleDelete = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    updateDoc(productRef, {
      status: 'deleted',
    })
      .then(() => {
        message.success('Xóa thành công');
      })
      .catch((e) => {
        message.error('Xóa thất bại: ', e);
      });
  };

  let dataTable = [];
  if (products.length > 0) {
    dataTable = products.map((product) => {
      return {
        key: product?.productId,
        photo: <Image width={80} src={product?.images[0]} />,
        title: product?.title,
        price: <Price>{product?.inventory?.price}</Price>,
        stock: product?.inventory?.stock,
        status: STATUS_MAP[product?.status],
        action: (
          <>
            <Space direction="vertical" size="small">
              <Button type="primary">Cập nhật</Button>
              <Popconfirm
                title="Bạn có muốn xóa?"
                okText="Xóa"
                cancelText="Không"
                onConfirm={() => handleDelete(product?.productId)}
              >
                <Button danger type="primary" style={{ width: '100%' }}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </>
        ),
      };
    });
  }

  return (
    <Container>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Table
        columns={columns}
        dataSource={dataTable}
        pagination={{
          pageSize: 5,
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);
`;

export default ProductTable;
