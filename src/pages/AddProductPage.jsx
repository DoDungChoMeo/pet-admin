import React from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { AddProductForm, AddSelectList } from '~/screens/product';

const tabItems = [
  {
    label: 'Thêm sản phẩm',
    key: 'tab-1',
    children: (
      <>
        <AddProductForm />
      </>
    ),
  },
  {
    label: 'Thêm danh mục',
    key: 'tab-2',
    children: (
      <>
        <AddSelectList
          title="Thêm danh mục sản phẩm"
          collectionName="categories"
        />
      </>
    ),
  },
  {
    label: 'Thêm nhãn hiệu',
    key: 'tab-3',
    children: (
      <>
        <AddSelectList title="Thêm nhãn hiệu" collectionName="brands" />
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
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background: var(--white-color);
    padding: 4px 8px;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

export default ProductsPage;
