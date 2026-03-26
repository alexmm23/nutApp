import './App.css'
import Header from './components/Header.jsx'

function App() {
  return (
    <>
      <div className="content">
        <Header />
        <main>
          <h1>NutApp</h1>
        </main>
        <footer className="footer">
          <span>Designed by Alejandro Montes</span>
        </footer>
      </div>
    </>
  )
}

export default App
