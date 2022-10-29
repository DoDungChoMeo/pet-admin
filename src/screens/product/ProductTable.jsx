import React from 'react';
import {
  Table,
  Typography,
  Button,
  Image,
  Space,
  Popconfirm,
  message,
} from 'antd';
import styled from 'styled-components';
import {
  getFirestore,
  query,
  where,
  collection,
  doc,
  updateDoc,
  writeBatch,
  runTransaction,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import _ from 'lodash';
import { useFirestoreQuery } from '~/hooks';
import { Price } from '~/components';

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
  },
  {
    title: 'Kho',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
    key: 'action',
  },
];

function ProductTable() {
  const firestore = getFirestore();
  const productQuery = query(
    collection(firestore, 'products'),
    where('status', 'not-in', ['deleted'])
  );
  const [products] = useFirestoreQuery(productQuery);
  const inventoryQuery = query(
    collection(firestore, 'inventories'),
    where('status', 'not-in', ['deleted'])
  );
  const [inventories] = useFirestoreQuery(inventoryQuery);
  console.log({ products, inventories });

  const handleDelete = async (productId) => {
    try {
      const batch = writeBatch(firestore);
      const productRef = doc(firestore, `products/${productId}`);
      batch.update(productRef, {
        status: 'deleted',
      });

      const inventoryQuery = query(
        collection(firestore, `inventories`),
        where('productId', '==', productId)
      );
      const res = await getDocs(inventoryQuery);
      const inventoryRef = await res.docs[0].ref;
      batch.update(inventoryRef, {
        status: 'deleted',
      });
      batch
        .commit()
        .then(() => {
          message.success('Xóa thành công');
        })
        .catch((e) => {
          message.error('Xóa thất bại: ', e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  let dataTable = [];
  if (products.length > 0) {
    dataTable = products.map((product) => {
      const index = _.findIndex(inventories, { productId: product?.productId });

      return {
        key: product?.productId,
        photo: <Image width={80} src={product?.images[0]} />,
        title: product?.title,
        price: <Price>{inventories[index]?.price}</Price>,
        stock: inventories[index]?.stock,
        action: (
          <>
            <Space direction="vertical" size="small">
              <Button>Cập nhật</Button>
              <Popconfirm
                title="Bạn có muốn xóa?"
                okText="Xóa"
                cancelText="Không"
                onConfirm={() => handleDelete(product?.productId)}
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          </>
        ),
      };
    });
  }

  return (
    <Container>
      <Typography.Title level={2}>Danh sách sản phẩm</Typography.Title>
      <Table columns={columns} dataSource={dataTable} />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  background: var(--white-color);
`;

export default ProductTable;
