import React from 'react';
import { Table, Typography, Button, Image } from 'antd';
import { useFirestoreCollection } from '~/hooks';
import { formatVietnamCurrency } from '~/utils';
import styled from 'styled-components';

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
    title: 'Thao tác',
    dataIndex: 'action',
    key: 'action',
  },
];

function ProductTable() {
  const [products, productsLoading] = useFirestoreCollection('products');
  let dataTable = [];
  if (products.length > 0) {
    dataTable = products.map((product) => {
      return {
        photo: <Image width={100} src={product?.images[0]} />,
        title: product?.title,
        price: formatVietnamCurrency(product?.inventory.price),
        stock: product?.inventory.stock,
        action: (
          <>
            <Button danger>Delete</Button>
          </>
        ),
      };
    });
  }

  console.log(dataTable);
  return (
    <Container>
      <Typography.Title level={2}>Danh sách sản phẩm</Typography.Title>
      <Table columns={columns} dataSource={dataTable} />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);
`;

export default ProductTable;
