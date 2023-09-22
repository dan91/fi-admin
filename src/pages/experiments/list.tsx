
import {
    useTranslate,
    IResourceComponentsProps,
    HttpError,
    getDefaultFilter,
} from "@refinedev/core";
import { useSimpleList, CreateButton, TextField, TagField, EditButton, useTable, List } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Row, List as AntdList, Col, Form, Input, Typography, Table } from "antd";


import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";


export const ExperimentList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IExperiment, HttpError>({ resource: EXPERIMENT_COLLECTION });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column
                    dataIndex="status"
                    title="Status"
                    render={(value: string) => <TagField value={value} />}
                />
                <Table.Column dataIndex="id"
                    render={(value) => <EditButton resource={EXPERIMENT_COLLECTION} recordItemId={value} style={{ float: 'right' }} />}
                />
            </Table>
        </List>
    );
};

