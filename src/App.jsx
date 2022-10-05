import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';
import AddProductPage from './pages/AddProductPage';
import AllProductsPage from './pages/AllProductsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={'stats'} />
          <Route path="stats" element={'thống kê'} />
          <Route path="all-products" element={<AllProductsPage />} />
          <Route path="add-product" element={<AddProductPage />} />
        </Route>
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
