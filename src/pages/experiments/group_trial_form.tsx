import { Alert, Button, Col, Collapse, CollapseProps, Drawer, Form, FormProps, Input, InputNumber, List, Row, Spin, Typography } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import { IGroup, ITrial } from "../../interfaces";
import { GROUP_COLLECTION, TRIAL_COLLECTION } from "../../utility";
import { Create, Edit, EditButton, useDrawerForm } from "@refinedev/antd";
import { HttpError, useGetIdentity, useList, useTable } from "@refinedev/core";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import { PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { TrialTable } from "./trial_table";
import { GroupForm } from "./group_form";
import { Permission, Role } from "@refinedev/appwrite";
const { Text } = Typography;

export interface GroupTrialsFormProps {
    experimentId?: string
}

export const GroupTrialForm: React.FC<GroupTrialsFormProps> = ({ experimentId }) => {
    const { data: groups, isLoading } = useList<IGroup>({
        resource: GROUP_COLLECTION,
        filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }]
    });

    const { data: identity } = useGetIdentity<{
        $id: string;
    }>();

    const { formProps, drawerProps, show, saveButtonProps } = useDrawerForm<
        IGroup,
        HttpError,
        IGroup
    >({
        action: "create",
        resource: GROUP_COLLECTION,
        meta: {
            writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
            readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
        }
    });

    const { formProps: editFormProps, drawerProps: editDrawerProps, show: showEdit, saveButtonProps: saveEditButtonProps, deleteButtonProps } = useDrawerForm<
        IGroup,
        HttpError,
        IGroup
    >({
        action: "edit",
        resource: GROUP_COLLECTION,
    });

    const collapseItems: CollapseProps['items'] = groups?.data.map((group: IGroup) => ({
        key: group.id,
        label: `${group.name} | ${group.numParticipants} Participants`,
        children: <TrialTable experimentId={experimentId} groupId={group.id} />,
        extra: <EditButton size="small" type="link" onClick={(e) => { e.stopPropagation(); showEdit(group.id) }} />
    }));

    console.log(groups)

    return <>
        <Row style={{ paddingTop: "24px" }} >
            <Col span={18}>
                <Title level={3}>Groups <Button onClick={() => show()}><UsergroupAddOutlined /> Add Group</Button></Title>
            </Col>

        </Row>
        {isLoading ? <Spin /> :
            groups?.data && groups.data.length > 0 ? <Collapse items={collapseItems} /> : <Alert message="No groups added." type="info" />
        }
        <Drawer {...drawerProps}>
            <Create breadcrumb={false} goBack={false} title="Add Group" saveButtonProps={saveButtonProps}>
                <GroupForm formProps={formProps} experimentId={experimentId} />
            </Create>
        </Drawer>
        <Drawer {...editDrawerProps}>
            <Edit resource={GROUP_COLLECTION} deleteButtonProps={deleteButtonProps} breadcrumb={false} goBack={false} title="Edit Group" saveButtonProps={saveEditButtonProps}>
                <GroupForm formProps={editFormProps} experimentId={experimentId} />
            </Edit>
        </Drawer>
    </>
}


