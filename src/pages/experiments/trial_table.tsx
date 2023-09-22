import React, { useEffect, useState } from 'react';
// import './index.css';
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button, Drawer, Form, Input, InputNumber, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Create, DeleteButton, Edit, EditButton, TextField, useDrawerForm } from '@refinedev/antd';
import { IIntervention, ITrial } from '../../interfaces';
import { INTERVENTION_COLLECTION, TRIAL_COLLECTION } from '../../utility';
import { HttpError, useList, useUpdate } from '@refinedev/core';
import Title from 'antd/lib/typography/Title';
import { TrialForm } from './trial_form';




interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if ((child as React.ReactElement).key === 'sort') {
                    return React.cloneElement(child as React.ReactElement, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{ touchAction: 'none', cursor: 'move' }}
                                {...listeners}
                            />
                        ),
                    });
                }
                return child;
            })}
        </tr>
    );
};

interface TrialTableProps {

    groupId: string
}

export const TrialTable: React.FC<TrialTableProps> = ({ groupId }) => {
    const { data: trials } = useList<ITrial>({ resource: TRIAL_COLLECTION, sorters: [{ field: 'key', order: 'asc' }], filters: [{ field: 'groupId', operator: 'eq', value: groupId }] });
    const { data: interventions } = useList<IIntervention>({ resource: INTERVENTION_COLLECTION });
    const { mutate } = useUpdate();
    const { formProps: trialCreateFormProps, drawerProps, saveButtonProps: trialSaveButtonProps, show } = useDrawerForm<
        ITrial,
        HttpError,
        ITrial
    >({
        action: "create",
        resource: TRIAL_COLLECTION
    });

    const { formProps: trialEditFormProps, drawerProps: drawerEditProps, saveButtonProps: trialEditSaveButtonProps, show: showEdit } = useDrawerForm<
        ITrial,
        HttpError,
        ITrial
    >({
        action: "edit",
        resource: TRIAL_COLLECTION
    });

    const columns: ColumnsType<ITrial> = [
        {
            key: 'sort',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
        },
        {
            title: 'Intervention',
            dataIndex: 'interventionId',
            render: (value: string) => {
                return <TextField value={interventions?.data.find(
                    (intervention) => intervention.id == value
                )?.name} />;
            }
        },
        {
            title: 'Proportion Stimuli',
            dataIndex: 'proportionStimuli',
        },
        {
            title: '',
            dataIndex: 'id',
            render: (value) => <>
                <EditButton
                    hideText
                    size="small"
                    recordItemId={value}
                    onClick={() => showEdit(value)} />
                <DeleteButton
                    resource={TRIAL_COLLECTION}
                    hideText
                    size='small'
                    recordItemId={value} /></>,
            align: "right"
        },
    ];

    const [dataSource, setDataSource] = useState<ITrial[]>([]);
    useEffect(() => {
        if (trials?.data) {
            setDataSource(trials.data);
        }
    }, [trials]);


    const updateIndexes = async (trials: ITrial[]) => {
        await new Promise((resolve) => {
            for (let i = 0; i < trials.length; i++) {
                const trial = trials[i];
                const index = trials?.findIndex((el) =>
                    el.key.toString() === trial.key.toString()) + 1;

                setTimeout(resolve, 40);

                mutate({
                    resource: TRIAL_COLLECTION,
                    values: { key: index.toString() },
                    id: trial.id,
                    successNotification: () => {
                        return (i === trials.length - 1) ? {
                            message: 'Order updated',
                            description: '',
                            type: 'success'
                        } : false;
                    }
                });
            }
        });

    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                const newOrder = arrayMove(previous, activeIndex, overIndex);
                updateIndexes(newOrder);
                return newOrder;
            });
        }
    };

    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={dataSource.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <Title level={5}>Trials <Button size="middle" onClick={() => { show(); }}><PlusOutlined /> Add Trial</Button></Title>

                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        size="small"
                        pagination={false}
                        rowKey="key"
                        columns={columns}
                        dataSource={dataSource}
                    />
                </SortableContext>
            </DndContext>
            <Drawer {...drawerProps}>
                <Create breadcrumb={false} goBack={false} title="Add Trial" saveButtonProps={trialSaveButtonProps}>
                    <TrialForm formProps={trialCreateFormProps} interventions={interventions?.data ?? []} groupId={groupId} nextKey={(dataSource.length > 0 ? dataSource[dataSource.length - 1].key + 1 : 1).toString()} />
                </Create>
            </Drawer>
            <Drawer {...drawerEditProps}>
                <Edit breadcrumb={false} canDelete={false} goBack={false} title="Edit Trial" saveButtonProps={trialEditSaveButtonProps}>
                    <TrialForm formProps={trialEditFormProps} interventions={interventions?.data ?? []} groupId={groupId} />
                </Edit>
            </Drawer>
        </>);
};

