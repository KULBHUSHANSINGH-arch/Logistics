import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Functionality from './Components/Functionality';
import { useContext } from 'react';
import { AppContext } from './ContextAPI';
import Dashboard from './Components/Dashboard/Dashboard';
import Sidebar from './Sidebar';

function App() {
  const { token } = useContext(AppContext);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={token || localStorage.getItem('Token') ? <TempDash /> : <Functionality />} />
        <Route path="/*" element={token || localStorage.getItem('Token') ? <AppWithNavbar /> : <Functionality />} />
      </Routes>
    </Router>
  );
}

const TempDash = () => {
  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '220px' }}>
        <Dashboard />
      </div>
    </>
  );
};

const AppWithNavbar = () => (
  <>
    <Sidebar />
    <div style={{ marginLeft: '220px' }}>
      <Routes>
        <Route path="/nav" element={<Dashboard />} />
      </Routes>
    </div>
  </>
);

export default App;
