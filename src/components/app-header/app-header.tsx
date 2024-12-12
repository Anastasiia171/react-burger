import React, { useEffect, useState } from 'react';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import NavBarItem from './nav-bar-item/nav-bar-item';
import styles from './app-header.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

type Tab = 'Конструктор' | 'Лента заказов' | 'Личный кабинет';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  const [isActive, setIsActive] = useState<Tab>('Конструктор');

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/react-burger/profile')) {
      setIsActive('Личный кабинет');
    } else if (location.pathname.startsWith('/react-burger/feed')) {
      setIsActive('Лента заказов');
    } else {
      setIsActive('Конструктор');
    }
  }, [location.pathname]);

  return (
    <header className={`pt-4 pb-4 ${styles.header}`}>
      <div className={`${styles.container}`}>
        <ul className={styles.navList}>
          <NavBarItem
            icon={
              <BurgerIcon
                type={isActive === 'Конструктор' ? 'primary' : 'secondary'}
              />
            }
            text="Конструктор"
            isActive={isActive === 'Конструктор'}
            setActive={() => {
              navigate('/react-burger');
            }}
          />
          <NavBarItem
            icon={
              <ListIcon
                type={isActive === 'Лента заказов' ? 'primary' : 'secondary'}
              />
            }
            text="Лента заказов"
            isActive={isActive === 'Лента заказов'}
            setActive={() => {
              navigate('/react-burger/feed');
            }}
          />
        </ul>
        <div
          className={`${styles.logo}`}
          onClick={() => navigate('/react-burger')}
          style={{ cursor: 'pointer' }}
        >
          <Logo />
        </div>
        <ul className={styles.navList}>
          <NavBarItem
            icon={
              <ProfileIcon
                type={isActive === 'Личный кабинет' ? 'primary' : 'secondary'}
              />
            }
            text="Личный кабинет"
            isActive={isActive === 'Личный кабинет'}
            setActive={() => {
              navigate('/react-burger/profile');
            }}
          />
        </ul>
      </div>
    </header>
  );
};

export default AppHeader;
