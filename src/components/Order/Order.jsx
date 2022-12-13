import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { setDoc, getFirestore, doc } from 'firebase/firestore';

import { timeDifference } from '~/utils';

function Order({ order }) {
  const handleClick = () => {
    if (!order.viewed) {
      const firesotre = getFirestore();
      const orderRef = doc(firesotre, `orders/${order.orderId}`);
      setDoc(orderRef, { viewed: true }, { merge: true });
    }
  };

  return (
    <Container viewed={order.viewed}>
      <Link
        onClick={handleClick}
        to={`/order/${order.orderId}`}
        style={{ color: 'inherit' }}
      >
        <OrderInfo>
          <p>
            <strong>Mã đơn hàng: </strong>
            <span>{order.orderId}</span>
          </p>
          <p>
            <strong>Người Đặt: </strong>
            <span>{order.user.name}</span>
          </p>
          <p>
            <strong>Email: </strong>
            <span>{order.user.email}</span>
          </p>
          <p>
            <strong>SĐT: </strong>
            <span>{order.user.phone}</span>
          </p>
          <p>
            <strong>Đặt lúc: </strong>
            <span>
              {order?.createAt &&
                timeDifference(new Date(), order?.createAt?.toDate())}
            </span>
          </p>
          <p>
            <strong>Trạng thái đơn hàng: </strong>
            <span style={{ display: 'inline-block' }}>
              {`${
                order?.status == 'processed' ? 'Đã xử lý' : order?.status == 'canceled' ? 'Đã bị hủy' : 'Đang chờ'
              }`}
            </span>
            {order?.status === 'processed' ? (
              <CheckCircleOutlined
                style={{ marginLeft: 5, color: 'var(--ant-success-color)', fontWeight: "bold" }}
              />
            ) : null}

            {order?.status === 'canceled' ? (
                <CloseOutlined
                  style={{ marginLeft: 5, color: 'var(--ant-error-color)' }}
                />
              ) : null}
          </p>
        </OrderInfo>
      </Link>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background: ${({ viewed }) => (viewed ? 'var(--ant-primary-1)' : 'initial')};
  padding: 10px;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  p {
    flex: 1 1 calc(100% / 7 - 10px);
  }

  strong,
  span {
    display: inline-block;
  }

  strong {
    margin-right: 6px;
  }
`;

export default Order;
