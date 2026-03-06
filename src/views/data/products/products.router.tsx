import { createBrowserRouter } from 'react-router-dom'
import ProductsPage from './index'

export default createBrowserRouter([
  {
    path: '/data/products',
    element: <ProductsPage />,
  },
])
