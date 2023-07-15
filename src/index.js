import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/app/store'
// import { ToastContainer } from 'react-toastify'
import { Toaster } from "react-hot-toast";
// import 'react-toastify/dist/ReactToastify.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize:'12px'
            },
          }} />
          <App />
          {/* <ToastContainer /> */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

