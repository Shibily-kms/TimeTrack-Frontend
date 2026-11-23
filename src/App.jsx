import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { connection } from './redux/features/user/systemSlice'
import PageLoading from './components/common/spinners/PageLoading';
import Master from './Master';
import Cookies from 'js-cookie';


const UserLogin = lazy(() => import('./pages/user/login/Login'))
const ForgotPassword = lazy(() => import('./pages/user/login/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/user/login/ResetPassword'))


function App() {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.systemInfo);

  // Theme and Network
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

    const cookieOptions = {
      secure: true, 
      sameSite: 'None',
      path: '/',
      domain: '.alliancedev.in', 
      expires: new Date(new Date().setMonth(new Date().getMonth() + 6))
    };

    // Initial Theme Setup
    if (theme === 'os-default') {
      root.className = 'os-default';
      Cookies.set('color_mode', 'os-default', cookieOptions)
    } else if (theme === 'dark') {
      root.className = 'dark';
      Cookies.set('color_mode', 'dark', cookieOptions)
    } else {
      root.className = 'light';
      Cookies.set('color_mode', 'light', cookieOptions)
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
          {/* WithOut Header, Footer and Auth */}
          <Route path='/auth/sign-in' element={<UserLogin />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route path='/auth/setup-new-password' element={<ResetPassword />} />

          {/* Routes */}
          <Route element={<Master />} path='/*' />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
