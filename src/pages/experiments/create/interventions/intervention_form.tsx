import { Button, Col, Drawer, Form, FormProps, Input, List, Row, Typography } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IExperiment, IIntervention } from "../../../../interfaces";
import { INTERVENTION_COLLECTION } from "../../../../utility";
import { Create, DeleteButton, EditButton, SaveButton, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError, useGetIdentity, useUpdate } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { Permission, Role } from "@refinedev/appwrite";
import { EmptyList } from "../../../../utility/empty";
import { PageTitle } from "../../../../utility/pageTitle";
const { Text } = Typography;

export interface InterventionFormProps {
    experimentId: string
}

export const InterventionForm: React.FC<InterventionFormProps> = ({ experimentId }) => {
    const { listProps, queryResult } = useSimpleList<IIntervention>({
        resource: INTERVENTION_COLLECTION,
        filters: { permanent: [{ field: 'experimentId', operator: 'eq', value: experimentId }] }
    });

    const { mutate } = useUpdate<IIntervention>()

    const [edit, setEdit] = useState<IIntervention | null>(null);

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
            writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
            readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
        }
    });


    const renderItem = (item: IIntervention) => {
        return item == edit ? renderItemEdit(item) : renderItemDisplay(item)
    }

    const renderItemDisplay = (item: IIntervention) => {
        const { id, name, message } = item;

        return (
            <>
                <List.Item actions={[<EditButton type="link" onClick={() => { setEdit(item); }} />]}>
                    <List.Item.Meta title={'Name: ' + name} description={'Message: ' + message} />
                </List.Item>
            </>
        );
    };

    const handleSave = (intervention: IIntervention) => {
        setEdit(null)
        mutate({ resource: INTERVENTION_COLLECTION, values: { name: intervention.name, message: intervention.message }, id: intervention.id })
    }

    const renderItemEdit = (item: IIntervention) => {
        const { name, message } = item;

        const _saveName = (newValue: string): void => {
            item.name = newValue
        }

        const _saveMessage = (newValue: string): void => {
            item.message = newValue
        }

        return (
            <>
                <List.Item>
                    <List.Item.Meta title={<>Name:<Text style={{ margin: '0 0 0 10px' }} editable={{
                        editing: true, onChange: (newValue) => _saveName(newValue)
                    }}>{name}</Text></>}
                        description={
                            <>Message:<Text style={{ margin: '0 0 0 10px' }}
                                editable={{ editing: true, onChange: (newValue) => _saveMessage(newValue) }}>{message}</Text></>} />
                    <SaveButton type="link" onClick={() => handleSave(item)} /> <DeleteButton type="link" recordItemId={item.id} resource={INTERVENTION_COLLECTION} icon={false} /> <Button type="link" onClick={() => { setEdit(null) }}>Cancel</Button>
                </List.Item >
            </>
        );
    };

    return <>
        <PageTitle title="Interventions" buttonAction={() => show()} buttonIcon={<PlusOutlined />} />

        {listProps.dataSource?.length == 0 ? <EmptyList text="interventions" callback={show} /> : <List {...listProps} renderItem={renderItem} pagination={false} />}
        <Drawer {...drawerProps}>
            <Create title="Add Intervention" goBack={false} breadcrumb={false} saveButtonProps={saveButtonProps}>
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


