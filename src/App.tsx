import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import LoginRequiredRoute from './features/auth/components/LoginRequiredRoute';
import { MainHubProvider } from './contexts/MainHubProvider';

function App() {

  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={
          <LoginRequiredRoute children={
            <MainHubProvider>
              <Main />
            </MainHubProvider>
          } />
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
