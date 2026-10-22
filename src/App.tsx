import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Modal from './components/modal/modal'
import { Analytics } from "@vercel/analytics/react"
import { MainPage } from './pages/Main'
import { Toaster } from 'sonner'
import LineByLineV2 from './components/LineByLine/LineByLineV2'
import WordByWordSyncV2 from './components/WordByWord/WordByWordSyncV2'
import NotFound from './components/NotFound/NotFound'

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/menu', element: <MainPage /> },
  { path: '/line', element: <LineByLineV2 /> },
  { path: '/word', element: <WordByWordSyncV2 /> },
  { path: '/*', element: <NotFound /> },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Modal />
      <Toaster />
      <Analytics />
    </>
  )
}

export default App
