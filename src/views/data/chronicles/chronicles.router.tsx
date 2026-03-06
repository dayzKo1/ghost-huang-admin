import { AdminRouterItem } from '../../router'
import { BookOutlined } from '@ant-design/icons'
import ChroniclesPage from './index'

const chroniclesRoutes: AdminRouterItem[] = [
  {
    path: '/data/chronicles',
    element: <ChroniclesPage />,
    meta: {
      label: '年鉴',
      title: '年鉴管理',
      key: '/data/chronicles',
      icon: <BookOutlined />,
      order: 8,
    },
  },
]

export default chroniclesRoutes
