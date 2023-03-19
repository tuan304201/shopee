import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorApi } from 'src/types/ulti.type'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosErrorUnprocessableEntity } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })
  const updateProfileMutation = useMutation(userApi.updateUser)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ErrorApi<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='w-[100%] rounded bg-white p-4'>
      <div className='border-b border-gray-300/50 pb-6'>
        <p className='text-lg'>Đổi mật khẩu</p>
        <p className='text-sm text-gray-600'>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      <form className='sm:px-20' onSubmit={onSubmit}>
        <div className='flex'>
          <div className='mt-9 min-w-[9rem] text-sm text-gray-600'>Mật khẩu hiện tại</div>
          <div className='w-[80%]'>
            <Input
              classNameInput='mt-6 w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
              errorMessage={errors.password?.message}
              register={register}
              name='password'
              type='password'
            />
          </div>
        </div>
        <div className='flex'>
          <div className='mt-9 min-w-[9rem] text-sm text-gray-600'>Mật khẩu mới</div>
          <div className='w-[80%]'>
            <Input
              classNameInput='mt-6 w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
              errorMessage={errors.new_password?.message}
              register={register}
              name='new_password'
              type='password'
            />
          </div>
        </div>
        <div className='flex'>
          <div className='mt-9 min-w-[9rem] text-sm text-gray-600'>Xác nhận mật khẩu</div>
          <div className='w-[80%]'>
            <Input
              classNameInput='mt-6 w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
              errorMessage={errors.confirm_password?.message}
              register={register}
              name='confirm_password'
              type='password'
            />
          </div>
        </div>

        <div className='flex justify-center py-4'>
          <Button type='submit' className='rounded bg-orange px-6 py-3 text-white'>
            Xác nhận
          </Button>
        </div>
      </form>
    </div>
  )
}
