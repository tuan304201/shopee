import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchases.api'
import Button from 'src/components/Button'
import Quantity from 'src/components/Quantity'
import { purchaseStatus } from 'src/constants/purchases'
import { Purchase } from 'src/types/purchases.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
// eslint-disable-next-line import/no-named-as-default
import produce from 'immer'
import { keyBy } from 'lodash'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: PurchaseInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePuchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      refetch()
      toast.error(data.data.message, {
        autoClose: 1000
      })
    }
  })

  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId

  const purchaseInCart = PurchaseInCartData?.data.data
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const totalPriceCart = useMemo(
    () =>
      checkedPurchases.reduce((result, curr) => {
        return result + curr.product.price * curr.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalPriceBeforeDiscountCart = useMemo(
    () =>
      checkedPurchases.reduce((result, curr) => {
        return result + curr.product.price_before_discount * curr.buy_count
      }, 0),
    [checkedPurchases]
  )
  const totalSavePrice = useMemo(
    () => totalPriceBeforeDiscountCart - totalPriceCart,
    [totalPriceBeforeDiscountCart, totalPriceCart]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchaseInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disable: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseInCart, choosenPurchaseIdFromLocation, setExtendedPurchases])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleAllCheck = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyPurchaseMutation.mutate(body)
    }
  }

  return (
    <div className='bg-gray-100 pt-6'>
      {purchaseInCart && purchaseInCart.length > 0 ? (
        <div className='container'>
          <div className='overflow-auto'>
            {extendedPurchases && (
              <>
                <div className='min-w-[1000px]'>
                  <div className='grid grid-cols-12 rounded-sm bg-white p-4 font-semibold'>
                    <div className='col-span-5 flex items-center'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 bg-gray-100 accent-orange'
                        checked={isAllChecked}
                        onChange={handleAllCheck}
                      />
                      <span className='ml-4'>Sản phẩm</span>
                    </div>
                    <div className='col-span-2 text-center'>Đơn giá</div>
                    <div className='col-span-2 text-center'>Số lượng</div>
                    <div className='col-span-2 text-center'>Số tiền</div>
                    <div className='col-span-1 text-center'>Thao tác</div>
                  </div>
                </div>

                {extendedPurchases.map((data, index) => (
                  <div className='mt-4 grid min-w-[1000px] grid-cols-12 rounded-sm bg-white p-4 text-sm' key={data._id}>
                    <div className='col-span-5 flex items-center'>
                      <input
                        type='checkbox'
                        className='mr-4 min-h-[16px] min-w-[16px] rounded border-gray-300 bg-gray-100 accent-orange'
                        checked={data.checked}
                        onChange={handleCheck(index)}
                      />
                      <Link
                        to={`/${generateNameId({ name: data.product.name, id: data.product._id })}`}
                        className='flex items-start'
                      >
                        <img className='h-20 w-20' src={data.product.image} alt={data.product.name} />
                        <span className='px-4'>{data.product.name}</span>
                      </Link>
                    </div>
                    <div className='col-span-2 flex items-center justify-center text-center'>
                      <span className='mr-4 text-gray-400 line-through'>
                        ₫{formatCurrency(data.price_before_discount)}
                      </span>
                      <span>₫{formatCurrency(data.price)}</span>
                    </div>
                    <div className='col-span-2 flex items-center justify-center text-center'>
                      <Quantity
                        value={data.buy_count}
                        max={data.product.quantity}
                        onDecrease={(value) => handleQuantity(index, value, value <= data.product.quantity)}
                        onIncrease={(value) => handleQuantity(index, value, value >= 1)}
                        onType={handleTypeQuantity(index)}
                        onFocusOut={(value) =>
                          handleQuantity(
                            index,
                            value,
                            value >= 1 &&
                              value <= data.product.quantity &&
                              value !== (purchaseInCart as Purchase[])[index].buy_count
                          )
                        }
                        disabled={data.disable}
                      />
                    </div>
                    <div className='col-span-2 flex items-center justify-center text-center text-orange'>
                      ₫{formatCurrency(data.product.price * data.buy_count)}
                    </div>
                    <div className='col-span-1 flex items-center justify-center text-center'>
                      <button
                        onClick={handleDelete(index)}
                        className='rounded-full bg-orange px-5 py-3 text-white hover:bg-black'
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className='sticky bottom-0 mt-4 items-center justify-between rounded border border-orange bg-white px-4 py-6 sm:flex'>
            <div className='flex items-center justify-between'>
              <div className='flex'>
                <input
                  type='checkbox'
                  className='mr-4 min-h-[16px] min-w-[16px] rounded border-gray-300 bg-gray-100 accent-orange'
                  checked={isAllChecked}
                  onChange={handleAllCheck}
                />
                <span>Chọn tất cả ({extendedPurchases.length})</span>
              </div>
              <button
                onClick={handleDeleteManyPurchases}
                className='ml-6 rounded-full bg-orange px-4 py-2 text-white hover:bg-black'
              >
                Xoá
              </button>
            </div>
            <div className='items-center sm:flex'>
              <div className='py-2'>
                <div className='flex items-center justify-center'>
                  <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                  <div className='ml-2 mr-10 text-2xl text-orange'>
                    <span>₫{formatCurrency(totalPriceCart)}</span>
                    <div
                      className={classNames('text-sm', {
                        block: checkedPurchasesCount > 1
                      })}
                    >
                      Tiết kiệm: <span className='text-orange'>₫{formatCurrency(totalSavePrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-center pt-2'>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyPurchaseMutation.isLoading}
                  className='flex w-40 items-center justify-center rounded bg-orange py-3 uppercase text-white hover:bg-orange/60'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='container flex min-h-[30rem] items-center justify-center rounded bg-white shadow'>
          <div className='flex flex-col items-center'>
            <img
              className='block h-[6.25rem] w-[6.25rem] object-cover'
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
              alt=''
            />
            <div className='mt-4 text-xl text-gray-600/60'>Hiện không có sản phẩm nào trong giỏ hàng!</div>
            <Link to='/'>
              <Button className='mt-4 flex w-40 items-center justify-center rounded bg-orange py-3 uppercase text-white hover:bg-orange/60'>
                Mua hàng
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='mt-20 border-t-4 border-orange bg-white pb-20'></div>
    </div>
  )
}
