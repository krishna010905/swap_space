import './App.css'
import { Footer, Header } from './components/index';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-primary'>
      <Header />
      <main className='w-full pt-8'> 
        <div className=''>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App