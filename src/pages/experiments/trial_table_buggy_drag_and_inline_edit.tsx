import { MenuOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons';
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
import React, { MouseEventHandler, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
    List,
    SaveButton,
    EditButton,
    TextField,
    useEditableTable,
    useDrawerForm,
    Create,
} from "@refinedev/antd";
import { Table, Form, Space, Button, Input, Select, Drawer, InputNumber } from "antd";
import { IIntervention, ITrial } from "../../interfaces";
import { INTERVENTION_COLLECTION, TRIAL_COLLECTION } from "../../utility";
import { HttpError, useList, useUpdate } from "@refinedev/core";
import Title from 'antd/lib/typography/Title';
import { table } from 'console';

// export interface TrialTableProps {
//     interventions: IIntervention[]
// }
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

export const TrialTable: React.FC = () => {
    const { data: interventions } = useList<IIntervention>({ resource: INTERVENTION_COLLECTION });
    const { mutate } = useUpdate();

    const {
        tableProps,
        formProps,
        tableQueryResult,
        isEditing,
        setId: setEditId,
        saveButtonProps,
        cancelButtonProps,
        editButtonProps,
        onFinish
    } = useEditableTable<ITrial>({
        resource: TRIAL_COLLECTION, sorters: {
            permanent: [{
                field: 'key',
                order: 'asc'
            }]
        },

    });

    const { formProps: trialFormProps, drawerProps, saveButtonProps: trialSaveButtonProps, show } = useDrawerForm<
        ITrial,
        HttpError,
        ITrial
    >({
        action: "create",
        resource: TRIAL_COLLECTION
    });



    const [dataSource, setDataSource] = useState(tableQueryResult.data?.data ?? []);

    const updateIndexes = () => {
        dataSource.forEach((trial) => {
            const index = dataSource?.findIndex((i) => i.id === trial.id);
            setTimeout(() => {
                mutate({
                    resource: TRIAL_COLLECTION,
                    values: {
                        key: index
                    },
                    id: trial.id ?? ''
                })
                console.log('set new index ', index, ' for ', trial.duration)

            }, 1500);
        })

    }

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        console.log('old order', dataSource)

        if (active.id !== over?.id) {

            setDataSource((previous) => {
                const activeIndex = previous?.findIndex((i) => i.key === active.id);
                const overIndex = previous?.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
            updateIndexes()
        }
    };

    const finishHandler = (trial: any) => {

        const dataIndex = dataSource.findIndex(item => item.id === trial.id);
        if (dataIndex !== -1) {
            // Update the trial in the data source
            const updatedDataSource = [...dataSource];
            updatedDataSource[dataIndex] = trial;

            // Update the tableQueryResult data with the updated data source
            // tableQueryResult.setData(updatedDataSource);

            // Update the local state
            setDataSource(updatedDataSource);

            // Perform any additional save operations as needed
            // ...
        }
        onFinish({ '$id': trial.id, 'duration': parseInt(trial.duration), 'proportionStimuli': parseInt(trial.proportionStimuli), 'key': trial.key }).then(() => {
            setEditId('')
            console.log(dataSource)
        });
    }


    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={dataSource?.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <List canCreate={false} breadcrumb={false} title={<Title level={5}>Trials <Button size="middle" onClick={() => { show(); }}><PlusOutlined /> Add Trial</Button></Title>}>
                        <Form {...formProps} onFinish={finishHandler}>
                            <Form.Item name="id" hidden />
                            <Table {...tableProps}
                                components={{
                                    body: {
                                        row: Row,
                                    },
                                }}
                                rowKey="key"
                                dataSource={dataSource}
                                pagination={false}

                                onRow={(record) => ({
                                    // eslint-disable-next-line
                                    onClick: (event: any) => {
                                        if (event.target.nodeName === "TD") {
                                            setEditId && setEditId(record.id);
                                        }
                                    },
                                })}
                            >
                                <Table.Column key="sort" />
                                <Table.Column<ITrial> dataIndex="key" render={(value, record) => {
                                    if (isEditing(record.id)) {
                                        return (
                                            <Form.Item
                                                name="key"
                                                style={{ margin: 0 }}
                                            >
                                                <TextField value={value} />
                                            </Form.Item>
                                        );
                                    }
                                    return <TextField value={value} />
                                }} />


                                <Table.Column<ITrial>
                                    dataIndex="duration"
                                    title="Duration"
                                    render={(value, record) => {
                                        if (isEditing(record.id)) {
                                            return (
                                                <Form.Item
                                                    name="duration"
                                                    style={{ margin: 0 }}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            );
                                        }
                                        return <TextField value={value} />;
                                    }}
                                />
                                <Table.Column<ITrial>
                                    dataIndex="interventionId"
                                    title="Intervention"
                                    render={(value, record) => {
                                        const currentIntervention = interventions?.data.find((intervention) =>
                                            intervention.id == record.interventionId
                                        )
                                        if (isEditing(record.id)) {
                                            return (
                                                <Form.Item
                                                    name="interventionId"
                                                    style={{ margin: 0 }}
                                                >
                                                    <Select
                                                        defaultValue={currentIntervention?.id}
                                                        style={{ width: 120 }}
                                                        // onChange={handleChange}
                                                        options={interventions?.data.map((intervention: IIntervention) => {
                                                            return { value: intervention.id, label: intervention.name }
                                                        })}
                                                    />
                                                </Form.Item>
                                            );
                                        }
                                        return <TextField value={currentIntervention?.name} />;
                                    }}
                                />
                                <Table.Column<ITrial>
                                    dataIndex="proportionStimuli"
                                    title="Proportion Stimuli"
                                    render={(value, record) => {
                                        if (isEditing(record.id)) {
                                            return (
                                                <Form.Item
                                                    // rules={[
                                                    //     { min: 0, max: 100 }
                                                    // ]}
                                                    name="proportionStimuli"
                                                    style={{ margin: 0 }}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            );
                                        }
                                        return <TextField value={value} />;
                                    }}
                                />
                                <Table.Column<ITrial>
                                    title="Actions"
                                    dataIndex="actions"
                                    render={(_, record) => {
                                        if (isEditing(record.id)) {
                                            return (
                                                <Space>
                                                    <SaveButton
                                                        {...saveButtonProps}
                                                        hideText
                                                        size="small"
                                                    />
                                                    <Button
                                                        {...cancelButtonProps}
                                                        size="small"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Space>
                                            );
                                        }
                                        return (
                                            <EditButton
                                                {...editButtonProps(record.id)}
                                                hideText
                                                size="small"
                                            />
                                        );
                                    }}
                                />
                            </Table>
                        </Form>
                    </List>


                </SortableContext>
            </DndContext>
            <Drawer {...drawerProps}>
                <Create breadcrumb={false} headerProps={{}} saveButtonProps={trialSaveButtonProps}>
                    <Form {...trialFormProps} layout="vertical">

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
                                style={{ width: 120 }}
                                // onChange={handleChange}
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


