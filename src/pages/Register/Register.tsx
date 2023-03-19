import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import authApi from 'src/apis/auth.api'
import { isAxiosErrorUnprocessableEntity } from 'src/utils/utils'
import { ErrorApi } from 'src/types/ulti.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthen, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setProfile(data.data.data.user)
        setIsAuthen(true)
      },
      onError: (error) => {
        if (isAxiosErrorUnprocessableEntity<ErrorApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className=' bg-orange'>
      <div className='container'>
        <div className='grid min-h-[37rem] grid-cols-1 bg-no-repeat py-6 lg:grid-cols-5 lg:bg-[url(https://cf.shopee.vn/file/sg-11134004-23020-75qwyq2a7snv15)] lg:py-10 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <p className='text-xl'>Đăng ký</p>
              <div>
                <Input
                  name='email'
                  type='email'
                  placeholder='Nhập email'
                  register={register}
                  errorMessage={errors.email?.message}
                />
                <Input
                  name='password'
                  type='password'
                  placeholder='Nhập mật khẩu'
                  register={register}
                  errorMessage={errors.password?.message}
                  autoComplete='on'
                />
                <Input
                  name='confirm_password'
                  type='password'
                  placeholder='Nhập lại mật khẩu'
                  register={register}
                  errorMessage={errors.confirm_password?.message}
                  autoComplete='on'
                />
              </div>
              <Button
                type='submit'
                className='mt-6 flex w-full items-center justify-center rounded bg-orange py-3 uppercase text-white'
                isLoading={registerAccountMutation.isLoading}
                disabled={registerAccountMutation.isLoading}
              >
                Đăng ký
              </Button>
              <div className='mt-8 text-center text-sm'>
                <span className='mr-2 text-gray-300'>Bạn đã có tài khoản?</span>
                <Link className='text-orange' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
