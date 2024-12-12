import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import AppHeader from '../app-header/app-header';

import styles from './app.module.css';
import LoginPage from '../../pages/login/login';
import RegisterPage from '../../pages/register/register';
import HomePage from '../../pages/home/home';
import ForgotPasswordPage from '../../pages/forgot-password/forgot-password';
import ResetPasswordPage from '../../pages/reset-password/reset-password';
import ProfilePage from '../../pages/profile/profile';
import OrdersHistoryPage from '../../pages/profile/order-history';
import OrderDetailsPage from '../../pages/profile/order-details';
import ProtectedRouteLogin from '../protected-routes/protected-route-for-login';
import ProtectedRouteElement from '../protected-routes/protected-route';
import { RootState } from '../../services/store';
import IngredientPage from '../../pages/ingredient/ingredient';
import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import {
  fetchIngredients,
  setCurrentIngredient,
} from '../../services/ingredients-slice/ingredients-slice';

import FeedDetailsPage from '../../pages/feed/feed-details';
import FeedPage from '../../pages/feed/feed';

const BASE_URL = '/react-burger';

function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation || location;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { ingredients, status } = useAppSelector((state) => state.ingredients);
  const currentIngredient = useAppSelector(
    (state) => state.ingredients.currentIngredient,
  );
  const passwordResetRequested = useAppSelector(
    (state) => state.auth.passwordResetRequested,
  );

  const shouldFetchIngredient = status === 'idle';

  useEffect(() => {
    if (shouldFetchIngredient) {
      dispatch(fetchIngredients());
    }
  }, [shouldFetchIngredient, dispatch]);

  useEffect(() => {
    const ingredientId = location.pathname.match(/\/ingredients\/(\w+)/)?.[1];
    if (ingredientId && ingredients.length > 0) {
      const ingredient = ingredients.find((item) => item._id === ingredientId);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }
  }, [location.pathname, dispatch, ingredients]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <AppHeader />
        <main>
          <Routes location={backgroundLocation}>
            <Route path="/react-burger">
              <Route path="/react-burger/" element={<HomePage />}></Route>

              <Route
                path="login"
                element={<ProtectedRouteLogin element={<LoginPage />} />}
              />
              <Route
                path="register"
                element={<ProtectedRouteLogin element={<RegisterPage />} />}
              />
              <Route
                path="forgot-password"
                element={
                  <ProtectedRouteLogin element={<ForgotPasswordPage />} />
                }
              />
              <Route
                path="reset-password"
                element={
                  passwordResetRequested ? (
                    <ProtectedRouteLogin element={<ResetPasswordPage />} />
                  ) : (
                    <Navigate to="forgot-password" replace />
                  )
                }
              />
              <Route
                path="profile"
                element={<ProtectedRouteElement element={<ProfilePage />} />}
              >
                <Route path="orders" element={<OrdersHistoryPage />} />
              </Route>
              <Route
                path="profile/orders/:id"
                element={
                  <ProtectedRouteElement
                    element={
                      <OrderDetailsPage className={styles.feedDetailsPage} />
                    }
                  />
                }
              />

              <Route path="ingredients/:id" element={<IngredientPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route
                path="feed/:id"
                element={<FeedDetailsPage className={styles.feedDetailsPage} />}
              />
            </Route>
          </Routes>

          {backgroundLocation !== location && (
            <Routes>
              <Route path="/react-burger">
                <Route
                  path="ingredients/:id"
                  element={
                    <Modal onClose={() => navigate(-1)}>
                      {currentIngredient ? (
                        <IngredientDetails ingredient={currentIngredient} />
                      ) : (
                        <p>Загрузка...</p>
                      )}
                    </Modal>
                  }
                />
                <Route
                  path="feed/:id"
                  element={
                    <Modal onClose={() => navigate(-1)}>
                      <FeedDetailsPage />
                    </Modal>
                  }
                />
                <Route
                  path="profile/orders/:id"
                  element={
                    <Modal onClose={() => navigate(-1)}>
                      <OrderDetailsPage />
                    </Modal>
                  }
                />
              </Route>
            </Routes>
          )}
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
