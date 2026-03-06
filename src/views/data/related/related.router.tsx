import { AdminRouterItem } from '../../router'
import { TeamOutlined } from '@ant-design/icons'
import RelatedPage from './index'

const relatedRoutes: AdminRouterItem[] = [
  {
    path: '/data/related',
    element: <RelatedPage />,
    meta: {
      label: '相关',
      title: '相关管理',
      key: '/data/related',
      icon: <TeamOutlined />,
      order: 10,
    },
  },
]

export default relatedRoutes
