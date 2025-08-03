import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AuthProvider } from './AuthContext';
import OMCRegistration from './pages/OMCRegistration';
import RegisteredOMC from './pages/RegisteredOMC';
import { ToastContainer } from 'react-toastify';

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
          <Route path="/" element={<Home />} />
           <Route path="/register-omc" element={<OMCRegistration />} />
          <Route path="/registered-omc" element={<RegisteredOMC />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;