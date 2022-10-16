import React from 'react';
import { Table, Typography, Button, Image, Space } from 'antd';
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
    title: 'SKU phân loại',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'Phân loại',
    dataIndex: 'classification',
    key: 'classification',
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
        photo: <Image width={80} src={product?.images[0]} />,
        title: product?.title,
        price: product?.inventories.map((inven) => (
          <div>{formatVietnamCurrency(inven.price)}</div>
        )),
        sku: product?.inventories.map((inven) => <div>{inven.sku}</div>),
        classification: product?.inventories.map((inven) => (
          <div>
            <span>{inven.size}, </span>
            <span>{inven.color}, </span>
            <span>{inven.material}</span>
          </div>
        )),
        stock: product?.inventories.map((inven) => <div>{inven.stock}</div>),
        action: (
          <>
            <Space direction="vertical" size="small">
              <Button>Cập nhật</Button>
              <Button danger>Xóa</Button>
            </Space>
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
