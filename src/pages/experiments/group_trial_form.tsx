import { Button, Col, Collapse, CollapseProps, Drawer, Form, FormProps, Input, InputNumber, List, Row, Typography } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IGroup, ITrial } from "../../interfaces";
import { GROUP_COLLECTION, TRIAL_COLLECTION } from "../../utility";
import { Create, EditButton, useDrawerForm } from "@refinedev/antd";
import { HttpError, useList, useTable } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import { PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { TrialTable } from "./trial_table";
const { Text } = Typography;

export interface GroupTrialsFormProps {
    formProps: FormProps;
    setValues: Dispatch<SetStateAction<IGroup>>;
    values: IGroup;
}

export const GroupTrialForm: React.FC<GroupTrialsFormProps> = () => {
    const { data: groups } = useList<IGroup>({ resource: GROUP_COLLECTION });
    const [edit, setEdit] = useState(-1);
    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IGroup,
        HttpError,
        IGroup
    >({
        action: "create",
        resource: GROUP_COLLECTION
    });




    const renderItem = (item: IGroup, index: number) => {
        return index == edit ? renderItemEdit(item, index) : renderItemDisplay(item, index)
    }

    const renderItemDisplay = (item: IGroup, index: number) => {
        const { id, name, numParticipants } = item;

        return (
            <>
                <List.Item actions={[<Button type="link" onClick={() => { setEdit(index); }}>Edit</Button>]}>
                    <List.Item.Meta title={name} description={numParticipants} />
                </List.Item>
            </>
        );
    };

    const renderItemEdit = (item: IGroup, index: number) => {
        const { id, name, numParticipants } = item;

        function _saveName(value: string): void {
            item.name = value
        }

        function _saveNumParticipants(value: string): void {
            item.numParticipants = parseInt(value)
        }

        return (
            <>
                <List.Item actions={[<Button type="link" onClick={() => { setEdit(-1) }}>Save</Button>, <Button type="link" onClick={() => { setEdit(-1) }}>Cancel</Button>]}>
                    <List.Item.Meta title={<Text editable={{
                        editing: true, onChange: _saveName
                    }}>{name}</Text>} description={<Text editable={{ editing: true, onChange: _saveNumParticipants }}>{numParticipants}</Text>} />
                </List.Item >
            </>
        );
    };

    const collapseItems: CollapseProps['items'] = groups?.data.map((group: IGroup) => ({
        key: group.id,
        label: `${group.name} | ${group.numParticipants} Participants`,
        children: <TrialTable groupId={group.id} />,
        extra: <EditButton size="small" type="link" style={{ padding: '0', margin: '0' }} />
    }));


    return <>
        <Row style={{ paddingTop: "24px" }} >
            <Col span={18}>
                <Title level={3}>Groups <Button onClick={() => show()}><UsergroupAddOutlined /> Add Group</Button></Title>
            </Col>

        </Row>
        <Collapse items={collapseItems} />
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} goBack={false} title="Add Group" saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical" >
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
                        label="Participants"
                        name="numParticipants"
                        rules={[
                            {
                                required: true,
                                type: 'number',
                                max: 9999
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    </>
}


