import './index.css'
import Header from './components/Header/Header'
import Home from './views/Home/Home'
import Footer from './components/Footer/Footer'
import NotFound from './views/NotFound/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="content">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
