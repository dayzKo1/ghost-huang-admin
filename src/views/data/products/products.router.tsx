import { AdminRouterItem } from '../../router'
import { ShoppingOutlined } from '@ant-design/icons'
import ProductsPage from './index'

const productsRoutes: AdminRouterItem[] = [
  {
    path: '/data/products',
    element: <ProductsPage />,
    meta: {
      label: '周边',
      title: '周边管理',
      key: '/data/products',
      icon: <ShoppingOutlined />,
      order: 9,
    },
  },
]

export default productsRoutes
