import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Omit } from 'lodash'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import config from 'src/constants/config'
import { AppContext } from 'src/contexts/app.context'
import { ErrorApi } from 'src/types/ulti.type'
import { saveProfileToLS } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarUrl, isAxiosErrorUnprocessableEntity } from 'src/utils/utils'
import DateSelect from '../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'avatar' | 'address' | 'date_of_birth' | 'phone'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileShema = userSchema.pick(['name', 'avatar', 'address', 'phone', 'date_of_birth'])
export default function Profile() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const { setProfile } = useContext(AppContext)
  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 1, 1)
    },
    resolver: yupResolver(profileShema)
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getUser
  })

  const updateProfileMutation = useMutation(userApi.updateUser)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 1, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      refetch()
      setProfile(res.data.data)
      saveProfileToLS(res.data.data)
      toast.success(res.data.message, { autoClose: 1000 })
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ErrorApi<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleUpload = () => {
    inputFileRef.current?.click()
  }

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const avatar = watch('avatar')
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]

    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('Kích thước file ảnh quá lớn hoặc không đúng định dạng')
    } else {
      setFile(fileFromLocal)
    }
  }

  return (
    <div className='w-[100%] rounded bg-white p-4 '>
      <div className='border-b border-gray-300/50 pb-6'>
        <p className='text-lg'>Hồ sơ của tôi</p>
        <p className='text-sm text-gray-600'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <form onSubmit={onSubmit} className='sm:px-16'>
        <div className='flex flex-wrap text-sm lg:flex-nowrap'>
          <div className='flex-1 pr-12'>
            <div className='mt-6 flex'>
              <div className='mt-3 min-w-[6rem]'>Tài khoản</div>
              <div className='mb-5 w-[80%] cursor-default rounded border border-gray-300 bg-gray-100/50 p-3 outline-none focus:border-gray-400'>
                {profile?.email}
              </div>
            </div>
            <div className='mt-6 flex'>
              <div className='mt-3 min-w-[6rem]'>Tên</div>
              <div className='w-[80%]'>
                <Input
                  classNameInput='w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
                  errorMessage={errors.name?.message}
                  register={register}
                  name='name'
                  type='text'
                  placeholder='Tên'
                />
              </div>
            </div>
            <div className='mt-6 flex'>
              <div className='mt-3 min-w-[6rem]'>Số điện thoại</div>
              <div className='w-[80%]'>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => {
                    return (
                      <InputNumber
                        type='numberic'
                        classNameInput='w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
                        placeholder='Số điện thoại'
                        errorMessage={errors.phone?.message}
                        {...field}
                        onChange={field.onChange}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className='mt-6 flex'>
              <div className='mt-3 min-w-[6rem]'>Địa chỉ</div>
              <div className='w-[80%]'>
                <Input
                  classNameInput='w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-400'
                  errorMessage={errors.address?.message}
                  register={register}
                  name='address'
                  type='text'
                  placeholder='Địa chỉ'
                />
              </div>
            </div>

            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className='lh:border-l mt-8 h-max w-full border-gray-300 py-2 px-12 lg:w-[30%]'>
            <div className='flex items-center justify-center'>
              <div className='flex h-[6.25rem] w-[6.25rem] items-center justify-center rounded-full bg-gray-100'>
                <img src={previewImage || getAvatarUrl(avatar)} alt='' className='h-full w-full rounded-full' />
              </div>
            </div>
            <input
              ref={inputFileRef}
              onChange={onFileChange}
              onClick={(event) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(event.target as any).value = null
              }}
              type='file'
              accept='.jpg,.jpge,.png'
              className='hidden'
            />
            <div className='flex items-center justify-center'>
              <button
                onClick={handleUpload}
                type='button'
                className='my-5 border border-gray-200 px-4 py-2 text-gray-600 outline-none'
              >
                Chọn Ảnh
              </button>
            </div>
            <div className='flex flex-col items-center justify-center text-sm text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
        <div className='my-4 flex w-full justify-center lg:w-[80%]'>
          <Button type='submit' className='rounded bg-orange px-6 py-3 text-white'>
            Lưu
          </Button>
        </div>
      </form>
    </div>
  )
}
