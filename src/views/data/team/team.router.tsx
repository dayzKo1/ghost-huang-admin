import { AdminRouterItem } from '../../router'
import { TeamOutlined } from '@ant-design/icons'
import TeamPage from '.'

const teamRoutes: AdminRouterItem[] = [
  {
    path: '/data/team',
    element: <TeamPage />,
    meta: {
      label: '团队',
      title: '团队管理',
      key: '/data/team',
      icon: <TeamOutlined />,
      order: 3,
    },
  },
]

export default teamRoutes
