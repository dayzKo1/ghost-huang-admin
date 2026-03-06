import { AdminRouterItem } from '../../router'
import { BarChartOutlined } from '@ant-design/icons'
import StatisticsPage from './index'

const statisticsRoutes: AdminRouterItem[] = [
  {
    path: '/data/statistics',
    element: <StatisticsPage />,
    meta: {
      label: '统计',
      title: '统计管理',
      key: '/data/statistics',
      icon: <BarChartOutlined />,
      order: 12,
    },
  },
]

export default statisticsRoutes
