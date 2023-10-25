import { HttpError, LogicalFilter, useList, } from "@refinedev/core";
import { List, Table, Tag } from "antd";
import { IExperimentParticipation, IInteraction } from "../../interfaces/index"
import { useTable } from "@refinedev/antd";
import { EXPERIMENT_PARTICIPATIONS, INTERACTION_COLLECTION } from "../../utility";
import { CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";

interface InteractionsProps {
  experimentId: string
}



export const Interactions: React.FC<InteractionsProps> = ({ experimentId }) => {
  const { data: participationsData } = useList<IExperimentParticipation>({ resource: EXPERIMENT_PARTICIPATIONS, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] })
  const participations = participationsData?.data ?? []
  const filters: LogicalFilter[] = participations.map((e) => { return { field: 'userId', operator: 'eq', value: e.userId } })

  const { tableProps } = useTable<IInteraction, HttpError>({
    liveMode: 'auto',
    resource: INTERACTION_COLLECTION, filters: {
      initial: [
        { key: 'parent', operator: 'or', value: filters }
      ]
    }, sorters: { initial: [{ field: '$createdAt', order: 'desc' }] }
  });

  const typeIcon = (value: string) => {
    switch (value) {
      case 'comment':
        return <CommentOutlined />;
      case 'share':
        return <ShareAltOutlined />
      case 'like':
        return <LikeOutlined />
    }
  }

  return (
    <List>
      <Table {...tableProps} size="small" rowKey="id">
        {/* <Table.Column dataIndex="id" title="ID" /> */}
        <Table.Column width="15%" dataIndex="userId" title="User ID" />
        <Table.Column width="15%" dataIndex="type" title="Type" render={(value) => <Tag icon={typeIcon(value)}>{value}</Tag>} />
        {/* <Table.Column width="15%" dataIndex="subType" title="Details" /> */}
        <Table.Column width="15%" dataIndex="stimuliId" title="Stimulus" />
        <Table.Column width="15%" dataIndex="action" title="Cue" render={(value) => value == null ? '' : <Tag color={value == 'confirm' ? 'success' : 'warning'}>{value}ed</Tag>} />
        <Table.Column width="25%" dataIndex="$createdAt" title="Date" render={(value) => new Date(value).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} />
      </Table>
    </List>
  );
}