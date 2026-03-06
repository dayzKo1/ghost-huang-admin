import { AdminRouterItem } from '../../router'
import { MessageOutlined } from '@ant-design/icons'
import TalksPage from './index'

const talksRoutes: AdminRouterItem[] = [
  {
    path: '/data/talks',
    element: <TalksPage />,
    meta: {
      label: '发言',
      title: '发言管理',
      key: '/data/talks',
      icon: <MessageOutlined />,
      order: 13,
    },
  },
]

export default talksRoutes
