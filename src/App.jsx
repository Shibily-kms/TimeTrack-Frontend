import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';
import { useDispatch, useSelector } from 'react-redux';
import { connection } from './redux/features/user/systemSlice'
import PageLoading from './components/common/spinners/PageLoading';
const Login = lazy(() => import('./pages/user/login/Login'))


function App() {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.systemInfo)


  useEffect(() => {
    dispatch(connection(navigator.onLine))
    const handleOnline = () => {
      dispatch(connection(true))
    };

    const handleOffline = () => {
      dispatch(connection(false))
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'os-default') {
      root.className = 'os-default';
    } else if (theme === 'dark') {
      root.className = 'dark';
    } else {
      root.className = 'light';
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Admin />} path='/admin/*' />
          <Route element={<User />} path='/*' />

          {/* WithOut Header and Footer */}
          <Route path='/login' element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
