import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Blessing } from './types'

export const getBlessings = async (): Promise<ApiResponse<Blessing[]>> => {
  return request.get<ApiResponse<Blessing[]>>('/api/data/blessings')
}

export const saveBlessings = async (blessings: Blessing[]): Promise<ApiResponse<Blessing[]>> => {
  return request.post<ApiResponse<Blessing[]>>('/api/data/blessings', blessings)
}
