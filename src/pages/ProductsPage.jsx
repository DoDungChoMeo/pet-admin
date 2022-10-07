import React from 'react';
import { Tabs } from 'antd';

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
  return <Tabs defaultActiveKey="tab-1" items={tabItems} />;
}

export default ProductsPage;
