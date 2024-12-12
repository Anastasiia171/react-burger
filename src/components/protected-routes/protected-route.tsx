import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { RootState, AppDispatch } from '../../services/store';
import { getUser } from '../../services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

const ProtectedRouteElement: React.FC<{
  element: JSX.Element;
  redirectTo?: string;
}> = ({ element, redirectTo = '/react-burger/login' }) => {
  const location = useLocation();
  const dispatch: AppDispatch = useAppDispatch();
  const { isAuthenticated, isUserLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated]);

  if (isUserLoading) {
    return <div>Загрузка данных</div>;
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

export default ProtectedRouteElement;
