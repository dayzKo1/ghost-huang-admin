import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Statistic } from './types'

export const getStatistics = async (): Promise<ApiResponse<Statistic[]>> => {
  return request.get<ApiResponse<Statistic[]>>('/api/data/statistics')
}

export const saveStatistics = async (statistics: Statistic[]): Promise<ApiResponse<Statistic[]>> => {
  return request.post<ApiResponse<Statistic[]>>('/api/data/statistics', statistics)
}
