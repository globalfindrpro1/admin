'use client'

import React from 'react'
import { Row, Col, Carousel, Collapse, Modal,Tag } from 'antd';
const { Panel } = Collapse;
import { LikeOutlined, EyeOutlined } from '@ant-design/icons'

const EventDetailModal = ({data, handleClose}) => {
    if(data === false) {
        return '';
    }

    const { title, viewCount,description,  likeCount, country, city, images, videoUri ,eventTimeStamp,faq } = data;

    // let faqsCollection = faq?.length > 0 ? faq.map((e, index) => {
    //     return { key: index + 1, label: e.question, children: <p>{e.answer}</p> }
    // }) : false;

    return (
        <>

            <Modal title={'Event Detail'} footer={''} width={700} open={data !== false} onOk={handleClose} onCancel={handleClose}>
                
            <div className="w-full flex flex-col justify-center items-center">

                <Row className="w-full ">
                    <Col span={24} className="">
                        <Carousel  autoplay className="w-full mb-4 flex  items-center content-center border overflow-hidden" >
                        {images?.length > 0 && 
                            images?.map((e, index) => 
                               <div key={index+'_key'} > <img src={e} key={index+'_key'}  alt="" className="max-h-80 max-w-80 " /></div>
                            )
                        }

                        </Carousel>
                        <div>
                            <hr className="text-gray-300" />
                            <div className="mt-4">
                                <div className="flex items-center mb-2">
                                    <h1 className="text-2xl uppercase italic font-bold ">{title}</h1>
                                    <>
                                        <h2 className='ml-4 mr-2 text-2xl flex items-center'>
                                            <EyeOutlined /> <span className='ml-1 text-black'>{viewCount}</span>
                                        </h2>

                                        <h2 className='text-2xl flex items-center'>
                                            <LikeOutlined /> <span className='ml-1 text-black'>{likeCount}</span>
                                        </h2>
                                    </>
                                </div>

                                <div className="flex items-between mb-2">
                                    <span>
                                        <Tag color="volcano"><strong>City:</strong> {city}</Tag> 
                                    </span>
                                    <span className='ml-2'>
                                    <Tag color="red"><strong>Country:</strong> {country}</Tag> 
                                    </span>
                                    {eventTimeStamp > 0 && 
                                    <span className='ml-2'>
                                        <Tag color="geekblue"><strong>Event date:</strong> {new Date(eventTimeStamp).toLocaleDateString("en-US")
                                        }</Tag> 
                                    </span>
                                    }
                                </div>

                                {description?.length > 1 && <div className='mb-4'>
                                    <Row className="">
                                        <Col span={24} className="pt-4">
                                            <p>{description}</p>
                                        </Col>
                                    </Row>
                                    </div>
                                }
                                
                                {faq?.length > 0 && 
                                    <div className='mb-5'>
                                        <h1 className="font-bold text-2xl uppercase">Event Faqs</h1>
                                        <Collapse defaultActiveKey={['1']} onChange={(key) => {
                                        }}>
                                            {faq?.map((e, index) => 
                                                <Panel header={e.question} key={index+1}>
                                                    <p>{e.answer}</p>
                                                </Panel>
                                            )}
                                        </Collapse>
                                    </div>
                                }
                                {videoUri?.length > 0 && 
                                    <div className=" mb-5">
                                        <h1 className="font-bold text-2xl uppercase">Event Video</h1>
                                        <div>
                                            <video width="450" controls src={videoUri}>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                }
                                

                            </div>
                        </div>
                    </Col>
                </Row>
                </div>
            </Modal>
        </>
    )
}

export default EventDetailModal
