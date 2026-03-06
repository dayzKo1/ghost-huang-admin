export interface Product {
  title: string
  content: ProductContentSection[]
}

export interface ProductContentSection {
  type: string
  title: string
  titleAlign: string
  titleMargin: string
  backgroundImage: string
  index: number
  products: ProductItem[]
}

export interface ProductItem {
  title: string
  subtitle: string
  productLink: string
  productImage: string
  buttonText: string
}
