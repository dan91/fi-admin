import { Button, Col, Drawer, Form, FormProps, Input, List, Row, Typography } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IExperiment, IIntervention } from "../../interfaces";
import { INTERVENTION_COLLECTION } from "../../utility";
import { Create, DeleteButton, EditButton, SaveButton, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError, useGetIdentity } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Permission, Role } from "@refinedev/appwrite";
const { Text } = Typography;

export interface InterventionFormProps {
    experimentId: string
}

export const InterventionForm: React.FC<InterventionFormProps> = ({ experimentId }) => {
    const { listProps } = useSimpleList<IIntervention>({
        resource: INTERVENTION_COLLECTION,
        filters: { permanent: [{ field: 'experimentId', operator: 'eq', value: experimentId }] }
    });
    const [edit, setEdit] = useState(-1);

    const { data: identity } = useGetIdentity<{
        $id: string;
    }>();

    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IIntervention,
        HttpError,
        IIntervention
    >({
        action: "create",
        resource: INTERVENTION_COLLECTION,
        meta: {
            writePermissions: [Permission.read(Role.user(identity?.$id))],
            readPermissions: [Permission.read(Role.user(identity?.$id))]
        }
    });


    const renderItem = (item: IIntervention, index: number) => {
        return index == edit ? renderItemEdit(item, index) : renderItemDisplay(item, index)
    }

    const renderItemDisplay = (item: IIntervention, index: number) => {
        const { id, name, message } = item;

        return (
            <>
                <List.Item actions={[<EditButton type="link" onClick={() => { setEdit(index); }} />]}>
                    <List.Item.Meta title={name} description={message} />
                </List.Item>
            </>
        );
    };

    const renderItemEdit = (item: IIntervention, index: number) => {
        const { id, name, message } = item;

        function _saveName(value: string): void {
            item.name = value
        }

        function _saveMessage(value: string): void {
            item.message = value
        }

        return (
            <>
                <List.Item actions={[<SaveButton type="link" onClick={() => { setEdit(-1) }} />, <DeleteButton type="link" recordItemId={item.id} resource={INTERVENTION_COLLECTION} icon={false} />, <Button type="link" onClick={() => { setEdit(-1) }}>Cancel</Button>]}>
                    <List.Item.Meta title={<Text editable={{
                        editing: true, onChange: _saveName
                    }}>{name}</Text>} description={<Text editable={{ editing: true, onChange: _saveMessage }}>{message}</Text>} />
                </List.Item >
            </>
        );
    };

    return <>
        <Row style={{ paddingTop: "24px" }} >
            <Col span={18}>
                <Title level={3}>Interventions <Button onClick={() => show()}><PlusOutlined /> Add</Button></Title>
            </Col>

        </Row >
        <List {...listProps} renderItem={renderItem} pagination={false} />
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical">
                    <Form.Item name="experimentId" initialValue={experimentId} hidden>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    </>
}


