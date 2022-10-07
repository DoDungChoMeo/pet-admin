import React from 'react';
import { Tabs } from 'antd';

import {
  ProductsTable,
  AddProductForm,
  AddCategory,
  AddBrand,
} from '~/components';

function ProductsPage() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Thêm sản phẩm" key="1">
        <AddProductForm />
        <ProductsTable />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Thêm danh mục" key="2">
        <AddCategory />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Thêm nhãn hiệu" key="3">
        <AddBrand />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default ProductsPage;
