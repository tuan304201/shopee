import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchases.api'
import Quantity from 'src/components/Quantity'
import { purchaseStatus } from 'src/constants/purchases'
import { ProductListConfig } from 'src/types/product.type'
import { discountSale, formatCurrency, formatNumberToSocialStyle, getIdFromNameId } from 'src/utils/utils'
import Product from '../ProductList/components/Product'

export default function ProductDetail() {
  const queryClient = useQueryClient()

  const { nameId } = useParams()
  const [buyCount, setBuyCount] = useState(1)
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const currentImage = useMemo(
    () => (product ? product.images.slice(...currentIndexImage) : []),
    [product, currentIndexImage]
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const addToCartMutation = useMutation(purchaseApi.addToCart)

  const addToCart = () => {
    addToCartMutation.mutate(
      { product_id: product?._id as string, buy_count: buyCount },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1500 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
        }
      }
    )
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const queryConfig: ProductListConfig = { limit: '10', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ product_id: product?._id as string, buy_count: buyCount })
    const purchase = res.data.data
    navigate('/cart', {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 pt-6'>
      <div className='container rounded bg-white p-0 shadow'>
        <div className='md:grid md:grid-cols-12'>
          <div className='p-3 md:col-span-5'>
            <div className='relative w-full pt-[100%] shadow'>
              <img
                src={activeImage}
                alt={product.name}
                className='absolute top-0 left-0 h-full w-full bg-white object-cover'
              />
            </div>
            <div className='relative mt-2 grid grid-cols-5 gap-3'>
              {currentImage.map((img) => {
                const isActive = img === activeImage
                return (
                  <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                    <img
                      src={img}
                      alt={img}
                      className='absolute top-0 left-0 h-full w-full rounded bg-white object-cover shadow'
                    />
                    {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className='flex flex-col justify-between p-4 md:col-span-7'>
            <div>
              <h1 className=' text-xl'>{product.name}</h1>
              <p className='my-2'>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-2 text-gray-600'>Đã bán</span>
              </p>
              <div className='flex items-center bg-gray-100/80 p-2'>
                <span className='mr-4 text-gray-400 line-through'>
                  <span>₫</span>
                  {formatCurrency(product.price_before_discount)}
                </span>
                <span className='text-3xl text-orange'>
                  <span>₫</span>
                  {formatCurrency(product.price)}
                </span>

                <div className='ml-6 rounded-sm bg-orange p-1 text-xs font-bold uppercase text-white'>
                  {discountSale(product.price_before_discount, product.price)} Giảm
                </div>
              </div>
            </div>

            <div className='mb-20 pt-6 text-sm'>
              <div className='flex items-center'>
                <span className='mr-10'>Số Lượng</span>
                <Quantity
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-4 text-sm text-gray-600'>
                  {product.quantity} <span>sản phẩm có sẵn</span>
                </div>
              </div>
              <div className='mt-10 flex items-center justify-end md:justify-start'>
                <button
                  onClick={addToCart}
                  className='mr-6 flex max-h-[54px] items-center justify-center rounded border border-orange bg-[rgba(255,87,34,0.1)] py-4 px-6 outline-none hover:bg-[rgba(255,87,34,0)]'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-2 h-6 w-6 text-orange'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                    />
                  </svg>
                  <span className='capitalize text-orange'>Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={buyNow}
                  className='min-h-[54px] rounded border bg-orange p-4 text-white outline-none hover:bg-orange/80'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mt-10 rounded bg-white p-4 shadow'>
        <h1 className='rounded bg-gray-100 p-4 uppercase'>Mô tả sản phẩm</h1>
        <div
          className='p-4 text-sm text-gray-600'
          dangerouslySetInnerHTML={{
            __html: product.description
          }}
        />
      </div>

      <div className='container mt-10 p-0'>
        <h1 className='rounded bg-white p-4 uppercase'>Có thể bạn cũng thích</h1>
        {productsData && (
          <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5'>
            {productsData.data.data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <div className='mt-20 border-t-4 border-orange bg-white pb-20'></div>
    </div>
  )
}
