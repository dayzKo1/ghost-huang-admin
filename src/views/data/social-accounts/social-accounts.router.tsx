import { AdminRouterItem } from '../../router'
import { ShareAltOutlined } from '@ant-design/icons'
import SocialAccountsPage from './index'

const socialAccountsRoutes: AdminRouterItem[] = [
  {
    path: '/data/social-accounts',
    element: <SocialAccountsPage />,
    meta: {
      label: '社交账号',
      title: '社交账号管理',
      key: '/data/social-accounts',
      icon: <ShareAltOutlined />,
      order: 11,
    },
  },
]

export default socialAccountsRoutes
