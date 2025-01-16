import './App.css';
import { Routes, Route } from 'react-router-dom';
import Users from './pages/users/Users';
import Products from './pages/products/Products';

function App() {
    return (
        <>
            <div className="App col-12">
                <Routes>
                    <Route path='/' element={<Users />} />
                    <Route path='/product' element={<Products />} />
                </Routes>

            </div>
        </>
    );
}

export default App;
