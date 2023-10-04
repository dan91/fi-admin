import { Avatar, Card, Col, Drawer, Image, List, Row, Space, Typography } from "antd"
import { IFile, IStimuliSet, IStimulus } from "../../../../interfaces";
import { STIMULI_SET_COLLECTION, STIMULUS_COLLECTION } from "../../../../utility";
import { Create, Edit, EditButton, TagField, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError, useGetIdentity, useList } from "@refinedev/core";
import { CommentOutlined, FileImageOutlined, LikeOutlined, PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import React from "react";
import { StimulusForm } from "./stimulus_form";
import { Permission, Role } from "@refinedev/appwrite";
import { EmptyList } from "../../../../utility/empty";
import { PageTitle } from "../../../../utility/pageTitle";
const { Text } = Typography;

export interface StimulusFormProps {
    experimentId: string
}

export const StimulusList: React.FC<StimulusFormProps> = ({ experimentId }) => {

    const { listProps } = useSimpleList<IStimulus>({
        resource: STIMULUS_COLLECTION,
        filters: { permanent: [{ field: 'experimentId', operator: 'eq', 'value': experimentId }] }
    });

    const { data: allStimuliSets } = useList<IStimuliSet>({
        resource: STIMULI_SET_COLLECTION,
        filters: [
            {
                field: "experimentId",
                operator: "eq",
                value: experimentId,
            },
        ],
    });



    const { data: identity } = useGetIdentity<{
        $id: string;
    }>();

    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IStimulus,
        HttpError,
        IStimulus
    >({
        action: "create",
        resource: STIMULUS_COLLECTION,
        successNotification: () => {
            return { message: 'Stimuls created', type: 'success' }
        },
        meta: {
            writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
            readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
        }
    });

    const { formProps: editFormProps, deleteButtonProps, drawerProps: editDrawerProps, show: editShow, saveButtonProps: editSaveButtonProps } = useDrawerForm<
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
            return { message: 'Stimulus edited', type: 'success' }
        },

    });

    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const renderItem = (stimulus: IStimulus, index: number) => {
        const userImage = stimulus?.userImage ? (JSON.parse(stimulus.userImage) as IFile[]) : [];
        const stimulusImage = stimulus?.stimulusImage ? (JSON.parse(stimulus.stimulusImage) as IFile[]) : [];

        const { id, likes, comments, shares, userName, stimulusText, stimuliSets } = stimulus;
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
                        {stimulusImage.length == 0 ? <FileImageOutlined style={{ fontSize: 100 }} /> :
                            <Image width="100%" src={stimulusImage[0].url} />}
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
                <Row>
                    <Col>In Stimuli Sets: {stimuliSets.length == 0 ? <>None</> : stimuliSets.map((id) => <TagField key={id} value={allStimuliSets?.data.find((set) => set.id == id)?.name} />)}</Col>
                </Row>
            </Card>
        </List.Item>
    };


    return <>
        <PageTitle title="Stimuli" buttonAction={() => show()} buttonIcon={<PlusOutlined />} />

        {listProps.dataSource?.length == 0 ? <EmptyList text="stimuli" callback={show} /> : <List {...listProps} renderItem={renderItem} pagination={false} itemLayout="vertical" grid={{ gutter: 10, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }} />}
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} saveButtonProps={saveButtonProps} title="Add Stimulus" goBack={false}>
                <StimulusForm experimentId={experimentId} formProps={formProps} />
            </Create>
        </Drawer >
        <Drawer {...editDrawerProps}>
            <Edit breadcrumb={false} title="Edit Stimulus" goBack={false} resource={STIMULUS_COLLECTION} saveButtonProps={editSaveButtonProps} deleteButtonProps={deleteButtonProps}>
                <StimulusForm experimentId={experimentId} formProps={editFormProps} />
            </Edit>
        </Drawer >
    </>

}


