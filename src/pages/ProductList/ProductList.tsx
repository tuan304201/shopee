import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/categories.api'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQureyConfig from 'src/hooks/useQureyConfig'
import { ProductListConfig } from 'src/types/product.type'
import Aside from './components/Aside'
import FilterProdcut from './components/FilterProduct'
import Product from './components/Product/Product'

export default function ProductList() {
  const queryConfig = useQureyConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div>
      <div className='bg-gray-100 pb-20'>
        <div className='container'>
          {productsData && (
            <div className='relative grid grid-cols-12 gap-3 py-8'>
              <div className='col-span-3 hidden sm:block xl:col-span-2'>
                <Aside queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
              </div>
              <div className='col-span-12 sm:col-span-9 xl:col-span-10'>
                <FilterProdcut queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5'>
                  {productsData.data.data.products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='border-t-4 border-orange bg-white pb-20'></div>
    </div>
  )
}
