'use client'

import { useAuthContext } from '@/app/context/context'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { message, Space,Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function UserButton() {
  const router = useRouter()

  const { session, auth } = useAuthContext()
  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      message.success('Logged Out Successfully')
      router.replace('/')
      localStorage.clear()
    })
    .catch((err) => {
      message.error(err.message)
    })
  }
  
  if (session) {

    let items = [
      {
        label: <a href="javascript:;">Logout</a>,
        key: '0',
        onClick : () => {handleSignOut()}
      },
    ];
    return (
      
      <div>
       <Dropdown
            menu={{
              items
            }}
            trigger={['click']}
          >
            <h1 onClick={(e) => e.preventDefault()}>
              <Space>
              <h1 className="text-xl ml-2 font-bold uppercase flex items-center cursor-pointer bg-secondary p-2 sm:px-4 "><UserOutlined /> &nbsp; <span className="hidden lg:block"></span></h1>
              </Space>
            </h1>
          </Dropdown>
      </div>
    )
  } else {
    return (
      <Link href="/auth">

          <h1 className="text-xl ml-2 font-bold uppercase flex items-center cursor-pointer bg-secondary p-2 sm:px-4 "> &nbsp; <span className="hidden lg:block"><UserOutlined/> Login</span></h1>
      </Link>
    )
  }
}