import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Temporary Landing Page
const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">💼</h1>
        <h2 className="text-4xl font-bold mb-2">Expense Management System</h2>
        <p className="text-xl opacity-90">Building your frontend...</p>
        <div className="mt-8 space-x-4">
          <a href="/signin" className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block">
            Sign In
          </a>
          <a href="/signup" className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all inline-block">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

// Temporary Signin Page
const Signin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-medium w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <p className="text-center text-gray-600">Auth components coming soon...</p>
      </div>
    </div>
  );
};

// Temporary Signup Page
const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-medium w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <p className="text-center text-gray-600">Auth components coming soon...</p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
