import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connection } from './redux/features/user/networkSlice'


function App() {
  const dispatch = useDispatch()

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

  return (
    <div className="App">
      <Routes>
        <Route element={<User />} path='/*' />
        <Route element={<Admin />} path='/admin/*' />
      </Routes>
    </div>
  );
}

export default App;
