import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Admin from './routes/admin/Admin';
import User from './routes/user/User';


function App() {
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
