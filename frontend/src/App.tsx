import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/home' element={<HomePage />} />
                <Route path='/game' element={<GamePage />} />


                {/* more pages here */}
            </Routes>
        </BrowserRouter>
    );
}