'use client'
import React from 'react'
import { Carousel,Tag } from 'antd';
import { Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined, LikeOutlined,EditOutlined, EyeFilled, ClockCircleOutlined } from '@ant-design/icons'

const EventCard = ({ data, setEventDetail,setEventUpdateDetail, deleteEvent }) => {
    const { id, title, flyerUri,viewCount,  likeCount, country, city, eventTimeStamp } = data;
    
    const confirmDelete = (e) => {
        deleteEvent(data.id);
    };
    
    const cancelDelete = (e) => {
        // message.error('Click on No');
    };

    return (
        <div className="border-2 w-80 h-100 bg-white shadow-lg m-2 hover:border-black">
            
            <Carousel autoplay className="">
                <img onClick={() => setEventDetail(data)} src={flyerUri} alt="" className="h-72 object-cover " />
            </Carousel>

            <a href="javascript:;" onClick={() => setEventDetail(data)}>
                <h1 className=" mt-2 mx-4 font-normal text-sm cursor-pointer">{title}</h1>
            </a>
            <h3 className="mt-2 mx-4 font-normal text-sm cursor-pointer">{eventTimeStamp > 0 && 
                <span className='ml-2'>
                    <Tag color="geekblue"><strong><ClockCircleOutlined /></strong> {new Date(eventTimeStamp).toLocaleDateString("en-US")
                    }</Tag> 
                </span>
                } {city + ', ' + country}</h3>

            <div className="flex justify-between px-4 my-4">
                <div className='flex items-center'>
                    <h2 className='mr-2  flex items-center'>
                        <EyeOutlined /> <span className='ml-1 text-black'>{viewCount}</span>
                    </h2>

                    <h2 className=' flex items-center'>
                        <LikeOutlined /> <span className='ml-1 text-black'>{likeCount}</span>
                    </h2>
                </div>
                <div className='flex items-center'>
                    <Popconfirm
                        title="Are you sure to delete this event?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tag color="red"><DeleteOutlined /></Tag> 
                    </Popconfirm>

                    <Tag className="mx-2" onClick={() => setEventUpdateDetail(data)} color="geekblue"><EditOutlined /></Tag> 
                    <Tag onClick={() => setEventDetail(data)} color="geekblue"><EyeFilled /></Tag> 
                </div>
            </div>
            
        </div>
    )
}

export default EventCard
