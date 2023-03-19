import { Link } from 'react-router-dom'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`/${generateNameId({ name: product.name, id: product._id })}`} className=''>
      <div className='overflow-hidden rounded-sm bg-white shadow-md transition-all duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img src={product.image} alt='' className='absolute top-0 left-0 h-full w-full object-cover' />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-sm line-clamp-2'>{product.name}</div>
        </div>
        <div className='mb-4 flex items-center justify-between px-2'>
          <div className='max-w-[50%] truncate text-gray-500 line-through'>
            <span>₫</span>
            <span>{formatCurrency(product.price_before_discount)}</span>
          </div>
          <div className=' max-w-[50%] truncate text-orange'>
            <span>₫</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>

        <div className='px-2 pb-4 text-right text-xs text-gray-400'>
          <span className='mr-1'>Đã bán</span>
          <span>{formatNumberToSocialStyle(product.sold)}</span>
        </div>
      </div>
    </Link>
  )
}
