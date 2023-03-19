import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './contexts/app.context'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import RegisterLayout from './layouts/RegisterLayout/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import UserLayout from './pages/User/Layout/UserLayout'
import CartLayout from './layouts/CartLayout'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Profile = lazy(() => import('./pages/User/Profile'))
const ChangePassword = lazy(() => import('./pages/User/ChangePassword'))
const HistoryPurchases = lazy(() => import('./pages/User/HistoryPurchases'))

function ProtecedRouter() {
  const { isAuthen } = useContext(AppContext)
  return isAuthen ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRouter() {
  const { isAuthen } = useContext(AppContext)
  return !isAuthen ? <Outlet /> : <Navigate to='/' />
}

export default function useRouterElements() {
  const routerElement = useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },

    { path: '*', element: <Navigate to='/' replace /> },

    {
      path: ':nameId',
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtecedRouter />,
      children: [
        {
          path: 'cart',
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: 'user/profile',
          element: (
            <MainLayout>
              <UserLayout>
                <Suspense>
                  <Profile />
                </Suspense>
              </UserLayout>
            </MainLayout>
          )
        },
        {
          path: 'user/password',
          element: (
            <MainLayout>
              <UserLayout>
                <Suspense>
                  <ChangePassword />
                </Suspense>
              </UserLayout>
            </MainLayout>
          )
        },
        {
          path: 'user/purchase',
          element: (
            <MainLayout>
              <UserLayout>
                <Suspense>
                  <HistoryPurchases />
                </Suspense>
              </UserLayout>
            </MainLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <RejectedRouter />,
      children: [
        {
          path: '/register',
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: '/login',
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routerElement
}
