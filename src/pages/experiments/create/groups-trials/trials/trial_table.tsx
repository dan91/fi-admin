import React, { useEffect, useState } from 'react';
// import './index.css';
import { CopyOutlined, LoadingOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
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

import { Button, Drawer, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Create, Edit, EditButton, TextField, useDrawerForm } from '@refinedev/antd';
import { IIntervention, IStimuliSet, ITrial } from '../../../../../interfaces';
import { INTERVENTION_COLLECTION, STIMULI_SET_COLLECTION, TRIAL_COLLECTION } from '../../../../../utility';
import { HttpError, useCreate, useGetIdentity, useList, useUpdate } from '@refinedev/core';
import { TrialForm } from './trial_form';
import { Permission, Role } from '@refinedev/appwrite';
import { EmptyList } from '../../../../../utility/empty';
import { PageTitle } from '../../../../../utility/pageTitle';
import '../../../../../../public/styles/table.css'

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
    experimentId?: string,
    groupId: string
}

interface CloningProps {
    toCloneId?: string
    clonedId?: string
}

export const TrialTable: React.FC<TrialTableProps> = ({ experimentId, groupId }) => {
    const { data: trials } = useList<ITrial>({ resource: TRIAL_COLLECTION, sorters: [{ field: 'key', order: 'asc' }], filters: [{ field: 'groupId', operator: 'eq', value: groupId }] });
    const { data: interventions } = useList<IIntervention>({ resource: INTERVENTION_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] });
    const { data: stimuliSets } = useList<IStimuliSet>({ resource: STIMULI_SET_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] });
    const { mutate } = useUpdate();
    const { mutate: clone } = useCreate<ITrial>()
    const [cloning, setCloning] = useState<CloningProps>({})

    const keys = trials?.data.map((t) => t.key ? parseInt(t.key) : 0) as number[]
    const hasDuplicates = keys ? keys.length !== new Set(keys).size : false;

    let highestKey = 0
    if (keys) {
        highestKey = Math.max(...keys)
    }

    const { data: identity } = useGetIdentity<{
        $id: string;
    }>();


    const { formProps: trialCreateFormProps, drawerProps, saveButtonProps: trialSaveButtonProps, show } = useDrawerForm<
        ITrial,
        HttpError,
        ITrial
    >({
        action: "create",
        resource: TRIAL_COLLECTION,
        meta: {
            writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
            readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
        },
        successNotification: () => {
            return { message: 'Trial created', type: 'success' }
        }
    });

    const {
        formProps: trialEditFormProps,
        deleteButtonProps,
        drawerProps: drawerEditProps,
        saveButtonProps: trialEditSaveButtonProps,
        show: showEdit } = useDrawerForm<
            ITrial,
            HttpError,
            ITrial
        >({
            action: "edit",
            resource: TRIAL_COLLECTION,
            successNotification: () => {
                return { message: 'Trial edited', type: 'success' }
            }
        });

    const columns: ColumnsType<ITrial> = [
        {
            key: 'sort',
            dataIndex: 'key',
            render(value) {
                return value
            }
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render(value) {
                return value + ' min'
            },
        },
        {
            title: 'Intervention',
            dataIndex: 'interventionId',
            key: 'intervention',
            render: (value: string) => {
                return <TextField key={value} value={interventions?.data.find(
                    (intervention) => intervention.id == value
                )?.name ?? 'None'} />;
            }
        },
        {
            title: 'Stimuli Set',
            dataIndex: 'stimuliSetId',
            key: 'stimuliSet',
            render: (value: string) => {
                return <TextField key={value} value={stimuliSets?.data.find(
                    (stimuliSet) => stimuliSet.id == value
                )?.name} />;
            }
        },
        {
            title: '% Stimuli',
            dataIndex: 'proportionStimuli',
            key: 'proportionStimuli',
            render(value) {
                return value ? value + '%' : ''
            },
        },
        {
            title: '',
            dataIndex: 'id',
            render: (value, record: ITrial) =>
                <Space><EditButton
                    size="small"
                    recordItemId={value}
                    onClick={() => showEdit(value)} />
                    <Button icon={cloning.toCloneId == record.id ? <LoadingOutlined /> : <CopyOutlined />} onClick={() => cloneItem(record)} size='small'>Clone</Button></Space>,
            align: "right"
        },
    ];

    const cloneItem = (trial: ITrial) => {
        const { id, duration, groupId, interventionId, proportionStimuli, stimuliSetId } = trial;
        setCloning({ toCloneId: id })
        const key = (highestKey + 1).toString()
        const clonedTrial = { duration, groupId, key, interventionId, proportionStimuli, stimuliSetId }
        clone({ resource: TRIAL_COLLECTION, values: clonedTrial }, { onSuccess: (data) => { setCloning({ clonedId: data.data.id }); setTimeout(() => setCloning({ clonedId: undefined }), 5000) } })
    }

    const [dataSource, setDataSource] = useState<ITrial[]>([]);
    useEffect(() => {
        if (trials?.data) {
            if (hasDuplicates) {
                console.log('has duplicates, reorder', trials.data)
                let currentKey = 1;
                for (let i = 0; i < trials?.data.length; i++) {
                    if (parseInt(trials?.data[i].key) !== currentKey) {
                        trials.data[i].key = currentKey.toString();
                    }
                    currentKey++;
                }
            }
            console.log(trials.data)
            setDataSource(trials.data);
        }
    }, [trials]);


    const updateIndexes = async (trialsTable: ITrial[]) => {
        await new Promise((resolve) => {
            for (let i = 0; i < trialsTable.length; i++) {
                const trial = trialsTable[i];
                const index = trialsTable?.findIndex((el) =>
                    el.id === trial.id
                ) + 1

                setTimeout(resolve, 40);

                mutate({
                    resource: TRIAL_COLLECTION,
                    values: { key: index.toString() },
                    id: trial.id,
                    successNotification: () => {
                        return (i === trialsTable.length - 1) ? {
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
                    <PageTitle title='Trials' titleLevel={5} buttonAction={() => { show(); }} buttonIcon={<PlusOutlined />} buttonText='Add Trial' buttonSize='small' />

                    {dataSource.length == 0 ? <EmptyList text="trials" callback={show} /> :
                        <Table
                            rowClassName={(record) => cloning.clonedId == record.id ? 'highlighted' : ''}
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
                        />}
                </SortableContext>
            </DndContext>
            <Drawer {...drawerProps}>
                <Create breadcrumb={false} title="Add Trial" goBack={false} saveButtonProps={trialSaveButtonProps}>
                    <TrialForm formProps={trialCreateFormProps} interventions={interventions?.data ?? []} stimuliSets={stimuliSets?.data ?? []} groupId={groupId} nextKey={(trials?.data && trials.data.length > 0 ? Math.max(...trials.data.map((t) => parseInt(t.key))) + 1 : 1)} />
                </Create>
            </Drawer>
            <Drawer {...drawerEditProps}>
                <Edit breadcrumb={false} canDelete={true} resource={TRIAL_COLLECTION} deleteButtonProps={deleteButtonProps} title="Edit Trial" goBack={false} saveButtonProps={trialEditSaveButtonProps}>
                    <TrialForm formProps={trialEditFormProps} interventions={interventions?.data ?? []} stimuliSets={stimuliSets?.data ?? []} groupId={groupId} />
                </Edit>
            </Drawer>
        </>);
};

