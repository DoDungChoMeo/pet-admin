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
        <footer>
          <p>Pet Friends ©2022 Made with love by Duc Tran</p>
        </footer>
      </div>
    </LayoutStyled>
  );
}

const LayoutStyled = styled.div`
  display: flex;

  footer {
    background-color: white;
    margin: 30px 50px;
    margin-bottom: 0;
    @media (max-width: 991.18px) {
      margin: 0;
      margin-top: 30px;
    }
    padding: 30px 20px;
    border-radius: 2px;
  }
`;

const ContentStyled = styled.main`
  min-height: 70vh;
  margin: 30px 50px;
  @media (max-width: 991.18px) {
    margin: 0;
  }
`;

export default MainLayout;
