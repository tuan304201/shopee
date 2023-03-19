import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { isAxiosErrorUnprocessableEntity } from 'src/utils/utils'
import { ErrorApi } from 'src/types/ulti.type'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthen, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setProfile(data.data.data.user)
        setIsAuthen(true)
      },
      onError: (error) => {
        if (isAxiosErrorUnprocessableEntity<ErrorApi<FormData>>(error)) {
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
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid min-h-[37rem] grid-cols-1 bg-no-repeat py-6 lg:grid-cols-5 lg:bg-[url(https://cf.shopee.vn/file/sg-11134004-23020-75qwyq2a7snv15)] lg:py-16 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <p className='text-xl'>Đăng nhập</p>
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
              </div>
              <Button
                type='submit'
                className='mt-6 flex w-full items-center justify-center rounded bg-orange py-3 uppercase text-white'
                isLoading={loginMutation.isLoading}
                disabled={loginMutation.isLoading}
              >
                Đăng nhập
              </Button>
              <div className='mt-8 text-center text-sm'>
                <span className='mr-2 text-gray-300'>Bạn chưa có tài khoản?</span>
                <Link className='text-orange' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
