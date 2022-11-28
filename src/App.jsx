import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';
import AllProductPage from '~/pages/AllProductPage';
import AddProductPage from '~/pages/AddProductPage';
import UpdateProductPage from '~/pages/UpdateProductPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AllProductPage />} />
          <Route path="product">
            <Route path="list" element={<AllProductPage />} />
            <Route path="new" element={<AddProductPage />} />
            <Route path=":productId" element={<UpdateProductPage />} />
          </Route>
          <Route path="order">
            <Route path="list" element={<OrderListPage />} />
            <Route path=":orderId" element={<OrderDetailPage />} />
          </Route>
        </Route>
        <Route path='auth' element={"auth"} />
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
