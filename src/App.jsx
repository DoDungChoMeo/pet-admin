import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';
import ProductsPage from '~/pages/ProductsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ProductsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="stats" element={'thống kê'} />
        </Route>
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
