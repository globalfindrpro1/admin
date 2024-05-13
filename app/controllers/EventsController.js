import {handleFetch, handleDelete, handleUpdate, handleUploadFile} from '@/app/lib/firebase/Events'
import { NextResponse } from "next/server";

export const getAllEvents = async (req) => {
    // let resp = await handleFetch(req?.nextUrl?.searchParams);
    console.log('--------------------events fetching-----------------')
    let resp = await handleFetch(await req.json());
    return NextResponse.json(resp, {
        status: 200
    });
}

// export const getAllEvents = async (req, res) => {
//     let resp = await handleFetch(req.body);
//     res.status(200).json(resp)
// }

export const deleteEvent = async (req, res) => {
    let resp = await handleDelete(await req.json());
    return NextResponse.json(resp, {
        status: 200
    });
}

export const updateEvent = async (req, res) => {
    let resp = await handleUpdate(await req.json());
    return NextResponse.json(resp, {
        status: 200
    });
}

export const uploadFile = async (req, res) => {
    let resp = await handleUploadFile(req);
    return NextResponse.json(resp, {
        status: 200
    });
}



