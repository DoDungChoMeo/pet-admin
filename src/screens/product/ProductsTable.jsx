import React from 'react';
import { Table, Typography } from 'antd';
import { useFirestoreCollection } from '~/hooks';
import styled from 'styled-components';

function ProductsTable() {
  const [products, productsLoading] = useFirestoreCollection('products');
  // console.log({ products, productsLoading });
  return (
    <Container>
      <Typography.Title level={2}>Danh sách sản phẩm</Typography.Title>
      <Table />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);
`;

export default ProductsTable;
