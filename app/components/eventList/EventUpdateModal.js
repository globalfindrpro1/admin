'use client'
import React, { useEffect, useState } from 'react'
import { Row, Col, Modal,message,Spin,Upload } from 'antd';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Space,
} from 'antd';
import moment from 'moment';
import { PlusCircleFilled, MinusCircleFilled,PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Formik, ErrorMessage, FieldArray } from 'formik';
import { Country, City } from 'country-state-city'
import * as Yup from 'yup';
import { objectLength } from '@/app/helpers/utils';
import TextArea from 'antd/lib/input/TextArea';
import {updateEvent} from '@/app/services/events'
import dayjs from 'dayjs';

const EventUpdateModal = ({data, handleClose, handleRefreshData, offset}) => {
    const { id, title,description, country, city, images, videoUri ,eventTimeStamp, faq } = data;
    
    const [loading, setLoading] = useState(false);
    const [countryList, setCountryList] = useState(false);
    const [cityList, setCityList] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [uploadedImageList, setUploadedImageList] = useState([]);
    const [uploadedVideoList, setUploadedVideoList] = useState([]);
    let faqsInit = [];
    const initialValues = {
        title: title,
        description: description,
        city: city,
        country: country,
        city: city,
        eventTime: eventTimeStamp,
        faqs : objectLength(faq) > 0 ? faq : faqsInit,
        images ,
        videoUri : videoUri,
        id : id,
    };

    useEffect(() => {
        if(data != false) {
           
        setCountryList(Country.getAllCountries().map(({name, isoCode}) => {
            if(name == initialValues.country) {
                setCityList(City.getCitiesOfCountry(isoCode).map(({name}) => ({label : name, value : name})));
            }
            return {label : name, value : name, code : isoCode}
        }));


        let imagesData = images.map((value, key) => {
            return {
                uid: (key  * -1),
                name: 'file ' + (key + 1),
                status: 'done',
                url: value,
            };
        });

        setUploadedImageList(imagesData);
        if((typeof videoUri !== 'undefined' && videoUri.length) > 0) {
            setUploadedVideoList([{
                uid: (-1),
                name: 'Event Video',
                status: 'done',
                url: videoUri,
            }]);
        }
        }
    }, [data, images, initialValues.country, videoUri]);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handlePreviewFile = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        
        window.open(file.url || file.preview, '_blank').focus();
        return false;
    };






    return (
        data === false ? '' : 
        <>
            <Modal title={'Event Detail'} footer={''}  open={data !== false} width={700} onOk={handleClose} onCancel={handleClose}>
            <div className="w-full flex flex-col items-center">
                <Row className="w-full">
                    <Col span={24} className="">
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize = {true}
                        validationSchema = { 
                            Yup.object({
                                title: Yup.string()
                                .max(50, 'Must be 50 characters or less')
                                .required('This field is required'),
                                description: Yup.string().max(1000, 'Must be 1000 characters or less'),
                                faqs: Yup.array()
                                .of(Yup.object().shape({
                                    question: Yup.string().max(50, 'Must be 50 characters or less').required('This field is required'),
                                    answer: Yup.string().max(450, 'Must be 450 characters or less').required('This field is required'),
                                }))
                        })}
                        onSubmit={async (values, { resetForm }) => {
                            if((values.images.length == 0) ) {
                                return message.error('Please add atleast an image to continue ');
                            }
                            
                            for(let i in values.faqs) {
                                if(values.faqs[i].question.length == 0 || values.faqs[i].answer.length == 0) {
                                    return message.error('Please add all the questions and answers');
                                }
                            }

                            values.images = uploadedImageList.map(({url})=>{return url});
                            values.videoUri = objectLength(uploadedVideoList) > 0 ? uploadedVideoList[0].url : '';
                            values.offset = offset;

                            setLoading(true);
                           
                            let updateEventResp = await updateEvent(values);
                            if(updateEventResp.code == '11') {
                                message.success(updateEventResp.message);
                                handleRefreshData(updateEventResp.events);
                            } else {
                                message.error(updateEventResp.message);
                            }
                            setLoading(false);
                        }}
                        >
                        {({ values,errors,handleChange,handleSubmit,handleBlur,touched,setFieldValue }) => (
                            <Form
                                labelCol={{
                                    span: 4,
                                }}
                                    
                                wrapperCol={{
                                    span: 24,
                                }}
                                layout="horizontal"
                                size={'large'}
                                onFinish = {(values) => {
                                }}
                            >
                            <h3>Event Images</h3>
                            <Upload
                                action={`/api/events/uploadFile`}
                                listType="picture-card"
                                fileList={uploadedImageList}
                                name="uploadedFile"
                                onPreview={handlePreviewFile}
                                onChange={(props) => {
                                    let fileL = props.fileList;
                                    if(props?.file?.status == 'done') {
                                        fileL[objectLength(props.fileList) - 1].url = props.file.response.resultBody.filePath;
                                    }
                                    setUploadedImageList([...fileL]);
                                }}
                                beforeUpload={(file) => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                    if (!isJpgOrPng) {
                                      message.error('You can only upload JPG/PNG file!');
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 10;
                                    if (!isLt2M) {
                                      message.error('Image must smaller than 10MB!');
                                    }
                                    return isJpgOrPng && isLt2M;
                                }}
                            >
                                {uploadedImageList.length >= 5 ? '' : <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                        marginTop: 8,
                                        }}
                                    >
                                        Upload
                                    </div>
                                    </div>
                                }
                            </Upload>
                            <h3>Name your Event</h3>
                            <Form.Item formItemLayoutWithOutLabel>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder='Event name'
                                    type="text"
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                                {touched.title && errors.title ? (
                                <div className="text-danger">{errors.title}</div>
                                ) : null}
                            </Form.Item>
                            <h3>Event Description</h3>
                            <Form.Item formItemLayoutWithOutLabel>
                                <TextArea
                                    id="description"
                                    name="description"
                                    placeholder='Event Description'
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                                { errors.description ? (
                                <div className="text-danger">{errors.description}</div>
                                ) : null}
                            </Form.Item>
                            
                            <h3>Event Time</h3>
                            <Form.Item formItemLayoutWithOutLabel>
                                <DatePicker 
                                    showTime={false}
                                    onChange={(date,value)=>{
                                        setFieldValue('eventTime', value);
                                    }}
                                    name="eventTime" defaultValue={values.eventTime > 0 ? dayjs(dayjs.unix(values.eventTime/1000), 'YYYY-MM-DD') : ''}
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                            
                            <Form.Item formItemLayoutWithOutLabel>
                                <Select
                                    showSearch
                                    placeholder="Select a country"
                                    optionFilterProp="country"
                                    onChange={(value, item)=> {
                                        if(value.length > 0) {
                                            setCityList(City.getCitiesOfCountry(item.code).map(({name}) => ({label : name, value : name})));
                                        } else {
                                            setCityList(false);
                                        }

                                        setFieldValue('country',value);
                                        setFieldValue('city','');
                                    }}
                                    value={values.country}
                                    filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={countryList}
                                />
                            </Form.Item>
                            
                            {cityList && 
                                <Form.Item formItemLayoutWithOutLabel>
                                    <Select
                                        showSearch
                                        placeholder="Select a city"
                                        optionFilterProp="city"
                                        onChange={(value, item)=> {
                                            setFieldValue('city',value);
                                        }}
                                        value={values.city}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={cityList}
                                    />
                                </Form.Item>
                            }
                            
                            <Form.Item formItemLayoutWithOutLabel>
                                <h3>Event Video</h3>
                                <Upload
                                    action={`/api/events/uploadFile`}
                                    maxCount={1}
                                    fileList={uploadedVideoList}
                                    name="uploadedFile"
                                    onPreview={handlePreviewFile}
                                    showUploadList = {{
                                        showDownloadIcon: true,
                                        downloadIcon: 'Download',
                                        showRemoveIcon: true,
                                        removeIcon: <DeleteOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
                                    }}
                                    beforeUpload={(file) => {
                                        const isVideoFile = [
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
                                            'video/x-la-asf',
                                            // Add more as needed
                                          ].includes(file.type);
                                        if (!isVideoFile) {
                                          message.error('Please upload a valid video');
                                          setFieldValue('video','');

                                        }
                                        const isLt2M = file.size / 1024 / 1024 < 20;
                                        if (!isLt2M) {
                                          setFieldValue('video','');

                                          message.error('Video must be smaller than 20MB!');
                                        }
                                        return isVideoFile && isLt2M || Upload.LIST_IGNORE;
                                        
                                    }}
                                    onChange={(props) => {
                                        let fileL = props.fileList;
                                        if(props?.file?.status == 'done') {
                                            fileL[objectLength(props.fileList) - 1].url = props.file.response.resultBody.filePath;
                                        }
                                
                                        setUploadedVideoList([...fileL]);
                                    }}
                                >
                                    {uploadedVideoList.length >= 1 ? '' : <div>
                                        <Button icon={<PlusOutlined />}>Upload</Button>
                                        </div>
                                    }
                                </Upload>
                                {objectLength(uploadedVideoList) > 0 && uploadedVideoList[0]?.url?.length > 0 &&
                                    <video width="450" controls src={uploadedVideoList[0].url}>
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </Form.Item>


                            <Form.Item formItemLayoutWithOutLabel>
                                <h3>Faqs</h3>
                                <>
                                <FieldArray name="faqs">
                                    {({ insert, remove, push }) => (
                                    <div className="form-group">
                                        {values.faqs.length > 0 &&
                                        values.faqs.map((lnk, index) => (
                                            <Space
                                                key={index}
                                                style={{
                                                display: 'flex',
                                                marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item formItemLayoutWithOutLabel>
                                                    <Input
                                                        id={`faqs.${index}.question`}
                                                        name={`faqs.${index}.question`}
                                                        placeholder='Add your question'
                                                        type="text"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values['faqs'][index]?.question}
                                                    />

                                                    <ErrorMessage
                                                        name={`faqs.${index}.question`}
                                                        component="div"
                                                        className="text-danger"
                                                    />
                                                </Form.Item>
                                                <Form.Item formItemLayoutWithOutLabel>
                                                    <Input
                                                        id={`faqs.${index}.answer`}
                                                        name={`faqs.${index}.answer`}
                                                        placeholder='Add your answer'
                                                        type="text"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values['faqs'][index]?.answer}
                                                    />
                                                    <ErrorMessage
                                                        name={`faqs.${index}.answer`}
                                                        component="div"
                                                        className="text-danger"
                                                    />
                                                </Form.Item>
                                                <Form.Item formItemLayoutWithOutLabel>
                                                <Button
                                                        type="dashed"
                                                        onClick={() => remove(index)}
                                                        icon={<MinusCircleFilled />}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Form.Item>

                                            </Space>
                                        ))}
                                        {values.faqs.length <=5 && 
                                            <div>
                                                <a href="javascript:;" className="pull-right upload-file"  onClick={() => push({ question: '', answer: '' })} ><PlusCircleFilled /> Add faq</a>
                                            </div>
                                        }
                                    </div>
                                    )}
                                    </FieldArray>
                                </>
                            </Form.Item>
                            <Form.Item formItemLayoutWithOutLabel>
                            {loading == false ? 
                                <Button onClick={handleSubmit} className="border-2 cursor-pointer bg-black text-white  flex items-center uppercase font-bold" type="submit">Update Event</Button>
                                    :
                                    <Spin className="flex justify-center" size='large' />
                                }
                            </Form.Item>
                        </Form>
                    )}
                    </Formik>
                        
                    </Col>
                </Row>
                </div>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img
                alt="example"
                style={{
                    width: '100%',
                }}
                src={previewImage}
                />
            </Modal>
        </>
        
    )
}

export default EventUpdateModal
