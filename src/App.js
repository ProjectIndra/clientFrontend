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
import DocsMainPage from "./docs/components/docsMainPage.js";
import ManageClients from "./screens/ManageClients.js";
import PageWrapper from "./components/PageWrapper"; // Add this line

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/providersList" element={<PageWrapper><ProvidersList /></PageWrapper>} />
            <Route path="/client/services" element={<PageWrapper><ClientServices /></PageWrapper>} />
            <Route path="/manage/providers" element={<PageWrapper><ManageProviders /></PageWrapper>} />
            <Route path="/manage/clients" element={<PageWrapper><ManageClients /></PageWrapper>} />
            <Route path="/buckets" element={<PageWrapper><Buckets /></PageWrapper>} />
            <Route path="/docs" element={<PageWrapper><DocsMainPage /></PageWrapper>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
