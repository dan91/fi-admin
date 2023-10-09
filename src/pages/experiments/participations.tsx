import { HttpError, useList, useShow, } from "@refinedev/core";
import { List, Table, Typography } from "antd";
import { IExperimentParticipation, IGroup } from "../../interfaces/index"
import { useTable } from "@refinedev/antd";
import { EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION } from "../../utility";
const { Text } = Typography

interface ExperimentParticipationsProps {
  experimentId: string
}

export const ExperimentParticipations: React.FC<ExperimentParticipationsProps> = ({ experimentId }) => {
  const { tableProps } = useTable<IExperimentParticipation, HttpError>({ resource: EXPERIMENT_PARTICIPATIONS, filters: { initial: [{ field: 'experimentId', operator: 'eq', value: experimentId }] } });
  const { data: groupsData } = useList<IGroup>({ resource: GROUP_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] });
  const groups = groupsData?.data ?? []
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="userId" title="User ID" />
        <Table.Column dataIndex="groupId" title="Group" render={(value) => groups.find((g) => g.id == value)?.name} />
        <Table.Column dataIndex="status" title="Status" />
      </Table>
    </List>
  );
}