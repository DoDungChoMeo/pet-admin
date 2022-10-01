import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/layouts/MainLayout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={'home'} />
          <Route path="dashboard" element={'dashboard'} />
          <Route index element={'products'} />
          <Route index element={'users'} />
        </Route>
        <Route path="*" element={'404 page not found'} />
      </Routes>
    </div>
  );
}

export default App;
