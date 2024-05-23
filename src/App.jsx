import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';
import { useDispatch, useSelector } from 'react-redux';
import { connection } from './redux/features/user/systemSlice'
import PageLoading from './components/common/spinners/PageLoading';
import Scanner from './pages/user/scanner/Scanner';

const UserLogin = lazy(() => import('./pages/user/login/Login'))
const AdminLogin = lazy(() => import('./pages/admin/login/Login'))
const QrCodeView = lazy(() => import('./pages/admin/qr-code-view/QrCodeView'))
const ZeroAuth = lazy(() => import('./pages/admin/0auth/ZeroAuth'))


function App() {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.systemInfo)

  useEffect(() => {
    dispatch(connection(navigator.onLine))
    const root = document.documentElement;

    const handleOnline = () => {
      dispatch(connection(true))
    };

    const handleOffline = () => {
      dispatch(connection(false))
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial Theme Setup
    if (theme === 'os-default') {
      root.className = 'os-default';
    } else if (theme === 'dark') {
      root.className = 'dark';
    } else {
      root.className = 'light';
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line
  }, []);


  return (
    <div className="App">
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* WithOut Header and Footer */}
          <Route path='/login' element={<UserLogin />} />
          <Route path='/qr-code' element={<QrCodeView />} />
          <Route path='/scanner' element={<Scanner />} />
          <Route path='/v1/0auth' element={<ZeroAuth />} />

          <Route path='/admin/login' element={<AdminLogin />} />

          {/* Routes */}
          <Route element={<Admin />} path='/admin/*' />
          <Route element={<User />} path='/*' />

        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
