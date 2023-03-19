import { SuccessApi } from 'src/types/ulti.type'
import http from 'src/utils/http'
import { Product, ProductList, ProductListConfig } from './../types/product.type'

const URL = 'products'

const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessApi<ProductList>>(URL, { params })
  },
  getProductDetail(id: string) {
    return http.get<SuccessApi<Product>>(`${URL}/${id}`)
  }
}

export default productApi
