import { Avatar, Button, Col, Drawer, Form, FormProps, Input, List, Row, Select, Space, Table, Tag, Typography, Upload } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IStimulus } from "../../interfaces";
import { APPWRITE_URL, AUTH_CODES_COLLECTION, STIMULUS_COLLECTION, storage } from "../../utility";
import { Create, TagField, getValueFromEvent, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import Icon, { CommentOutlined, EditOutlined, LikeOutlined, PlusOutlined, ShareAltOutlined, UploadOutlined } from "@ant-design/icons";
import React from "react";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
const { Text } = Typography;

export interface StimulusFormProps {
    // formProps: FormProps;
    changeUploadState: (info: UploadChangeParam<UploadFile<any>>) => void;
    setValues: Dispatch<SetStateAction<IStimulus>>;
    // values: IStimulus;
}

export const StimulusForm: React.FC<StimulusFormProps> = ({ changeUploadState, setValues }) => {
    const { listProps } = useSimpleList<IStimulus>({ resource: STIMULUS_COLLECTION });
    const [edit, setEdit] = useState(-1);
    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IStimulus,
        HttpError,
        IStimulus
    >({
        action: "create",
        resource: STIMULUS_COLLECTION
    });

    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );


    const renderItem = (item: IStimulus, index: number) => {
        return index == edit ? renderItemEdit(item, index) : renderItemDisplay(item, index)
    }

    const renderItemDisplay = (item: IStimulus, index: number) => {

        return <List.Item
            key={item.id} >
            <Row gutter={[0, 20]}>
                <Col><Avatar src={item.userImage} /> {item.userName}</Col>
                <Col><Button type="link"><EditOutlined /> Edit</Button></Col>
            </Row>
            <Row gutter={[0, 20]}><Col><Space /> {item.stimulusText}</Col></Row>
            <Row gutter={[0, 20]}>
                <Col><img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                /></Col>
            </Row>
            <Row gutter={[0, 20]}>
                <Col>
                    <IconText icon={LikeOutlined} text={item.likes.toString()} key="list-vertical-star-o" />
                    <IconText icon={CommentOutlined} text={item.comments.toString()} key="list-vertical-like-o" />
                    <IconText icon={ShareAltOutlined} text={item.shares.toString()} key="list-vertical-message" />
                </Col>
            </Row>
            <Row>
                In Stimuli Sets: <Tag>Test</Tag>
            </Row>
        </List.Item>
    };

    const renderItemEdit = (item: IStimulus, index: number) => {
        // const { id, name, message } = item;

        // function _saveName(value: string): void {
        //     item.name = value
        // }

        // function _saveMessage(value: string): void {
        //     item.message = value
        // }

        return (
            <>
                <List.Item actions={[<Button type="link" onClick={() => { setEdit(-1) }}>Save</Button>, <Button type="link" onClick={() => { setEdit(-1) }}>Cancel</Button>]}>
                    {/* <List.Item.Meta title={<Text editable={{
                        editing: true, onChange: _saveName
                    }}>{name}</Text>} description={<Text editable={{ editing: true, onChange: _saveMessage }}>{message}</Text>} /> */}
                </List.Item >
            </>
        );
    };

    return <>
        <Row style={{ paddingTop: "24px" }} >
            <Col span={18}>
                <Title level={3}>Stimuli <Button onClick={() => show()}><PlusOutlined /> Add</Button></Title>
            </Col>

        </Row >
        <List {...listProps} renderItem={renderItem} pagination={false} itemLayout="vertical" />
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label="User Name"
                        name="userName"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={getValueFromEvent}
                        noStyle
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Upload.Dragger
                            name="file"
                            action={`${APPWRITE_URL}/media/upload`}
                            listType="picture"
                            maxCount={1}
                            accept=".png,.jpg"
                            onChange={changeUploadState}
                            customRequest={async ({
                                file,
                                onError,
                                onSuccess,
                            }) => {
                                try {

                                    const rcFile = file as RcFile;
                                    const { $id } = await storage.createFile(
                                        "64c1272a658c2465fffc",
                                        rcFile.uid,
                                        rcFile,
                                    );

                                    const url = storage.getFileView(
                                        "64c1272a658c2465fffc",
                                        $id,
                                    );

                                    onSuccess?.({ url }, new XMLHttpRequest());
                                    // setValues({
                                    //     ...values,
                                    //     'userImage': $id,
                                    // })
                                    // item.userImage = $id

                                } catch (error) {
                                    onError?.(new Error("Upload Error"));
                                }
                            }}
                        >
                            <Space direction="vertical" size={2}>
                                <UploadOutlined style={{ fontSize: 24 }} />
                                <Text
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "16px",
                                        marginTop: "8px",
                                    }}
                                >
                                    User Image
                                </Text>
                                <Text style={{ fontSize: "12px" }}>
                                    Validierung
                                </Text>
                            </Space>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        label="Stimulus Text"
                        name="stimulusText"

                    >
                        <Input />
                    </Form.Item>
                    <Row gutter={[10, 10]}>
                        <Col md={8}>
                            <Form.Item
                                label="Likes"
                                name="likes"

                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col md={8}>
                            <Form.Item
                                label="Comments"
                                name="comments"

                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col md={8}>
                            <Form.Item
                                label="Shares"
                                name="shares"

                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item

                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={getValueFromEvent}
                        noStyle
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Upload.Dragger
                            name="file"
                            action={`${APPWRITE_URL}/media/upload`}
                            listType="picture"
                            maxCount={1}
                            accept=".png,.jpg"
                            onChange={changeUploadState}
                            customRequest={async ({
                                file,
                                onError,
                                onSuccess,
                            }) => {
                                try {

                                    const rcFile = file as RcFile;
                                    const { $id } = await storage.createFile(
                                        "64c1272a658c2465fffc",
                                        rcFile.uid,
                                        rcFile,
                                    );

                                    const url = storage.getFileView(
                                        "64c1272a658c2465fffc",
                                        $id,
                                    );

                                    onSuccess?.({ url }, new XMLHttpRequest());
                                    // setValues({
                                    //     ...values,
                                    //     'userImage': $id,
                                    // })
                                    // item.userImage = $id

                                } catch (error) {
                                    onError?.(new Error("Upload Error"));
                                }
                            }}
                        >
                            <Space direction="vertical" size={2}>
                                <UploadOutlined style={{ fontSize: 24 }} />
                                <Text
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "16px",
                                        marginTop: "8px",
                                    }}
                                >
                                    Stimulus Image
                                </Text>
                                <Text style={{ fontSize: "12px" }}>
                                    Validierung
                                </Text>
                            </Space>
                        </Upload.Dragger>
                    </Form.Item>

                </Form>
            </Create>
        </Drawer>
    </>

}


