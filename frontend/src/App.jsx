import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Welcome } from "./pages/Welcome";
import { Profile } from "./pages/Profile";
import { SocketProvider } from "./context/SocketProvider";

function PrivateRoute({ children }) {
  const token = localStorage.getItem(import.meta.env.VITE_JWT_KEY);
  return token ? children : <Navigate to="/login" replace />;
}

export const App = () => (
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        {/* Public welcome page */}
        <Route path="/" element={<Welcome />} />

        {/* Private Home */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Private Profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);

export default App;
