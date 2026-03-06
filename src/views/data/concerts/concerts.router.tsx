import { AdminRouterItem } from '../../router'
import { AudioOutlined } from '@ant-design/icons'
import ConcertsPage from '.'

const concertsRoutes: AdminRouterItem[] = [
  {
    path: '/data/concerts',
    element: <ConcertsPage />,
    meta: {
      label: '演唱会',
      title: '演唱会管理',
      key: '/data/concerts',
      icon: <AudioOutlined />,
      order: 2,
    },
  },
]

export default concertsRoutes
