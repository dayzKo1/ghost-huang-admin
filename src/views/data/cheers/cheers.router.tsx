import { AdminRouterItem } from '../../router'
import { ThunderboltOutlined } from '@ant-design/icons'
import CheersPage from './index'

const cheersRoutes: AdminRouterItem[] = [
  {
    path: '/data/cheers',
    element: <CheersPage />,
    meta: {
      label: '应援',
      title: '应援管理',
      key: '/data/cheers',
      icon: <ThunderboltOutlined />,
      order: 7,
    },
  },
]

export default cheersRoutes
