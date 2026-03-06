import { AdminRouterItem } from '../../router'
import { CustomerServiceOutlined } from '@ant-design/icons'
import AlbumsPage from '.'

const albumsRoutes: AdminRouterItem[] = [
  {
    path: '/data/albums',
    element: <AlbumsPage />,
    meta: {
      label: '专辑',
      title: '专辑管理',
      key: '/data/albums',
      icon: <CustomerServiceOutlined />,
      order: 1,
    },
  },
]

export default albumsRoutes
