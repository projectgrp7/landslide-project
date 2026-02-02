import React from 'react'
import { Routes, Route } from "react-router-dom"
import NavBar from './Components/NavBar'
import AboutDiv from './Pages/About'
import Home from './Pages/Home'
import DashBoard from './Pages/Dash'
function App() {
  return (
    <div>
      <Routes>
         <Route path="/" element={ <Home/> } />
         <Route path="/about" element={ <AboutDiv/> } />
         <Route path="/dashboard" element={ <DashBoard/> } />


      </Routes>
    </div>
  )
}

export default App
