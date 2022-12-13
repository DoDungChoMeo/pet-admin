import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Row,
  Col,
  Badge,
  message,
  Skeleton,
  Checkbox,
  Space,
} from 'antd';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Price } from '~/components';
import useFirestoreDocument from '~/hooks/useFirestoreDocument/useFirestoreDocument';

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, orderLoading] = useFirestoreDocument(`orders/${orderId}`);

  const handleCanceledCheck = (checked) => {
    const firestore = getFirestore();
    const orderRef = doc(firestore, `orders/${orderId}`);
    setDoc(
      orderRef,
      { status: checked ? 'canceled' : 'pending' },
      { merge: true }
    )
      .then(() => {
        message.success('Cập nhật trạng thái đơn hàng thành công');
      })
      .catch((e) => {
        message.error('Cập nhật trạng thái đơn hàng thất bại');
        console.log(e);
      });
  }

  const handleProcessedCheck = (checked) => {
    const firestore = getFirestore();
    const orderRef = doc(firestore, `orders/${orderId}`);
    setDoc(
      orderRef,
      { status: checked ? 'processed' : 'pending' },
      { merge: true }
    )
      .then(() => {
        message.success('Cập nhật trạng thái đơn hàng thành công');
      })
      .catch((e) => {
        message.error('Cập nhật trạng thái đơn hàng thất bại');
        console.log(e);
      });
  };

  return (
    <ContainerStyled>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Typography.Title level={3}>
            <span>Thông tin đơn hàng{'  '}</span>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <OrderProgress className="order-progress">{`  (Đơn hàng ${
                order?.status === 'processed' ? 'đã được xử lý' : 'canceled' ? 'đã bị hủy' : 'đang chờ xử lý'
              })`}</OrderProgress>

              {order?.status === 'processed' ? (
                <CheckCircleOutlined
                  style={{ marginLeft: 5, color: 'var(--ant-success-color)' }}
                />
              ) : null}

              {order?.status === 'canceled' ? (
                <CloseOutlined
                  style={{ marginLeft: 5, color: 'var(--ant-error-color)' }}
                />
              ) : null}
            </div>
          </Typography.Title>
        </Col>
        <Col span={24} lg={8}>
          <Typography.Title level={4}>Người đặt</Typography.Title>
          <UserInfo user={order?.user} loading={orderLoading} />
        </Col>
        <Col span={24} lg={8}>
          <Typography.Title level={4}>Phương thức thanh toán</Typography.Title>
          {orderLoading ? (
            <Skeleton active />
          ) : (
            <p>
              {order?.paymentMethod === 'cod'
                ? 'Thanh toán tiền mặt khi nhận hàng COD'
                : order?.paymentMethod}
            </p>
          )}
        </Col>
        <Col span={24} className="cart-info">
          <Typography.Title level={4}>
            Sản phẩm {order?.cart?.quantity}
          </Typography.Title>
          <CartInfo cart={order?.cart} loading={orderLoading} />
          <div className="footer-group">
            <strong className="total-price">
              <span>Tổng cộng: </span>
              <Price>{order?.cart?.total}</Price>
            </strong>
          </div>
        </Col>

        <Col span={24}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginLeft: 'auto' }}>
              <Space>
                <div>
                  <label
                    htmlFor="canceled-mark"
                    style={{
                      color: 'var(--ant-error-color)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Đánh dấu đơn hàng đã bị HỦY{' '}
                  </label>
                  <Checkbox
                    id="canceled-mark"
                    checked={order?.status === 'canceled'}
                    onChange={(e) => {
                      handleCanceledCheck(e.target.checked);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="processed-mark"
                    style={{
                      color: 'var(--ant-success-color)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Đánh dấu đơn hàng đã được XỬ LÝ{' '}
                  </label>
                  <Checkbox
                    id="processed-mark"
                    checked={order?.status === 'processed'}
                    onChange={(e) => {
                      handleProcessedCheck(e.target.checked);
                    }}
                  />
                </div>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </ContainerStyled>
  );
}

const ContainerStyled = styled.div`
  box-shadow: var(--box-shadow-0);
  padding: 20px;
  background-color: var(--white-color);

  .cart-info {
    .footer-group {
      float: right;
    }
    .total-price {
      margin-left: 20px;
    }
  }
`;

const OrderProgress = styled.span`
  font-size: 14px;
  color: #898989;
`;

function UserInfo({ user, loading }) {
  if (loading) {
    return <Skeleton active />;
  }
  return (
    <UserInfoStyled>
      <div>
        <p className="user-name">Họ tên: {user?.name}</p>
        <p className="user-phone">Số điện thoại: {user?.phone}</p>
        <p className="user-address">Địa chỉ: {user?.address}</p>
        <p className="user-email">Email: {user?.email}</p>
      </div>
    </UserInfoStyled>
  );
}

const UserInfoStyled = styled.div``;

// section cart
function CartInfo({ cart, loading }) {
  if (loading) {
    return <Skeleton active />;
  }
  return (
    <div>
      {cart?.products?.map((item) => {
        return <CartItem key={item.productId} item={item} />;
      })}
    </div>
  );
}

const CartItem = ({ item }) => {
  return (
    <CartItemStyled>
      <Badge count={item.quantity} showZero>
        <figure>
          <img src={item.image} alt={item.title} />
        </figure>
      </Badge>
      <p className="cart-item-title" title={item.title}>
        {item.title}
      </p>

      <div className="cart-item-price">
        <Price>{item.price * item.quantity}</Price>
      </div>
    </CartItemStyled>
  );
};

const CartItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 5px;

  .cart-item-title {
  }

  .cart-item-price {
    margin-left: auto;
    min-width: 100px;
    text-align: right;
  }

  figure {
    position: relative;
    display: block;
    min-width: 50px;
    border: 1px solid #ccc;
    &::before {
      content: '';
      width: 100%;
      display: block;
      padding-bottom: 100%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover; /* add object-fit */
    }
  }
`;

export default OrderDetailPage;
