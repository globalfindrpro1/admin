import { db, storageRef } from "@/app/lib/firebase/firebase";
// import fs from 'fs/promises';
// import { IncomingForm } from "formidable"
import mime from "mime"
import { getKeyInObject} from '@/app/helpers/utils';
import moment from "moment";
export const handleDelete = async (params) => {
  try {
     await db
      .collection("event")
      .doc(params.id)
      .delete()

    return {
      code : 11,
      events : await handleFetch({fetchType : params.offset !== false ? 'current' : '', offset : params.offset})
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleFetch = async (params) => {
  const LIMIT = 30;
  let fetchType = params.fetchType;
  
  try {
    let data = [];
    const now = new Date().getDate();
    let query = db.collection('event').orderBy('eventTimeStamp');
    // const querySnapshot = await query.orderBy('id').where('eventTimeStamp', '>=', now).orderBy('id').get();
    
    if(fetchType == 'next') {
      query = query.startAfter(params.offset)
    }
    
    if(fetchType == 'current') {
      query = query.startAt(params.offset)
    }

    if(fetchType == 'prev') {
      query = query.endBefore(params.offset).limitToLast(LIMIT);
    } else {
      query = query.limit(LIMIT);
    } 

    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });


    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const handleUpdate = async (params) => {
  try {
    let updateResp = await db
      .collection("event")
      .doc(params.id)
      .update({
        title : getKeyInObject(params, 'title'),
        description : getKeyInObject(params, 'description'),
        country : getKeyInObject(params, 'country'),
        city : getKeyInObject(params, 'city'),
        eventTimeStamp : params?.eventTime != '' ? moment(params?.eventTime).unix() * 1000 : '',
        faq : getKeyInObject(params, 'faqs'),
        images : getKeyInObject(params, 'images'),
        flyerUri : params?.images[0], 
        videoUri : getKeyInObject(params, 'videoUri'),
        updatedAt : new Date().getTime()
      });
    
    return {
      code : '11',
      message : 'Event was successfully saved',
      events : await handleFetch({fetchType : params.offset !== false ? 'start' : '', offset : params.offset})
    }
  } catch (error) {
    console.log('==========================================');
    console.log(error);
    console.log('==========================================');
    return {
      code : '00',
      message : 'There was some issue in updating the event, please try again',
    }
  }
};

export const handleUploadFile = async (req) => {
  let status = 500, filePath = '',
  message= "Upload error";
  
  try {
    const formData = await req.formData();
    const file = formData.get('uploadedFile');

    if(file) {
      let allowedMimetypes = [
        "image/jpeg",
        "image/png",
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-matroska',
        'video/x-msvideo',
        'video/x-flv',
        'video/x-ms-wmv',
        'video/3gpp',
        'video/3gpp2',
        'video/vnd.rn-realvideo',
        'video/x-mng',
        'video/x-ms-asf',
        'video/x-m4v',
        'video/x-mpeg',
        'video/x-ms-vob',
        'video/x-la-asf'
      ];

      if(!allowedMimetypes.includes(file.type)) {
        message = 'Please upload a valid file';
      } else {
        let fileSizeInMegabytes = file.size / (1024*1024);

        if(fileSizeInMegabytes > 100) {
          message = 'File max size limit exceeded, please upload a file upto 100MB';
        } else {
          const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`
          const fileName = `${uniqueSuffix}.${mime.getExtension(file.type)}`;
          
          try {
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            // const fileBuffer = await fs.readFile(file.filepath);
            const imageBuffer = new Uint8Array(fileBuffer);
            const response = await new Promise(async (resolve, reject) => {
              const uploadTask = storageRef.child(fileName).put(imageBuffer, {
                contentType: file.type
              });
              uploadTask.on('state_changed', 
              (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              }, 
              (error) => {
                console.log('---------')
                console.log(error)
                reject(error);
              }, 
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  filePath = downloadURL;
                  status = 200;
                  console.log('File available at', downloadURL);
                  message = 'success';
                  resolve('success');
                });
              }
            );
          });
        } catch (e) {
          console.log(e);
        }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  return {
    status : status,
    resultBody : {message : message, filePath : filePath},
  } 
};