import './App.css';
import Login from './views/Login'
import Register from './views/Register'
import Map from './views/Map'
import { Route, Routes, BrowserRouter, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Parking from './views/Parking';
import Support from './views/Support';
import Vehicles from './views/Vehicles';
import AllVehicles from './views/AllVehicles';
import Success from './views/Success';
import PrivateRoute from './views/PrivateRoute'
import Profile from './views/Profile'


const App = () => {
  return (
    <AuthProvider>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Map />}>
                <Route path="/parking" element={<Parking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/allVehicles" element={<AllVehicles />} />
                <Route path="/support" element={<Support />} />
                <Route path="/success" element={<Success />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

