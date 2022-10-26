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
import { useFirestoreCollection, useFirestoreDocument } from '~/hooks';
import { formatVietnamCurrency } from '~/utils';
import styled from 'styled-components';
import {
  getFirestore,
  query,
  doc,
  getDocs,
  where,
  collection,
  writeBatch,
} from 'firebase/firestore';
import _ from 'lodash';

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
  const [products] = useFirestoreCollection('products');
  const [inventories] = useFirestoreCollection(`inventories`);
  const firestore = getFirestore();

  const handleDelete = (productId) => {
    // deleteDoc(doc(db, "cities", "DC"));
    // const batch = writeBatch(firestore);
    // const inventoriesColection = collection(firestore, 'inventories');
    // const q = query(inventoriesColection, where('productId', '==', productId));
    // getDocs(q).then((querySnapshot) =>
    //   querySnapshot.forEach((doc) => {
    //     batch.delete(doc);
    //   })
    // );
    // const productRef = doc(firestore, `product/${productId}`);
    // batch.delete(productRef);
    // batch
    //   .commit()
    //   .then(() => {
    //     message.success('Xóa thành công');
    //   })
    //   .catch((e) => {
    //     message.error('Xóa thất bại');
    //     console.log('Xóa thất bại: ', e);
    //   });
  };

  let dataTable = [];
  if (products.length > 0) {
    dataTable = products.map((product) => {
      const index = _.findIndex(inventories, { productId: product?.productId });

      return {
        key: product?.productId,
        photo: <Image width={80} src={product?.images[0]} />,
        title: product?.title,
        price: inventories[index]?.price,
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
