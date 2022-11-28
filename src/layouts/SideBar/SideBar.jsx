import React from 'react';
import { Link } from 'react-router-dom';
import { BsBox } from 'react-icons/bs';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ImageSource from '~/assets/img/logo-pet-friends-2.png';

const menu = [
  {
    label: 'Tất cả sản phẩm',
    link: '/product/list',
    icon: <BsBox />,
  },
  {
    label: 'Thêm sản phẩm',
    link: '/product/new',
    icon: <PlusCircleOutlined />,
  },
  {
    label: 'Đơn đặt hàng',
    link: '/order/list',
    icon: <BsFillCartCheckFill />,
  },
];
function SideBar({ collapsed }) {
  // const { t, i18n } = useTranslation();

  return (
    <>
      {/* <MobileTablet collapsed={collapsed}>
        <figure>
          <img src={ImageSource} />
        </figure>
        <ul>
          {menu.map((item, index) => {
            return (
              <li key={index}>
                <Link to={item.link}>
                  <span>{item.label}</span>
                  {item.icon}
                </Link>
              </li>
            );
          })}
        </ul>
      </MobileTablet> */}

      <Desktop collapsed={collapsed}>
        <figure>
          <img src={ImageSource} />
        </figure>
        <ul>
          {menu.map((item, index) => {
            return (
              <li key={index}>
                <Link to={item.link}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Desktop>
    </>
  );
}

const MobileTablet = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }

  @media (min-width: 576px) {
  }

  position: fixed;
  inset: var(--header-height) 0 0 0;
  z-index: 1;
  display: ${({ collapsed }) => (collapsed ? 'none' : 'flex')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 2rem;
  background-color: #fff;

  figure {
    img {
      display: block;
      width: 100px;
    }
  }

  ul {
    list-style-type: none;

    li {
      margin-bottom: 10px;
    }

    a {
      color: var(--text-color);
      text-transform: capitalize;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      &:hover {
        color: var(--ant-primary-color);
      }
    }
  }
`;

const Desktop = styled.aside`
  @media (max-width: 991.18px) {
    display: none;
  }

  background-color: var(--white-color);
  min-height: 100vh;
  width: 200px;
  display: ${({ collapsed }) => (collapsed ? 'none' : 'flex')};
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-size: 1rem;
  padding: 1rem;

  figure {
    img {
      display: block;
      width: 50px;
    }
  }

  ul {
    list-style-type: none;

    li {
      margin-bottom: 10px;
    }

    a {
      color: var(--text-color);
      text-transform: capitalize;
      display: flex;
      gap: 10px;
      align-items: center;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: var(--ant-primary-color);
        transform: translate(2px, 0);
      }
    }
  }
`;

export default SideBar;
