import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LineByLine from './components/LineByLine/LineByLine'
import WordByWord from './components/WordByWord/WordByWord'
import Menu from './pages/Menu'
import Modal from './components/modal/modal'
import { Analytics } from "@vercel/analytics/react"
import { MainPage } from './pages/Main'

const NotFound = () => (
  <div className='h-full w-full flex flex-col space-y-2 justify-center items-center'>
    <h1 className='text-2xl font-bold'>Page Not Found</h1>
    <p>Someone misguided you here!</p>
    <button onClick={() => window.location.pathname = '/'} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Go Back Home 👀</button>
  </div>
)

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/menu', element: <Menu /> },
  { path: '/line', element: <LineByLine /> },
  { path: '/word', element: <WordByWord /> },
  { path: '/*', element: <NotFound /> },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Modal />
      <Analytics />
    </>
  )
}

export default App
