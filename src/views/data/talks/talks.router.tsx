import { createBrowserRouter } from 'react-router-dom'
import TalksPage from './index'

export default createBrowserRouter([
  {
    path: '/data/talks',
    element: <TalksPage />,
  },
])
