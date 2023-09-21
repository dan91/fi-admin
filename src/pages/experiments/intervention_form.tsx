import { Button, Col, Drawer, Form, FormProps, Input, List, Row, Select, Table, Typography } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IIntervention } from "../../interfaces";
import { AUTH_CODES_COLLECTION, INTERVENTION_COLLECTION } from "../../utility";
import { Create, TagField, useDrawerForm, useSimpleList } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
const { Text } = Typography;

export interface InterventionFormProps {
    formProps: FormProps;
    setValues: Dispatch<SetStateAction<IIntervention>>;
    values: IIntervention;
}

export const InterventionForm: React.FC<InterventionFormProps> = ({ setValues, values }) => {
    const { listProps } = useSimpleList<IIntervention>({ resource: INTERVENTION_COLLECTION });
    const [edit, setEdit] = useState(-1);
    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IIntervention,
        HttpError,
        IIntervention
    >({
        action: "create",
        resource: INTERVENTION_COLLECTION
    });


    const renderItem = (item: IIntervention, index: number) => {
        return index == edit ? renderItemEdit(item, index) : renderItemDisplay(item, index)
    }

    const renderItemDisplay = (item: IIntervention, index: number) => {
        const { id, name, message } = item;

        return (
            <>
                <List.Item actions={[<Button type="link" onClick={() => { setEdit(index); }}>Edit</Button>]}>
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
                <List.Item actions={[<Button type="link" onClick={() => { setEdit(-1) }}>Save</Button>, <Button type="link" onClick={() => { setEdit(-1) }}>Cancel</Button>]}>
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

