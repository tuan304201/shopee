import SideBar from '../components/SideBar'

interface Props {
  children?: React.ReactNode
}

export default function UserLayout({ children }: Props) {
  return (
    <div className='bg-gray-100'>
      <div className='container flex flex-col py-8 lg:flex-row'>
        <SideBar />
        <div className='flex-1 px-2 lg:px-8'>{children}</div>
      </div>
      <div className='mt-20 border-t-4 border-orange bg-white pb-20'></div>
    </div>
  )
}
