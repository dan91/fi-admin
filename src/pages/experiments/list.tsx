import {
    IResourceComponentsProps,
    HttpError,
    useUpdate,
    useGo,
} from "@refinedev/core";
import { TagField, useTable, List } from "@refinedev/antd";
import { CheckCircleOutlined, EditOutlined, PauseOutlined, PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Table, Button, Space } from "antd";


import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";
import React, { ReactNode } from "react";
import { ExperimentStatus } from "./show";
import { useGetTrialsByExperimentId } from "../../utility/api";


export const ExperimentList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IExperiment, HttpError>({ resource: EXPERIMENT_COLLECTION });
    const { mutate } = useUpdate<IExperiment>()

    const go = useGo()

    const setStatus = (id: string, status: string) => {
        mutate({
            resource: EXPERIMENT_COLLECTION,
            values: { status: status },
            id: id,
            successNotification: false
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
            default: return <></>
        }
    }

    const selectColor = (status: string): string => {
        switch (status) {
            case ExperimentStatus.completed:
                return 'success'
            case ExperimentStatus.published:
                return 'processing'
            default: return 'default'
        }
    }

    const selectButtonList = (status: ExperimentStatus, value: string): ReactNode[] => {
        switch (status) {
            case ExperimentStatus.published:
                return buttonListPublished(value)
            case ExperimentStatus.paused:
                return buttonListPaused(value)
            case ExperimentStatus.completed:
                return buttonListCompleted(value)

            default: return []
        }
    }



    const buttonListCompleted = (value: string) => []

    const buttonListPaused = (value: string) => [<Button icon={<PlayCircleOutlined />}
        onClick={() => { setStatus(value, ExperimentStatus.published) }}>
        Resume</Button>, <Button icon={<CheckCircleOutlined />}
            onClick={() => { setStatus(value, ExperimentStatus.completed) }}>
        Set as Completed</Button>]

    const buttonListPublished = (value: string) => [<Button icon={<PauseOutlined />}
        onClick={() => { setStatus(value, ExperimentStatus.paused) }}>
        Pause</Button>]

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column<IExperiment> dataIndex="name" title="Name" width="50%"
                    render={(value, record) => {
                        const action = record.status == ExperimentStatus.draft ? 'edit' : 'show'
                        return <Button type="link" onClick={() => go({ to: { action: action, resource: EXPERIMENT_COLLECTION, id: record.id } })}> {value}</Button>
                    }
                    } />
                <Table.Column width="20%"
                    dataIndex="status"
                    title="Status"
                    render={(value: string, record: IExperiment) => <TagField icon={selectIcon(record.status)} color={selectColor(record.status)} value={value} />}
                />
                <Table.Column<IExperiment> dataIndex="id" width="30%"
                    render={(value: string, record: IExperiment) => {
                        return <div style={{ float: 'right' }}><Space>
                            {selectButtonList(record.status, value)}</Space></div>
                    }
                    }
                />
            </Table>
        </List >
    );
};


