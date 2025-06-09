import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DogSearchPage from './pages/DogSearchPage';
import LoginPage from './pages/LoginPage';


const App = ()  =>  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<DogSearchPage />} />

      </Routes>
    </Router>
  );
}

export default App
