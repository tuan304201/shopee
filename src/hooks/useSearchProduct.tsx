import useQureyConfig from 'src/hooks/useQureyConfig'
import { schema, Schema } from 'src/utils/rules'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { omit } from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])

export default function useSearchProduct() {
  // Chức năng tìm kiếm sản phẩm
  const queryConfig = useQureyConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const navigate = useNavigate()

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit({ ...queryConfig, name: data.name }, ['order', 'sort_by'])
      : { ...queryConfig, name: data.name }

    navigate({
      pathname: '/',
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
