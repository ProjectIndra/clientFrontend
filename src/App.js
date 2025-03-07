import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom';
import './App.css';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import ProvidersList from './screens/Providers';
import ProviderServices from './screens/ProviderServices';
import ClientServices from './screens/ClientServices';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/providersList" element={<ProvidersList />} />
          <Route path="/provider/:id" element={<ProviderServices />} />
          <Route path="/client/services" element={<ClientServices />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
