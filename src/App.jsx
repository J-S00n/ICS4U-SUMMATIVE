import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../context/user.jsx';
import HomeView from '../views/HomeView.jsx';
import LoginView from '../views/LoginView.jsx';
import RegisterView from '../views/RegisterView.jsx';
import ErrorView from '../views/ErrorView.jsx';
import MoviesView from '../views/MoviesView.jsx';
import GenreView from '../Views/GenreView.jsx';
import DetailView from '../views/DetailView.jsx';
import SearchView from '../views/SearchView.jsx';
import CartView from '../views/CartView.jsx';
import SettingsView from '../views/SettingsView.jsx';
import ProtectedRoutes from '../views/ProtectedRoutes.jsx';
import './App.css'

function App() {

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/movies" element={<MoviesView />}>
              <Route path="genre/:id" element={<GenreView />}></Route>
              <Route path="details/:id" element={<DetailView />}></Route>
              <Route path="search/:query" element={<SearchView />}></Route>
            </Route>
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App;