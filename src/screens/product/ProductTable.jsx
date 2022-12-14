import React from 'react';
import {
  Table,
  Typography,
  Button,
  Image,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import styled from 'styled-components';
import {
  getFirestore,
  query,
  where,
  collection,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import _ from 'lodash';
import { useFirestoreQuery } from '~/hooks';
import { Price } from '~/components';
import { useNavigate } from 'react-router-dom';

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
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
    responsive: ['sm'],
  },
  {
    title: 'Kho',
    dataIndex: 'stock',
    key: 'stock',
    responsive: ['sm'],
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    responsive: ['md'],
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
    key: 'action',
  },
];

const STATUS_MAP = {
  visible: <Tag color="#87d068">Hiển thị</Tag>,
  hidden: <Tag color="#108ee9">Ẩn</Tag>,
  deleted: <Tag color="#f50">Đã xóa</Tag>,
};

function ProductTable({ title, productStatus }) {
  const navigate = useNavigate();
  const firestore = getFirestore();
  const productQuery = query(
    collection(firestore, 'products'),
    where('status', '==', productStatus)
  );
  let [products] = useFirestoreQuery(productQuery);
  products = products?.sort((a, b) =>
    a.createAt < b.createAt ? 1 : a.createAt > b.createAt ? -1 : 0
  );

  const handleDelete = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    updateDoc(productRef, {
      status: 'deleted',
    })
      .then(() => {
        message.success('Xóa thành công');
      })
      .catch((e) => {
        message.error('Xóa thất bại');
      });
  };

  const handleDeletePermanently = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    deleteDoc(productRef)
      .then(() => {
        message.success('Xóa thành công');
      })
      .catch((e) => {
        message.error('Xóa thất bại');
      });
  };

  const handleRestore = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    updateDoc(productRef, {
      status: 'visible',
    })
      .then(() => {
        message.success('Khôi phục thành công');
      })
      .catch((e) => {
        message.error('Khôi phục thất bại');
      });
  }

  const handleHidden = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    updateDoc(productRef, {
      status: 'hidden',
    })
      .then(() => {
        message.success('Ẩn sản phẩm thành công');
      })
      .catch((e) => {
        message.error('Ẩn sản phẩm thất bại');
      });
  }

  const handleUnhidden = async (productId) => {
    const productRef = doc(firestore, `products/${productId}`);
    updateDoc(productRef, {
      status: 'visible',
    })
      .then(() => {
        message.success('Hiển thị thành công');
      })
      .catch((e) => {
        message.error('Hiển thị thất bại');
      });
  }

  let dataTable = [];
  if (products.length > 0) {
    dataTable = products.map((product) => {
      return {
        key: product?.productId,
        photo: <Image width={80} src={product?.images[0]} />,
        title: product?.title,
        price: <Price>{product?.inventory?.price}</Price>,
        stock: product?.inventory?.stock,
        status: STATUS_MAP[product?.status],
        action: (
          <>
            {product?.status === 'deleted' ? (
              <Space direction="vertical" size="small">
                <Popconfirm
                  title="Bạn có muốn khôi phục sản phẩm này?"
                  okText="Được"
                  cancelText="Không"
                  onConfirm={() => handleRestore(product?.productId)}
                >
                  <Button style={{ width: '100%'}}>
                    Khôi phục
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có muốn xóa sản phẩm này vĩnh viễn?"
                  okText="Xóa luôn"
                  okButtonProps={{danger: true}}
                  cancelText="Không"
                  onConfirm={() => handleDeletePermanently(product?.productId)}
                >
                  <Button danger type="primary" style={{ width: '100%' }}>
                    Xóa vĩnh viễn
                  </Button>
                </Popconfirm>
              </Space>
            ) :
            product?.status === 'hidden'
            ? 
            <Space direction="vertical" size="small">
                <Button type="primary" style={{ width: '100%' }} onClick={()=>{
                  navigate(`/product/${product?.productId}`)
                }}>
                  Cập nhật
                </Button>

                <Popconfirm
                  title="Bạn có muốn xóa?"
                  okText="Xóa"
                  okButtonProps={{danger: true}}
                  cancelText="Không"
                  onConfirm={() => handleDelete(product?.productId)}
                >
                  <Button danger type="primary" style={{ width: '100%' }}>
                    Xóa
                  </Button>
                </Popconfirm>
                

                <Popconfirm
                  title="Bạn có muốn hiển thị sản phẩm này?"
                  okText="Được"
                  cancelText="Không"
                  onConfirm={() => handleUnhidden(product?.productId)}
                >
                  <Button style={{ width: '100%' }}>
                    Hiển thị
                  </Button>
                </Popconfirm>
              </Space>
            :(
              <Space direction="vertical" size="small">
                <Button type="primary" style={{ width: '100%' }} onClick={()=>{
                  navigate(`/product/${product?.productId}`)
                }}>
                  Cập nhật
                </Button>
                
                <Popconfirm
                  title="Bạn có muốn ẩn sản phẩm này?"
                  okText="Được"
                  cancelText="Không"
                  onConfirm={() => handleHidden(product?.productId)}
                >
                  <Button style={{ width: '100%' }}>
                    Ẩn
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Bạn có muốn xóa?"
                  okText="Xóa"
                  okButtonProps={{danger: true}}
                  cancelText="Không"
                  onConfirm={() => handleDelete(product?.productId)}
                >
                  <Button danger type="primary" style={{ width: '100%' }}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </>
        ),
      };
    });
  }

  return (
    <Container>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Table
        columns={columns}
        dataSource={dataTable}
        pagination={{
          pageSize: 5,
          position: ["topRight"],
          simple: true
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);
`;

export default ProductTable;
