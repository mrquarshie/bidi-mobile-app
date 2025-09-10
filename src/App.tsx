import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AuthProvider, useAuth } from './AuthContext';
import OMCRegistration from './pages/OMCRegistration';
import RegisteredOMC from './pages/RegisteredOMC';
import { ToastContainer } from 'react-toastify';
import { Spin } from 'antd';
import Stations from './pages/Stations';
import Attendants from './pages/attendants';

const centeredSpinStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, isLoading } = useAuth();
 if (isLoading) {
    return (
      <div style={centeredSpinStyle}>
        <Spin size="large" />
      </div>
    );
  }
  if (!role) {
    console.log('No role, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  return (
   <div className="flex min-h-screen">
    <ToastContainer  position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
      <Sidebar />
      {/* Main content area */}
      <div className="flex-1 flex flex-col !bg-[#EEFFF6]">
        {/* Header */}
        <Header />
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 mt-[30px] ml-[2px] collapsed:ml-[80px]">
          <Outlet /> {/* Renders Home, etc. */}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Routes with Header and Sidebar */}
        <Route element={<MainLayout />}>
         <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
           <Route path="/register-omc"   element={
                <ProtectedRoute>
                  <OMCRegistration />
                </ProtectedRoute>
              } />
          <Route path="/registered-omc" element={
              <ProtectedRoute>
                <RegisteredOMC />
              </ProtectedRoute>
            } />
              <Route path="/stations" element={
              <ProtectedRoute>
                <Stations />
              </ProtectedRoute>
            } />
              <Route path ="/attendants" element={
              <ProtectedRoute>
                <Attendants />
              </ProtectedRoute>
            } />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;