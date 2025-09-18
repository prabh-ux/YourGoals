import { useState } from 'react'
import './App.css'
import Home from './pages/HOme'
import { Route, Router, Routes } from 'react-router-dom'
import Notes from './pages/Notes'
import Navbar from './elements/Navbar'

function App() {


  return (
    <div className='bg-[#213547] min-h-screen'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route path="/notes/:goalId" element={<Notes />} />

      </Routes>

    </div>
  )
}

export default App
