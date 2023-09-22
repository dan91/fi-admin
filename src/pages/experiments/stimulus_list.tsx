import { Avatar, Button, Card, Col, Drawer, Form, FormProps, Input, List, Row, Select, Space, Table, Tag, Typography, Upload } from "antd"
import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { IFile, IStimulus } from "../../interfaces";
import { APPWRITE_URL, AUTH_CODES_COLLECTION, STIMULUS_COLLECTION, STIMULUS_IMAGE_BUCKET, USER_IMAGE_BUCKET, normalizeFile, storage } from "../../utility";
import { Create, Edit, EditButton, ImageField, TagField, getValueFromEvent, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError, useGetIdentity } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import Icon, { CommentOutlined, EditOutlined, LikeOutlined, PlusOutlined, ShareAltOutlined, UploadOutlined } from "@ant-design/icons";
import React from "react";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { StimulusForm } from "./stimulus_form";
import { Permission, Role } from "@refinedev/appwrite";
const { Text } = Typography;

export interface StimulusFormProps {
    experimentId: string
}

export const StimulusList: React.FC<StimulusFormProps> = ({ experimentId }) => {

    const { listProps } = useSimpleList<IStimulus>({
        resource: STIMULUS_COLLECTION,
        filters: { permanent: [{ field: 'experimentId', operator: 'eq', 'value': experimentId }] }
    });

    const [edit, setEdit] = useState(-1);

    const { data: identity } = useGetIdentity<{
        $id: string;
    }>();

    const { formProps, drawerProps, show, saveButtonProps, onFinish, close } = useDrawerForm<
        IStimulus,
        HttpError,
        IStimulus
    >({
        action: "create",
        resource: STIMULUS_COLLECTION,
        successNotification: () => {
            return { message: 'Post wurde erstellt', type: 'success' }
        },
        meta: {
            writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
            readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
        }
    });

    const { formProps: editFormProps, deleteButtonProps, drawerProps: editDrawerProps, show: editShow, saveButtonProps: editSaveButtonProps, onFinish: onEditFinish, close: editClose } = useDrawerForm<
        IStimulus,
        HttpError,
        IStimulus
    >({
        action: "edit",
        resource: STIMULUS_COLLECTION,
        queryOptions: {
            select: ({ data }) => {
                return {
                    data: {
                        ...data,
                        userImage: data.userImage
                            ? JSON.parse(data.userImage)
                            : undefined,
                        stimulusImage: data.stimulusImage
                            ? JSON.parse(data.stimulusImage)
                            : undefined,
                    },
                };
            },
        },
        successNotification: () => {
            return { message: 'Post edited', type: 'success' }
        },

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

    const renderItemDisplay = (stimulus: IStimulus, index: number) => {
        const userImage = stimulus?.userImage ? (JSON.parse(stimulus.userImage) as IFile[]) : [];
        const stimulusImage = stimulus?.userImage ? (JSON.parse(stimulus.userImage) as IFile[]) : [];

        const { id, likes, comments, shares, userName, stimulusText } = stimulus;
        return <List.Item
            key={id} >
            <Card size="small">
                <Row gutter={[20, 20]} style={{ padding: '10px 0' }}>
                    <Col span={18}><Avatar size={40} src={userImage.length > 0 ? userImage[0].url : ''} /> {userName}</Col>
                    <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}><EditButton hideText={true} type="link" onClick={() => editShow(id)} /></Col>
                </Row>
                <Row gutter={[20, 20]} style={{ padding: '10px 0' }}>
                    <Col style={{ minHeight: '24px' }}>{stimulusText}</Col></Row>
                <Row gutter={[20, 20]} style={{ padding: '10px 0' }}>
                    <Col>
                        <ImageField height={100} value={stimulusImage.length > 0 ? stimulusImage[0].url : ''} />
                    </Col>
                </Row>
                <Row gutter={[20, 20]} style={{ padding: '10px 0' }}>
                    <Col>
                        <IconText icon={LikeOutlined} text={likes ? likes.toString() : '0'} key="list-vertical-star-o" />
                    </Col>
                    <Col>
                        <IconText icon={CommentOutlined} text={comments ? comments.toString() : '0'} key="list-vertical-like-o" />
                    </Col>
                    <Col>
                        <IconText icon={ShareAltOutlined} text={shares ? shares.toString() : '0'} key="list-vertical-message" />
                    </Col>
                </Row>
            </Card>
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
        <List {...listProps} renderItem={renderItem} pagination={false} itemLayout="vertical" grid={{ gutter: 10, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }} />
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
                <StimulusForm experimentId={experimentId} formProps={formProps} onFinish={onFinish} close={close} />
            </Create>
        </Drawer >
        <Drawer {...editDrawerProps}>
            <Edit breadcrumb={false} resource={STIMULUS_COLLECTION} saveButtonProps={editSaveButtonProps} deleteButtonProps={deleteButtonProps}>
                <StimulusForm experimentId={experimentId} formProps={editFormProps} onFinish={onEditFinish} close={editClose} />
            </Edit>
        </Drawer >
    </>

}


