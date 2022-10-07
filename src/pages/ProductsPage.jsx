import React from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import {
  ProductsTable,
  AddProductForm,
  AddCategory,
  AddBrand,
} from '~/screens/product';

const tabItems = [
  {
    label: 'Thêm sản phẩm',
    key: 'tab-1',
    children: (
      <>
        <AddProductForm />
        <ProductsTable />
      </>
    ),
  },
  {
    label: 'Thêm danh mục',
    key: 'tab-2',
    children: (
      <>
        <AddCategory />
      </>
    ),
  },
  {
    label: 'Thêm nhãn hiệu',
    key: 'tab-3',
    children: (
      <>
        <AddBrand />
      </>
    ),
  },
];

function ProductsPage() {
  return (
    <Container>
      <Tabs defaultActiveKey="tab-1" items={tabItems} />;
    </Container>
  );
}

const Container = styled.div`
  .ant-tabs-nav {
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .ant-tabs-nav-list {
    background: var(--white-color);
    padding: 4px 8px;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
`;

export default ProductsPage;
