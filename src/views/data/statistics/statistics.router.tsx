import { createBrowserRouter } from 'react-router-dom'
import StatisticsPage from './index'

export default createBrowserRouter([
  {
    path: '/data/statistics',
    element: <StatisticsPage />,
  },
])
