import { Col, Form, Input, List, Row, Upload, Typography, Checkbox, Spin, Button } from "antd"
import { IStimuliSet, IStimulus } from "../../../../interfaces"
import { FormProps } from "antd/lib"
import { STIMULI_SET_COLLECTION, STIMULUS_IMAGE_BUCKET, USER_IMAGE_BUCKET, normalizeFile, storage } from "../../../../utility"
import { RcFile } from "antd/es/upload"
const { Text, } = Typography;

import { DeleteButton, EditButton, SaveButton, useCheckboxGroup, useSimpleList } from "@refinedev/antd"
import { useCreate, useUpdate } from "@refinedev/core"
import { useEffect, useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
interface StimulusFormProps {
    formProps: FormProps
    experimentId?: string
}
export const StimulusForm: React.FC<StimulusFormProps> = ({ formProps, experimentId }) => {
    const { listProps, queryResult } = useSimpleList<IStimuliSet>(
        { resource: STIMULI_SET_COLLECTION, filters: { permanent: [{ field: 'experimentId', operator: 'eq', value: experimentId }] } });


    const { checkboxGroupProps } = useCheckboxGroup<IStimuliSet>(
        { resource: STIMULI_SET_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }], optionLabel: 'name', optionValue: 'id' });

    const { mutate: add } = useCreate<IStimuliSet>()
    const { mutate: edit, isLoading } = useUpdate<IStimuliSet>()

    const [editStimuliSets, setEdit] = useState(false)
    const [editingStimuliSet, setEditingStimuliSet] = useState('')

    const saveStimuliSetName = (value: string, id: string) => {
        setEditingStimuliSet(id)
        edit({
            resource: STIMULI_SET_COLLECTION,
            values: { name: value },
            id: id
        })
    }

    const addStimuliSet = () => {
        add({
            resource: STIMULI_SET_COLLECTION,
            values: { name: 'New Stimuli Set', experimentId: experimentId }
        })
    }



    const renderItem = (item: IStimuliSet) => {
        const { id, name } = item;

        return (
            <List.Item actions={[<DeleteButton type="link" size="small" hideText hidden={!editStimuliSets} recordItemId={id} resource={STIMULI_SET_COLLECTION} />]} >

                <Checkbox name="stimuliSets" value={id}>
                    {editStimuliSets ? isLoading && editingStimuliSet == id ? <Spin /> : <Text editable={{ onChange: (value) => saveStimuliSetName(value, id) }}>{name}</Text> : name}
                </Checkbox>
            </List.Item >
        );
    };

    return <Form {...formProps} layout="vertical" onFinish={(stimulus: IStimulus) => {
        formProps.onFinish?.({
            ...stimulus,
            userImage: JSON.stringify(stimulus.userImage),
            stimulusImage: JSON.stringify(stimulus.stimulusImage),
        });
    }}>
        <Form.Item name="experimentId" initialValue={experimentId} hidden>
            <Input type="hidden" />
        </Form.Item>
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
        <Form.Item label="User Image">
            <Form.Item
                name="userImage"
                valuePropName="fileList"
                normalize={normalizeFile}
                noStyle
            >
                <Upload.Dragger
                    name="file"
                    listType="picture"
                    multiple
                    customRequest={async ({
                        file,
                        onError,
                        onSuccess,
                    }) => {
                        try {
                            const rcFile = file as RcFile;
                            const { $id } = await storage.createFile(
                                USER_IMAGE_BUCKET,
                                rcFile.uid,
                                rcFile,
                            );

                            const url = storage.getFileView(
                                USER_IMAGE_BUCKET,
                                $id,
                            );

                            onSuccess?.({ url }, new XMLHttpRequest());
                        } catch (error) {
                            onError?.(new Error("Upload Error"));
                        }
                    }}
                >
                    <p className="ant-upload-text">
                        Drop a file in this area
                    </p>
                </Upload.Dragger>
            </Form.Item>
        </Form.Item>
        <Form.Item
            label="Stimulus Text"
            name="stimulusText"

        >
            <Input />
        </Form.Item>

        <Form.Item label="Stimulus Image">
            <Form.Item
                name="stimulusImage"
                valuePropName="fileList"
                normalize={normalizeFile}
                noStyle
            >
                <Upload.Dragger
                    name="file"
                    listType="picture"
                    multiple
                    customRequest={async ({
                        file,
                        onError,
                        onSuccess,
                    }) => {
                        try {
                            const rcFile = file as RcFile;
                            const { $id } = await storage.createFile(
                                STIMULUS_IMAGE_BUCKET,
                                rcFile.uid,
                                rcFile,
                            );

                            const url = storage.getFileView(
                                STIMULUS_IMAGE_BUCKET,
                                $id,
                            );
                            onSuccess?.({ url }, new XMLHttpRequest());
                        } catch (error) {
                            onError?.(new Error("Upload Error"));
                        }
                    }}
                >
                    <p className="ant-upload-text">
                        Drop a file in this area
                    </p>
                </Upload.Dragger>
            </Form.Item>
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
        <Row gutter={[10, 10]}>
            <Col md={24}>
                <Row>
                    <Col xs={12}>Stimuli Sets</Col>
                    <Col xs={12}>
                        {editStimuliSets
                            ? <><SaveButton size="small" style={{ float: 'right' }} onClick={() => setEdit(false)} type="link" /><Button size="small" type="link" onClick={addStimuliSet}><PlusOutlined /> Stimuli Set</Button></>
                            : <EditButton style={{ float: 'right' }} size="small" onClick={() => setEdit(true)} type="link" />
                        }
                    </Col>
                </Row>
                <Form.Item name="stimuliSets">
                    <Checkbox.Group>
                        <List {...listProps} locale={{ emptyText: 'Click Edit to add a Stimuli Set' }} renderItem={renderItem} pagination={false} />
                    </Checkbox.Group>
                </Form.Item>
            </Col>
        </Row>
    </Form >
}
