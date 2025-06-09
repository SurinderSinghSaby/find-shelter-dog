import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import DogSearchPage from './pages/DogSearchPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<DogSearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
