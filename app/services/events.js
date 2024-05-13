'use client'

import axios from 'axios'
import { message } from 'antd';
import reLogin from '@/app/helpers/reLogin'

export const listEvents = async (offset = '', fetchType = "") => {
    try {
        const res = await axios.post(`/api/events/all`,{
            offset : offset,
            fetchType : fetchType,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('TOKEN')
            }
        });
        return res.data;
    } catch (err) {
        await reLogin();
    }
}

export const updateEventsListingData = (events) => async () => {
}

export const deleteEvent = async(eventId, offset=false) => {
    try {
        const res = await axios.post(`/api/events/delete`,{
            id : eventId,
            offset : offset
        }, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('TOKEN')
            },
        });

        if (res.status === 400 || res.status === 500) {
            message.error('Something went wrong, please try again');
            return {
                code : '00',
                message : 'Something went wrong, please try again'
            }
        } 

        message.success('Event was deleted successfully');

        return {
            code : '11',
            message : 'Success',
            data : res.data.events
        }
    } catch (err) {
        message.error('Something went wrong, please try again');
        return {
            code : '00',
            message : 'Something went wrong, please try again'
        }
    }
}


export const updateEvent = async (values) => {
    try {
        const res = await axios.post(`/api/events/update`,values, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('TOKEN')
            },
        });

        if (res.status === 400 || res.status === 500) {
            return {
                code : '00',
                message : 'Something went wrong, please try again'
            }
        } 
        
        return {
            code : res.data.code,
            message : res.data.message,
            events : res.data.events
        }
    } catch (err) {
        window.location.href='/';

        return {
            code : '00',
            message : 'Something went wrong, please try again'
        }
    }
}


export const detailProducts = (data) => async () => {
    
}