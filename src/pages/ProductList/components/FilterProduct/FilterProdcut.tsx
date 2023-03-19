import classNames from 'classnames'
import { omit } from 'lodash'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { sortBy, order as OrderContants } from 'src/constants/product'
import { QueryConfig } from 'src/hooks/useQureyConfig'
import { ProductListConfig } from 'src/types/product.type'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function FilterProdcut({ queryConfig, pageSize }: Props) {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)

  const navigate = useNavigate()

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handleOrder = (orderByValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderByValue
      }).toString()
    })
  }

  return (
    <div className='flex flex-wrap items-center justify-center rounded bg-gray-300/60 p-4 sm:justify-between'>
      <div className='flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start'>
        <div>Sắp xếp theo</div>
        <button
          className={classNames('rounded py-2 px-3', {
            'bg-orange text-white hover:bg-orange/60': isActiveSortBy(sortBy.view),
            'bg-white text-black hover:bg-orange/60': !isActiveSortBy(sortBy.view)
          })}
          onClick={() => {
            handleSort(sortBy.view)
          }}
        >
          Phổ biến
        </button>
        <button
          className={classNames('rounded py-2 px-3', {
            'bg-orange text-white hover:bg-orange/60': isActiveSortBy(sortBy.createdAt),
            'bg-white text-black hover:bg-orange/60': !isActiveSortBy(sortBy.createdAt)
          })}
          onClick={() => {
            handleSort(sortBy.createdAt)
          }}
        >
          Mới nhất
        </button>
        <button
          className={classNames('rounded py-2 px-3', {
            'bg-orange text-white hover:bg-orange/60': isActiveSortBy(sortBy.sold),
            'bg-white text-black hover:bg-orange/60': !isActiveSortBy(sortBy.sold)
          })}
          onClick={() => {
            handleSort(sortBy.sold)
          }}
        >
          Bán chạy
        </button>
        <select
          className={classNames('rounded py-2 px-3 outline-none', {
            'bg-orange text-white hover:bg-orange/60': isActiveSortBy(sortBy.price),
            'bg-white text-black hover:bg-orange/60': !isActiveSortBy(sortBy.price)
          })}
          value={order || ''}
          onChange={(e) => {
            handleOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)
          }}
        >
          <option value='' className='bg-white text-black'>
            Giá:
          </option>
          <option value={OrderContants.asc} className='bg-white text-black'>
            Thấp đến cao
          </option>
          <option value={OrderContants.desc} className='bg-white text-black'>
            Cao đến thấp
          </option>
        </select>
      </div>

      <div className='mt-4 flex items-center gap-6 lg:mt-0'>
        <div>
          <span className='text-orange'>{page}</span>
          <span>/{pageSize}</span>
        </div>

        <div className='flex gap-1'>
          {page === 1 ? (
            <span className='flex cursor-not-allowed items-center justify-center rounded-sm bg-white/40 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
            >
              <span className='flex items-center justify-center rounded-sm bg-white p-2 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            </Link>
          )}

          {page === pageSize ? (
            <span className='flex cursor-not-allowed items-center justify-center rounded-sm bg-white/40 p-2 hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
            >
              <span className='flex items-center justify-center rounded-sm bg-white p-2 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
