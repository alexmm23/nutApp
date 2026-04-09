import './index.css'
import Header from './components/Header/Header'
import Home from './views/Home/Home'
import Footer from './components/Footer/Footer'
import NotFound from './views/NotFound/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WeeklyDiet from './views/WeeklyDiet/WeeklyDiet'
import Profile from './views/Profile/Profile'
import ShoppingList from './views/ShoppingList/ShoppingList'
import { Toaster } from 'sonner'
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'custom-toast',
          }}
        />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/weekly-diet" element={<WeeklyDiet />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
