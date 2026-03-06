import { request } from '@/utils/api'
import type { ApiResponse } from '../types'
import type { Product } from './types'

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  return request.get<ApiResponse<Product[]>>('/api/data/products')
}

export const saveProducts = async (products: Product[]): Promise<ApiResponse<Product[]>> => {
  return request.post<ApiResponse<Product[]>>('/api/data/products', products)
}
