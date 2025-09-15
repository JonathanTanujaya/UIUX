import React from 'react';
import AppWithModernNavigation from './AppWithModernNavigation';
import './App.css';
import QueryProvider from './providers/QueryProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <QueryProvider>
      <AppWithModernNavigation />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </QueryProvider>
  );
}

export default App;
