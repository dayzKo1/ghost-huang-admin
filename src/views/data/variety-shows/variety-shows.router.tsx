import { AdminRouterItem } from '../../router'
import { VideoCameraOutlined } from '@ant-design/icons'
import VarietyShowsPage from '.'

const varietyShowsRoutes: AdminRouterItem[] = [
  {
    path: '/data/variety-shows',
    element: <VarietyShowsPage />,
    meta: {
      label: '综艺',
      title: '综艺管理',
      key: '/data/variety-shows',
      icon: <VideoCameraOutlined />,
      order: 4,
    },
  },
]

export default varietyShowsRoutes
