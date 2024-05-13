import app from './index'
import { getAuth } from "firebase-admin/auth";

import { NextResponse } from "next/server";

const auth = async (req, res, next) => {
    try {
        // const firebaseUser = await getAuth(app).verifyIdToken(req.headers.get('token'))
        // console.log('==============')
        // console.log(firebaseUser)
        // console.log(req.headers.get('token'))
        // console.log('==============')
        // if (!firebaseUser) {
        //     return NextResponse.json({
        //         message: 'Invalid or Expired Token'
        //     } ,{
        //         status: 401
        //     });
        // }

        // req.currentUser = firebaseUser;
        return next()
    } catch (err) {
        console.log('---------------')
        console.log(err)
        console.log('---------------')
        
        return NextResponse.json({
            message: 'Invalid or Expired Token'
        } ,{
            status: 401
        });
    }
}

export default auth;