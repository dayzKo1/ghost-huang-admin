import { createBrowserRouter } from 'react-router-dom'
import CheersPage from './index'

export default createBrowserRouter([
  {
    path: '/data/cheers',
    element: <CheersPage />,
  },
])
