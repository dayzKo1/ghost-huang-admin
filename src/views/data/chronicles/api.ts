import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Chronicle } from './types'

export const getChronicles = async (): Promise<ApiResponse<Chronicle[]>> => {
  return request.get<ApiResponse<Chronicle[]>>('/api/data/chronicles')
}

export const saveChronicles = async (chronicles: Chronicle[]): Promise<ApiResponse<Chronicle[]>> => {
  return request.post<ApiResponse<Chronicle[]>>('/api/data/chronicles', chronicles)
}
