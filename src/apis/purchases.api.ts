import { Purchase, PurchaseListStatus } from './../types/purchases.type'
import { SuccessApi } from 'src/types/ulti.type'
import http from 'src/utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessApi<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessApi<Purchase[]>>(URL, {
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccessApi<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePuchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessApi<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseId: string[]) {
    return http.delete<SuccessApi<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseId
    })
  }
}

export default purchaseApi
