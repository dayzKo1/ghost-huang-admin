import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Related } from './types'

export const getRelated = async (): Promise<ApiResponse<Related[]>> => {
  return request.get<ApiResponse<Related[]>>('/api/data/related')
}

export const saveRelated = async (related: Related[]): Promise<ApiResponse<Related[]>> => {
  return request.post<ApiResponse<Related[]>>('/api/data/related', related)
}
