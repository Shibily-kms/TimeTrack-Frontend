import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connection } from './redux/features/user/networkSlice'
import { toast } from 'react-hot-toast'


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(connection(navigator.onLine))
    const handleOnline = () => {
      dispatch(connection(true))
      toast.success('Back online')
    };

    const handleOffline = () => {
      dispatch(connection(false))
      toast.error('No connection')
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
    <div className="App" style={{ marginBottom: '50px' }}>
      <Routes>
        <Route element={<Admin />} path='/admin/*' />
        <Route element={<User />} path='/*' />
      </Routes>
    </div>
  );
}

export default App;
