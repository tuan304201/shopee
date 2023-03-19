import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import { QueryConfig } from 'src/hooks/useQureyConfig'
import { Category } from 'src/types/category.type'
import { NoUndefinedField } from 'src/types/ulti.type'
import { Schema, schema } from 'src/utils/rules'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function Aside({ queryConfig, categories }: Props) {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver(priceSchema)
  })

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: '/',
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'category'])).toString()
    })
    reset({ price_min: '', price_max: '' })
  }

  return (
    <div className='p-4'>
      <div>
        <Link
          to='/'
          className={classNames('flex items-center text-sm font-bold uppercase hover:text-orange/60', {
            'text-orange': !category
          })}
        >
          <svg viewBox='0 0 12 10' className='mr-2 h-3 w-3 flex-shrink-0 fill-current'>
            <g fillRule='evenodd' stroke='none' strokeWidth={1}>
              <g transform='translate(-373 -208)'>
                <g transform='translate(155 191)'>
                  <g transform='translate(218 17)'>
                    <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          Tất Cả Danh Mục
        </Link>
      </div>
      <div className='my-4 border-b-[1px] border-gray-200' />
      {categories.map((categoryItem) => {
        const isActive = categoryItem._id === category

        return (
          <li
            className={classNames('relative cursor-pointer list-none py-2 text-sm hover:text-orange/60', {
              'font-semibold text-orange': isActive
            })}
            key={categoryItem._id}
          >
            <Link
              to={{
                pathname: '/',
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className='flex items-center'
            >
              {isActive && (
                <svg viewBox='0 0 4 7' className='absolute left-[-14px] h-2 w-2 flex-shrink-0 fill-orange'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {categoryItem.name}
            </Link>
          </li>
        )
      })}

      <div className='py-8'>
        <Link to='/' className='flex items-center text-sm font-bold uppercase'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x={0}
            y={0}
            className='mr-2 h-4 w-4 flex-shrink-0 fill-black'
          >
            <g>
              <polyline
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </g>
          </svg>
          Bộ lọc tìm kiếm
        </Link>
      </div>

      <div className='border-b-[1px] border-t-[1px] py-4'>
        <div className='mb-4'>Khoảng giá</div>
        <form onSubmit={onSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Controller
                control={control}
                name='price_min'
                render={({ field }) => {
                  return (
                    <InputNumber
                      type='number'
                      classNameInput='w-full outline-none py-2 px-3 col-span-1'
                      placeholder='₫ từ'
                      classNameError='hidden'
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('price_max')
                      }}
                      value={field.value}
                      ref={field.ref}
                    />
                  )
                }}
              />
            </div>

            <div>
              <Controller
                control={control}
                name='price_max'
                render={({ field }) => {
                  return (
                    <InputNumber
                      type='number'
                      classNameInput='w-full outline-none py-2 px-3 col-span-1'
                      placeholder='₫ đến'
                      classNameError='hidden'
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('price_min')
                      }}
                      value={field.value}
                      ref={field.ref}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className='my-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button
            type='submit'
            className='flex w-full items-center justify-center rounded bg-orange py-2 text-sm uppercase text-white'
          >
            Áp dụng
          </Button>
        </form>
      </div>

      <Button
        className='mt-6 flex w-full items-center justify-center rounded bg-orange py-2 text-sm uppercase text-white'
        onClick={handleRemoveAll}
      >
        Xoá bộ lọc
      </Button>
    </div>
  )
}
