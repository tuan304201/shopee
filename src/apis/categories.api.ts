import { Category } from 'src/types/category.type'
import { SuccessApi } from 'src/types/ulti.type'
import http from 'src/utils/http'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessApi<Category[]>>(URL)
  }
}

export default categoryApi
