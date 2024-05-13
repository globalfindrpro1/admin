
import { useState, useEffect } from 'react';
import { Spin, Alert, Button } from 'antd';
import { ArrowRightOutlined,ArrowLeftOutlined } from '@ant-design/icons'
import {listEvents, deleteEvent as deleteEventServer} from '@/app/services/events'
import { objectLength } from '@/app/helpers/utils';
import EventCard from './EventCard'
import EventDetailModal from './EventDetailModal'
import EventUpdateModal from './EventUpdateModal'

export default function EventList(props) {
  const { auth, session, db } = props;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalEvents = 30;
  let error = false;

  const [page, setPage] = useState(1);

  const [eventDetail, setEventDetail] = useState(false);
  const [eventUpdateDetail, setEventUpdateDetail] = useState(false);

  const getEvents = async (offset = '', fetchType = "") => {
    setLoading(true);
    listEvents(offset, fetchType).then((events = {})=>{
      console.log('events');
      console.log(events);
      setEvents([...events]);
      setLoading(false);
    })
    .catch((response)=>{
      if (response.status === 400) {
        // Handle 400
      } else {
        // Handle else
      }
      console.log(response.status)
      console.log(response.message)
    });
  }

  const deleteEvent = async (id, offset) => {
    setLoading(true);
    deleteEventServer(id, offset).then((events = {})=>{
      if(events.code == '11') {
        console.log('events');
        setEvents([...events.data]);
      }
      setLoading(false);
    })
    .catch((response)=>{
      
    });
  }

  useEffect(()=>{
    getEvents();
  }, []);

  return (
    <main>
      <div className="w-full my-20 px-10">
        <h1 className="font-bold text-4xl uppercase mb-6 text-center">All Events</h1>
          {
            loading ? 
            <Spin className="flex justify-center" size='large' /> :
            error ? (<Alert message="Error" type="error" showIcon />) :
            <>
              <div className="flex justify-end mt-4">
                {page > 1 && 
                  <Button className='border-2 cursor-pointer bg-black text-white' onClick={() => {
                    getEvents(events[0]?.eventTimeStamp, 'prev');
                    setPage(page - 1);
                  } } type="primary" shape="round" icon={<ArrowLeftOutlined />} />
                }

                {objectLength(events) >= totalEvents && 
                <Button className="border-2 cursor-pointer bg-black text-white ml-2" onClick={() => {
                  getEvents(events[objectLength(events) - 1].eventTimeStamp, 'next');
                    setPage(page + 1);
                  }}  type="primary" shape="round" icon={<ArrowRightOutlined />} />
                }
              </div>
              
              {objectLength(events) == 0 ? 
                <Alert
                  message="Error"
                  description="No events were found"
                  type="error"
                  showIcon
                /> : 
                <div className="flex flex-wrap justify-evenly">
                  {events?.map((e, index) => <EventCard deleteEvent = {(id) => {

                    let offset = false;
                    if(events[0].eventTimeStamp == eventTimeStamp) {
                      if(objectLength(events) > 0) {
                        offset = events[1].eventTimeStamp;
                      }
                    } else {
                      offset = events[0].eventTimeStamp;
                    }
                    deleteEvent(id, offset);
                  }}
                  setEventDetail = {setEventDetail}
                  setEventUpdateDetail = {setEventUpdateDetail}
                  data={e}
                  key={index}
                  />)}
                </div>
              }
            </>
          }
      </div>
      
      <EventDetailModal
        handleClose = {() => {
          setEventDetail(false);
        }}
        data = {eventDetail}
      />
      
      <EventUpdateModal
        offset={objectLength(events) > 0 ? events[0].eventTimeStamp : false}
        handleClose = {() => {
          setEventUpdateDetail(false);
        }}
        handleRefreshData = {(data) => {
          if(objectLength(data) > 0)
          setEvents(data);
          setEventUpdateDetail(false);
        }}
        data = {eventUpdateDetail}
      />
    </main>
  )
}