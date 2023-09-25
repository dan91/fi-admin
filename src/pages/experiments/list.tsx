
import {
    IResourceComponentsProps,
    HttpError,
    useUpdate,
    useNavigation,
} from "@refinedev/core";
import { TagField, EditButton, useTable, List } from "@refinedev/antd";
import { CheckCircleOutlined, ClockCircleOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, PauseCircleOutlined, PauseOutlined, PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Table, Button, Space } from "antd";


import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";
import React, { ReactNode } from "react";
import { ExperimentStatus } from "./show";


export const ExperimentList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IExperiment, HttpError>({ resource: EXPERIMENT_COLLECTION });
    const { mutate } = useUpdate<IExperiment>()
    const { show, edit } = useNavigation()

    const setStatus = (id: string, status: string) => {
        mutate({
            resource: EXPERIMENT_COLLECTION,
            values: { status: status },
            id: id
        })
    }

    const selectIcon = (status: ExperimentStatus): ReactNode => {
        switch (status) {
            case ExperimentStatus.completed:
                return <CheckCircleOutlined />
            case ExperimentStatus.published:
                return <SyncOutlined spin />
            case ExperimentStatus.draft:
                return <EditOutlined />
            case 'ready':
                return <ClockCircleOutlined />
            default: return <></>
        }
    }

    const selectColor = (status: string): string => {
        switch (status) {
            case ExperimentStatus.completed:
                return 'success'
            case ExperimentStatus.published:
                return 'processing'
            case ExperimentStatus.ready:
                return 'default'
            default: return 'default'
        }
    }

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column<IExperiment> dataIndex="name" title="Name" width="50%"
                    render={(value, record) => {
                        const target = () => {
                            return record.status == ExperimentStatus.ready || record.status == ExperimentStatus.draft ? edit(EXPERIMENT_COLLECTION, record.id) : show(EXPERIMENT_COLLECTION, record.id)
                        }
                        return <Button type="link" onClick={target}> {value}</Button>
                    }
                    } />
                <Table.Column width="20%"
                    dataIndex="status"
                    title="Status"
                    render={(value: string, record: IExperiment) => <TagField icon={selectIcon(record.status)} color={selectColor(record.status)} value={value} />}
                />
                <Table.Column<IExperiment> dataIndex="id" width="30%"
                    render={(value: string, record: IExperiment) => {


                        return record.status == ExperimentStatus.ready && <div style={{ float: 'right' }}><Space>
                            {status == ExperimentStatus.draft
                                ? <></>
                                : <Button icon={<EyeOutlined />}
                                    onClick={() => setStatus(value, ExperimentStatus.published)}>
                                    Publish</Button>}</Space></div>
                    }
                    }
                />
            </Table>
        </List >
    );
};


