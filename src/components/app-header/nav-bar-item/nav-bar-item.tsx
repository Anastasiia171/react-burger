import React from 'react';
import styles from './nav-bar-item.module.css';

interface NavBarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  setActive: () => void;
}

const NavBarItem: React.FC<NavBarItemProps> = ({
  icon,
  text,
  isActive = false,
  setActive,
}) => {
  return (
    <li
      className={`${styles.navItem} pr-5 pl-5 pt-4 pb-4 `}
      onClick={setActive}
    >
      {icon}
      <span
        className={`text text_type_main-default ml-2 ${isActive ? 'text_color_primary' : 'text_color_inactive'}`}
      >
        {text}
      </span>
    </li>
  );
};

export default NavBarItem;
