import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { AppContext } from 'src/contexts/app.context'
import { useContext } from 'react'
import Popover from '../Popover'
import { purchaseStatus } from 'src/constants/purchases'
import { Link } from 'react-router-dom'
import deafaulAvatar from 'src/assets/deafaultAvatar.png'
import { getAvatarUrl } from 'src/utils/utils'

export default function NavHeader() {
  const queryClient = useQueryClient()
  const { isAuthen, setIsAuthen, setProfile, profile } = useContext(AppContext)

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setProfile(null)
      setIsAuthen(false)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
    }
  })
  // Chức năng đăng xuất
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className='mb-2 flex justify-end text-xs text-white'>
      <Popover
        className='flex cursor-pointer items-center hover:text-gray-200'
        renderPopover={
          <div className='flex flex-col items-start rounded bg-white px-10 py-4  text-sm shadow-lg'>
            <button className='mb-3 hover:text-orange'>Tiếng Việt</button>
            <button className='hover:text-orange'>English</button>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {isAuthen && (
        <Popover
          className='ml-4 flex cursor-pointer items-center text-xs hover:text-gray-200'
          renderPopover={
            <div className='flex flex-col rounded bg-white text-sm shadow-lg'>
              <Link to='/user/profile' className='block w-full rounded px-6 py-2 hover:bg-gray-200 hover:text-orange'>
                Tài khoản của tôi
              </Link>
              <Link to='/user/purchase' className='block w-full rounded py-2 px-6 hover:bg-gray-200 hover:text-orange'>
                Đơn mua
              </Link>
              <button
                onClick={handleLogout}
                className=' w-full rounded py-2 px-6 text-left hover:bg-gray-200 hover:text-orange'
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className='mr-2 h-5 w-5 overflow-hidden rounded-full'>
            {
              <img
                className='h-5 w-5 rounded-full bg-white'
                src={getAvatarUrl(profile?.avatar) || deafaulAvatar}
                alt=''
              />
            }
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}

      {!isAuthen && (
        <div className='ml-3 flex items-center'>
          <Link to='/register' className='hover:text-gray-200'>
            Đăng ký
          </Link>
          <div className='mx-2 h-3 border-r-[1px] border-gray-200'></div>
          <Link className='hover:text-gray-200' to='/login'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
