import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Currency from './components/Currency'
import TimeMachine from './components/TimeMachine'
import bgImage from './images/BGImage.jpg'

function App() {
  const [activeTab, setActiveTab] = useState('convert'); // 'convert' or 'time'

  return (
    <>
      {/* Background with optimized overlay */}
      <div 
        className='fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10' 
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: 'blur(12px) brightness(0.4)',
        }}
      />
      <div className='fixed inset-0 bg-black/40 -z-10' />
      
      <div className='min-h-screen w-full flex flex-col items-center py-10 px-4'>
        {/* Navigation Tabs */}
        <div className='flex bg-gray-900/60 backdrop-blur-xl p-1.5 rounded-2xl mb-10 border border-white/10 shadow-2xl'>
          <button 
            onClick={() => setActiveTab('convert')}
            className={`relative px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-tighter transition-colors duration-300 ${activeTab === 'convert' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {activeTab === 'convert' && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              />
            )}
            Currency Converter
          </button>
          <button 
            onClick={() => setActiveTab('time')}
            className={`relative px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-tighter transition-colors duration-300 ${activeTab === 'time' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {activeTab === 'time' && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute inset-0 bg-orange-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              />
            )}
            Time Machine
          </button>
        </div>

        {/* Content Area */}
        <main className='w-full max-w-lg'>
          <AnimatePresence mode="wait">
            {activeTab === 'convert' ? (
              <motion.div
                key="convert"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Currency />
              </motion.div>
            ) : (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TimeMachine />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  )
}

export default App
