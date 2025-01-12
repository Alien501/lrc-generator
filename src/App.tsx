import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import DefaultLayout from './layout/layout'
import LineByLine from './components/LineByLine/LineByLine'
import WordByWord from './components/WordByWord/WordByWord'
import Menu from './pages/Menu'
import Modal from './components/modal/modal'
import { useModalStore } from './store/useModalStore'
import { Analytics } from "@vercel/analytics/react"

function App() {
  const { state } = useModalStore();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          path: '/',
          element: <Menu />,
        },
        {
          path: '/menu',
          element: <Menu />
        },
        {
          path: '/line',
          element: <LineByLine />
        },
        {
          path: '/word',
          element: <WordByWord />
        },
        {
          path: '/*',
          element: <div className='h-full w-full flex flex-col space-y-2 justify-center items-center'><p>Someone misguided you here!</p><button onClick={() => window.location.pathname = '/'}>Go Back 👀</button></div>
        },
      ]
    },
    {
      path: '/*',
      element: <div className='h-full w-full flex flex-col space-y-2 justify-center items-center'><p>Someone misguided you here!</p><button onClick={() => window.location.pathname = '/'}>Go Back 👀</button></div>
    },
  ])
  return (
    <>
      <RouterProvider router={router} />

      {
        state &&
        <Modal />
      }

      <Analytics />
    </>
  )
}

export default App
