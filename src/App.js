import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import ProvidersList from "./screens/Providers";
import ClientServices from "./screens/ClientServices";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageProviders from "./screens/ManageProviders";
import Buckets from "./screens/Buckets";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/providersList" element={<ProvidersList />} />
            <Route path="/client/services" element={<ClientServices />} />
            <Route path="/manage/providers" element={<ManageProviders />} />
            <Route path="/buckets" element={<Buckets />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
