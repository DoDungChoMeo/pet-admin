import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';
import AddProductsPage from '~/pages/AddProductsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AddProductsPage />} />
          <Route path="san-pham" element={<AddProductsPage />} />
          <Route path="thong-ke" element={'thống kê'} />
        </Route>
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
