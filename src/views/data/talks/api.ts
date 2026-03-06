import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Talk } from './types'

export const getTalks = async (): Promise<ApiResponse<Talk[]>> => {
  return request.get<ApiResponse<Talk[]>>('/api/data/talks')
}

export const saveTalks = async (talks: Talk[]): Promise<ApiResponse<Talk[]>> => {
  return request.post<ApiResponse<Talk[]>>('/api/data/talks', talks)
}
