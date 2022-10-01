import React from 'react';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div>
      <header>header</header>
      <Outlet />
      <footer>footer</footer>
    </div>
  );
}

export default MainLayout;
