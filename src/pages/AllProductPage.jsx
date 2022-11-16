import React from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { ProductTable } from '~/screens/product';

const items = [
  {
    label: 'Sản phẩm đang bán',
    key: 'product-visible',
    children: <ProductTable title="Danh sách sản phẩm đang được bày bán" productStatus="visible" />,
  }, // remember to pass the key prop
  {
    label: 'Sản phẩm đã ẩn',
    key: 'product-hidden',
    children: <ProductTable title="Danh sách sản phẩm đã ẩn" productStatus="hidden" />,
  },
  {
    label: 'Sản phẩm đã xóa',
    key: 'product-deleted',
    children: <ProductTable title="Danh sách sản phẩm đã xóa" productStatus="deleted" />,
  },
];

function AllProductPage() {
  return (
    <ContainerStyled className="all-product-page">
      <Tabs items={items} />
    </ContainerStyled>
  );
}

const ContainerStyled = styled.div`
  .ant-tabs-nav {
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .ant-tabs-tab {
    padding-left: 10px;
    padding-right: 10px;
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

export default AllProductPage;
