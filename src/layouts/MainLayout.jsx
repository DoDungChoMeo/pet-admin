import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from './SideBar';
import Header from './Header';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutStyled className="main-layout">
      <SideBar collapsed={collapsed} />
      <div style={{ width: '100%' }}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <ContentStyled>
          <Outlet />
        </ContentStyled>
      </div>
    </LayoutStyled>
  );
}

const LayoutStyled = styled.div`
  display: flex;
`;

const ContentStyled = styled.main`
  margin: 30px 50px;
  @media (max-width: 991.18px) {
    margin: 0;
  }
`;

export default MainLayout;
