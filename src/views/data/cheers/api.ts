import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Cheer } from './types'

export const getCheers = async (): Promise<ApiResponse<Cheer[]>> => {
  return request.get<ApiResponse<Cheer[]>>('/api/data/cheers')
}

export const saveCheers = async (cheers: Cheer[]): Promise<ApiResponse<Cheer[]>> => {
  return request.post<ApiResponse<Cheer[]>>('/api/data/cheers', cheers)
}
