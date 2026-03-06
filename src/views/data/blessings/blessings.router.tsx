import { AdminRouterItem } from '../../router'
import { HeartOutlined } from '@ant-design/icons'
import BlessingsPage from './index'

const blessingsRoutes: AdminRouterItem[] = [
  {
    path: '/data/blessings',
    element: <BlessingsPage />,
    meta: {
      label: '祝福',
      title: '祝福管理',
      key: '/data/blessings',
      icon: <HeartOutlined />,
      order: 6,
    },
  },
]

export default blessingsRoutes
