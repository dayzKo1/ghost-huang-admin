import { createBrowserRouter } from 'react-router-dom'
import BlessingsPage from './index'

export default createBrowserRouter([
  {
    path: '/data/blessings',
    element: <BlessingsPage />,
  },
])
