import React from 'react';
import styled from 'styled-components';
import { List, Typography } from 'antd';

import { Order } from '~/components';
import useFirestoreCollection from '~/hooks/useFirestoreCollection/useFirestoreCollection';

const { Title } = Typography;

function OrderListPage() {
  const [orders, ordersLoading] = useFirestoreCollection('orders');

  return (
    <ContainerStyled className="order-list-page">
      <Title level={2}>Danh sách đơn đặt hàng</Title>
      <List
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <Order order={item} />
          </List.Item>
        )}
      />
    </ContainerStyled>
  );
}

const ContainerStyled = styled.div`
  min-height: 70vh;
  padding: 20px;
  background: white;
`;

export default OrderListPage;
