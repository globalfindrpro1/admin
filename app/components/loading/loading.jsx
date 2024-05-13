import { Spin } from 'antd';

export default function Loading({ className }) {
  return (
    <main  className="flex justify-center pt-5">
      <Spin size='large'/>
    </main>
  )
}