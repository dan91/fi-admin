import { LoadingOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
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
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EditButton,
    TextField,
    useDrawerForm,
    Create,
    useSimpleList,
} from "@refinedev/antd";
import { Table, Form, Button, Select, Drawer, InputNumber, Input } from "antd";
import { IIntervention, ITrial } from "../../interfaces";
import { INTERVENTION_COLLECTION, TRIAL_COLLECTION } from "../../utility";
import { HttpError, useList, useUpdate } from "@refinedev/core";
import Title from 'antd/lib/typography/Title';
import { isNumberObject } from 'util/types';

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
}

interface TrialTableProps {

    groupId: string
}

export const TrialTable: React.FC<TrialTableProps> = ({ groupId }) => {
    const { queryResult } = useSimpleList<ITrial>({ resource: TRIAL_COLLECTION, filters: { permanent: [{ field: 'groupId', operator: 'eq', value: groupId }] } });
    const { data: interventions } = useList<IIntervention>({ resource: INTERVENTION_COLLECTION });
    const { mutate } = useUpdate();



    const { formProps: trialFormProps, drawerProps, saveButtonProps: trialSaveButtonProps, show } = useDrawerForm<
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



    const filteredTrials = (queryResult.data?.data as ITrial[] ?? [])
    console.log(filteredTrials)

    const [dataSource, setDataSource] = useState<ITrial[]>(filteredTrials);
    const [controller, setController] = useState<AbortController | null>(null);


    const updateIndexes = async (trials: ITrial[]) => {
        if (trials.length < 1)
            return
        if (controller) {
            controller.abort();
        }
        const newController = new AbortController();
        setController(newController);
        const signal = newController.signal;

        try {
            await new Promise((resolve, reject) => {

                for (let i = 0; i < trials.length; i++) {
                    const trial = trials[i];
                    const index = trials?.findIndex((el) => {
                        console.log(el)
                        el.id === trial.key.toString()
                    }) + 1;

                    const timeoutId = setTimeout(resolve, 400);
                    signal.addEventListener("abort", () => {
                        clearTimeout(timeoutId);
                        reject(new Error("Update canceled " + i));
                    });

                    console.log('now running mutate');
                    mutate({
                        resource: TRIAL_COLLECTION,
                        values: { key: index },
                        id: trial.id ?? '',
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
        } catch (error: any) {
            console.error(error, trials);
        } finally {
            setController(null);
        }
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((previous) => {
                const activeIndex = previous?.findIndex((i) => i.key.toString() === active.id);
                const overIndex = previous?.findIndex((i) => i.key.toString() === over?.id);
                const newOrder = arrayMove(previous, activeIndex, overIndex);
                console.log(active, over, previous)
                updateIndexes(newOrder);
                return newOrder;
            });
        }
    };

    console.log('dataSource', dataSource)
    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // id={groupId}
                    key={groupId}
                    // rowKey array
                    items={queryResult.data?.data.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <Title level={5}>Trials <Button size="middle" onClick={() => { show(); }}><PlusOutlined /> Add Trial</Button></Title>
                    {/* <List canCreate={false} breadcrumb={false} title={<Title level={5}>Trials <Button size="middle" onClick={() => { show(); }}><PlusOutlined /> Add Trial</Button></Title>}> */}
                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="key"
                        dataSource={queryResult.data?.data}
                        pagination={false}
                    >
                        <Table.Column key="sort" />



                        <Table.Column<ITrial>
                            dataIndex="duration"
                            title="Duration"
                            render={(value, record) => {
                                return <TextField value={value + ' min'} />;
                            }}
                        />
                        <Table.Column<ITrial>
                            dataIndex="interventionId"
                            title="Intervention"
                            render={(value, record) => {
                                const currentIntervention = interventions?.data.find((intervention) =>
                                    intervention.id == record.interventionId
                                )

                                return <TextField value={currentIntervention?.name} />;
                            }}
                        />
                        <Table.Column<ITrial>
                            dataIndex="proportionStimuli"
                            title="Proportion Stimuli"
                            render={(value, record) => {

                                return <TextField value={value + '%'} />;
                            }}
                        />
                        <Table.Column<ITrial>
                            title="Actions"
                            dataIndex="actions"
                            render={(_, record) => {

                                return (
                                    <EditButton
                                        // {...editButtonProps(record.id)}
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                        onClick={() => showEdit(record.id)}
                                    />

                                );
                            }}
                        />
                    </Table>
                    {/* </List> */}


                </SortableContext>
            </DndContext>
            <Drawer {...drawerProps}>
                <Create breadcrumb={false} goBack={false} title="Add Trial" saveButtonProps={trialSaveButtonProps}>
                    <Form {...trialFormProps} layout="vertical">
                        <Form.Item name="groupId" initialValue={groupId.toString()}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item name="key" initialValue={dataSource.length > 0 ? dataSource[dataSource.length - 1].key + 1 : 1}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            label="Duration"
                            name="duration"
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
                        <Form.Item
                            label="Intervention"
                            name="interventionId"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                options={interventions?.data.map((intervention: IIntervention) => {
                                    return { value: intervention.id, label: intervention.name }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Proportion Stimuli"
                            name="proportionStimuli"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    max: 100,
                                    min: 0
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Form>
                </Create>
            </Drawer>
            <Drawer {...drawerEditProps}>
                <Create breadcrumb={false} goBack={false} title="Edit Trial" saveButtonProps={trialEditSaveButtonProps}>
                    <Form {...trialEditFormProps} layout="vertical">
                        <Form.Item
                            label="Duration"
                            name="duration"
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
                        <Form.Item
                            label="Intervention"
                            name="interventionId"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                options={interventions?.data.map((intervention: IIntervention) => {
                                    return { value: intervention.id, label: intervention.name }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Proportion Stimuli"
                            name="proportionStimuli"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    max: 100,
                                    min: 0
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Form>
                </Create>
            </Drawer>
        </>
    );

};


