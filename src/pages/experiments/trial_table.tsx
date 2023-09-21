import React, { useState } from 'react';
// import './index.css';
import { MenuOutlined } from '@ant-design/icons';
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

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSimpleList } from '@refinedev/antd';
import { ITrial } from '../../interfaces';
import { TRIAL_COLLECTION } from '../../utility';


const columns: ColumnsType<ITrial> = [
    {
        key: 'sort',
    },
    {
        title: 'Intervention',
        dataIndex: 'interventionId',
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
    },
    {
        title: 'Proportion Stimuli',
        dataIndex: 'proportionStimuli',
    },
];

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
    const { queryResult } = useSimpleList<ITrial>({ resource: TRIAL_COLLECTION, filters: { permanent: [{ field: 'groupId', operator: 'eq', value: groupId }] } });
    const filteredTrials = (queryResult.data?.data as ITrial[] ?? [])

    const [dataSource, setDataSource] = useState<ITrial[]>(filteredTrials);


    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
        }
    };

    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
                // rowKey array
                items={dataSource.map((i) => i.key)}
                strategy={verticalListSortingStrategy}
            >
                <Table
                    components={{
                        body: {
                            row: Row,
                        },
                    }}
                    rowKey="key"
                    columns={columns}
                    dataSource={dataSource}
                />
            </SortableContext>
        </DndContext>
    );
};

