import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connection } from './redux/features/user/systemSlice'


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

    // const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const root = document.documentElement;

    if (theme === 'os-default') {
      root.className = 'os-default';
    } else if (theme === 'dark') {
      root.className = 'dark';
    } else {
      root.className = 'light';
    }

  }, [])

  return (
    <div className="App" style={{ marginBottom: '50px' }}>
      <Routes>
        <Route element={<Admin />} path='/admin/*' />
        <Route element={<User />} path='/*' />
      </Routes>
    </div>
  );
}

export default App;
