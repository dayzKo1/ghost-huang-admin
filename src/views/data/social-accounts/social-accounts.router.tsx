import { createBrowserRouter } from 'react-router-dom'
import SocialAccountsPage from './index'

export default createBrowserRouter([
  {
    path: '/data/social-accounts',
    element: <SocialAccountsPage />,
  },
])
