import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import deafaulAvatar from 'src/assets/deafaultAvatar.png'
import { getAvatarUrl } from 'src/utils/utils'
import classNames from 'classnames'

export default function SideBar() {
  const { profile } = useContext(AppContext)
  return (
    <div className='lg:mb0 mb-4'>
      <div className='flex items-center justify-center border-b border-gray-200 pb-6 lg:justify-start'>
        <img className='h-12 w-12 rounded-full bg-white' src={getAvatarUrl(profile?.avatar) || deafaulAvatar} alt='' />
        <div className='ml-4 text-sm'>
          <p className='mb-1 font-bold'>{profile?.email}</p>
          <div className='flex items-center font-medium text-gray-400'>
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
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
              />
            </svg>
            <span>Sửa hồ sơ</span>
          </div>
        </div>
      </div>

      <div>
        <NavLink
          to='/user/profile'
          className={({ isActive }) =>
            classNames(
              'flex cursor-pointer items-center justify-center pt-4 text-sm capitalize hover:text-orange lg:justify-start',
              {
                'text-orange': isActive
              }
            )
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-2 h-6 w-6 text-blue-900'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
            />
          </svg>
          <span>Tài khoản của tôi</span>
        </NavLink>
        <NavLink
          to='/user/password'
          className={({ isActive }) =>
            classNames(
              'flex cursor-pointer items-center justify-center pt-4 text-sm capitalize hover:text-orange lg:justify-start',
              {
                'text-orange': isActive
              }
            )
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-2 h-6 w-6 text-blue-900'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'
            />
          </svg>

          <span className=''>Đổi mật khẩu</span>
        </NavLink>

        <NavLink
          to='/user/purchase'
          className={({ isActive }) =>
            classNames(
              'flex cursor-pointer items-center justify-center pt-4 text-sm capitalize hover:text-orange lg:justify-start',
              {
                'text-orange': isActive
              }
            )
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-2 h-6 w-6 text-blue-900'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
            />
          </svg>
          <span>Đơn mua</span>
        </NavLink>
      </div>
    </div>
  )
}
