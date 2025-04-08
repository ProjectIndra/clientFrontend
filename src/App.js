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
import PageWrapper from "./components/PageWrapper";

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
          <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/providersList" element={<PageWrapper><ProvidersList /></PageWrapper>} />
          <Route path="/client/services" element={<PageWrapper><ClientServices /></PageWrapper>} />
          <Route path="/manage/providers" element={<PageWrapper><ManageProviders /></PageWrapper>} />
          <Route path="/buckets" element={<PageWrapper><Buckets /></PageWrapper>} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
