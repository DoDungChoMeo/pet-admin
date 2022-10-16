import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';
import AllProductPage from '~/pages/AllProductPage';
import AddProductPage from '~/pages/AddProductPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AllProductPage />} />
          <Route path="product">
            <Route path="list" element={<AllProductPage />} />
            <Route path="new" element={<AddProductPage />} />
          </Route>
        </Route>
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
