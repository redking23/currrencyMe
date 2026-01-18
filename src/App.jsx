import { useState } from 'react'
import './App.css'
import Currency from './components/Currency'
import bgImage from './images/BGImage.jpg'

function App() {

  return (
    <>
      <div 
        className='fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10' 
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: 'blur(8px)',
        }}
      />
      
      <div className='min-h-screen w-full grid place-items-center'>
        <Currency />
      </div>
    </>
  )
}

export default App
