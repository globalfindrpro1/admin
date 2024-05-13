import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Col, Row, Form, Input, message,Spin } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

export default function SignIn({ auth, router, handleCreateAccountClick }) {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    if(values.email != 'admin@events.com') {
      return message.error('These credentials do not match our records, please enter the correct values');
    }
    setLoading(true);
    await signInWithEmailAndPassword(auth, values.email, values.password)
    .then((res) => {
        message.success('Logged in Successfully 🎉')
        router.push('/', { scroll: false })
    })
    .catch((err) => {
        message.error('These credentials do not match our records, please enter the correct values');
        setLoading(false);
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container w-full p-4 px-4 lg:px-2 mt-10">
          <Row className="flex flex-col items-center justify-center">
              <Col className="p-4">
                  <h1 className="font-bold text-5xl uppercase">LOG IN</h1>
                  
                  <Form
                      name="basic"
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                      size="large"
                      className="login-form"
                  >
                      <Form.Item
                          name="email"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your Email!',
                              },
                          ]}
                      >
                          <Input type='text' className="w-full border outline-none mt-4 p-4" placeholder="Enter Email Here..." />
                      </Form.Item>
                      <Form.Item
                          name="password"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your Password!',
                              },
                          ]}
                      >
                          <Input.Password className="w-full border outline-none mt-4 p-4" placeholder="Enter Password Here..." />
                      </Form.Item>
                      { loading ? 
                          <Spin className="flex justify-center" size='large' /> : 
                            <button type="submit" className="border-2 cursor-pointer bg-black text-white py-4 px-6 mb-4 flex items-center uppercase font-bold mt-4">Log In &nbsp; <ArrowRightOutlined /></button>

                      }
                  </Form>
              </Col>
          </Row>
      </div>

  </div>
  )
}