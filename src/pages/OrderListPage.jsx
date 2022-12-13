import React from 'react';
import styled from 'styled-components';
import { List, Typography, Tabs } from 'antd';

import { Order } from '~/components';
import useFirestoreQuery from '~/hooks/useFirestoreQuery/useFirestoreQuery';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

const { Title } = Typography;

function OrderListPage() {
  const items = [
    {
      label: 'Đang chờ',
      key: 'order-pending',
      children: <OrderList status={'pending'} />,
    },
    {
      label: 'Đã xử lý',
      key: 'order-processed',
      children: <OrderList status={'processed'} />,
    },
    {
      label: 'Đã hủy',
      key: 'order-canceled',
      children: <OrderList status={'canceled'} />,
    },
  ];

  return (<>
    <ContainerStyled className="order-list-page">
      <Tabs items={items} />
    </ContainerStyled>
  </>
  );
}

function OrderList({ status }) {
  const firestore = getFirestore();
  const ordersRef = collection(firestore, 'orders');
  const q = query(
    ordersRef,
    where("status", "==", status),
  );
  const [orders, ordersLoading] = useFirestoreQuery(q);

  return (
    <>
      <Title level={2}>{`Danh sách đơn đặt hàng ${status==="processed" && 'đã xử lý' || status==="canceled" && 'đã bị hủy' || status==="pending" && 'đang chờ' } (${orders.length})`}</Title>
      <List
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <Order order={item} />
          </List.Item>
        )}
      />
    </>
  );
}

const ContainerStyled = styled.div`
  min-height: 70vh;
  padding: 20px;
  background: white;
`;

export default OrderListPage;
