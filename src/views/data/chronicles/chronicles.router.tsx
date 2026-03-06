import { createBrowserRouter } from 'react-router-dom'
import ChroniclesPage from './index'

export default createBrowserRouter([
  {
    path: '/data/chronicles',
    element: <ChroniclesPage />,
  },
])
