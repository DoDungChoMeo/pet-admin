import React, { useState } from 'react';
import styled from 'styled-components';
import { HiMenuAlt1 } from 'react-icons/hi';

function Header({ collapsed, setCollapsed }) {
  return (
    <Container>
      <MenuButton
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <HiMenuAlt1 />
      </MenuButton>
    </Container>
  );
}

const Container = styled.header`
  background-color: var(--white-color);
  height: var(--header-height);
  display: flex;
  align-items: center;
`;

const MenuButton = styled.div`
  font-size: 3rem;
  color: var(--ant-primary-color);
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    color: var(--ant-primary-color-hover);
  }
`;

export default Header;
