import { createBrowserRouter } from 'react-router-dom'
import RelatedPage from './index'

export default createBrowserRouter([
  {
    path: '/data/related',
    element: <RelatedPage />,
  },
])
