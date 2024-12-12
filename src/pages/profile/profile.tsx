import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Input,
  PasswordInput,
  Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile.module.css';
import { AppDispatch, RootState } from '../../services/store';
import { logoutUser, updateUser } from '../../services/auth/auth-slice';
import { User } from '../../utils/types';

const ProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user) as User;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/react-burger/login'))
      .catch(console.error);
  };

  const handleSave = () => {
    dispatch(updateUser({ name, email, password }))
      .unwrap()
      .then(() => {
        setPassword('');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении данных пользователя:', error);
      });
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  };

  return (
    <div className={`${styles.wrapper} mt-20`}>
      <nav className={styles.navigation}>
        <NavLink
          to="/react-burger/profile"
          end
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/react-burger/profile/orders"
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
          }
        >
          История заказов
        </NavLink>
        <NavLink
          to="/react-burger/logout"
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
          }
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Выход
        </NavLink>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <div className={styles.content}>
        {location.pathname === '/react-burger/profile' && (
          <div>
            <div className={styles.form}>
              <Input
                type="text"
                placeholder="Имя"
                onChange={onNameChange}
                value={name}
                name="name"
                icon="EditIcon"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Input
                type="email"
                placeholder="Логин"
                onChange={onEmailChange}
                value={email}
                name="email"
                icon="EditIcon"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <PasswordInput
                onChange={onPasswordChange}
                value={password}
                name="password"
              />
            </div>
            <div className={styles.buttons}>
              <Button type="primary" onClick={handleSave} htmlType={'submit'}>
                Сохранить
              </Button>
              <Button
                type="secondary"
                onClick={handleCancel}
                htmlType={'submit'}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
