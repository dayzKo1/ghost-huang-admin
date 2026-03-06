import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { SocialAccounts } from './types'

export const getSocialAccounts = async (): Promise<ApiResponse<SocialAccounts[]>> => {
  return request.get<ApiResponse<SocialAccounts[]>>('/api/data/social-accounts')
}

export const saveSocialAccounts = async (socialAccounts: SocialAccounts[]): Promise<ApiResponse<SocialAccounts[]>> => {
  return request.post<ApiResponse<SocialAccounts[]>>('/api/data/social-accounts', socialAccounts)
}
