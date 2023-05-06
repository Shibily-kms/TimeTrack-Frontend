import { Routes, Route } from 'react-router-dom'
import Admin from './routes/Admin';
import User from './routes/User';


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
