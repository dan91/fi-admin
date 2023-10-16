import { IResourceComponentsProps, LogicalFilter, useExport, useGo, useList, useShow, useUpdate } from "@refinedev/core";
import { PageTitle } from "../../utility/pageTitle";
import { Show } from "@refinedev/antd";
import { Col, Typography, Progress, Row, Spin, Button, Result } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { EditOutlined, ExportOutlined, EyeOutlined, InfoCircleOutlined, PauseOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { ReactNode } from "react";
import { IExperiment, IExperimentParticipation, IGroup, IInteraction } from "../../interfaces/index"
import { EXPERIMENT_COLLECTION, EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION, INTERACTION_COLLECTION } from "../../utility";
import { Interactions } from "./interactions";
const { Text } = Typography

export const ExperimentShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IExperiment>();
  const { data, isLoading } = queryResult;
  const experiment: IExperiment = data?.data as IExperiment;

  const { mutate: mutateStatus } = useUpdate<IExperiment>();


  const setStatus = (status: string) => {
    mutateStatus({
      resource: EXPERIMENT_COLLECTION,
      values: { status: status },
      id: experiment?.id,
      successNotification: false
    })
  }

  const { data: participationsData } = useList<IExperimentParticipation>({ resource: EXPERIMENT_PARTICIPATIONS, filters: [{ field: 'experimentId', operator: 'eq', value: experiment?.id }] })

  const go = useGo()

  const { data: groupsData } = useList<IGroup>({ resource: GROUP_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experiment?.id }] })

  const participations = participationsData?.data ?? []
  const groups = groupsData?.data ?? []

  const filters: LogicalFilter[] = participations.map((e) => { return { field: 'userId', operator: 'eq', value: e.userId } })

  const { triggerExport } = useExport<IInteraction>({
    resource: INTERACTION_COLLECTION, filters: [{ key: 'parent', operator: 'or', value: filters }], mapData: (item) => {
      return {
        id: item.id,
        userId: item.userId,
        type: item.type,
        subType: item.subType,
        action: item.action,
        stimuliId: item.stimuliId,
        trialId: item.trialId,
        createdAt: item.$createdAt
      };
    },
  });
  const availableSpots = groups.length == 0 ? 0 : groups.map((g: IGroup) => g.numParticipants).reduce((a, b) => a + b)

  const selectButtonList = (status: ExperimentStatus): ReactNode[] => {
    switch (status) {
      case ExperimentStatus.published:
        return buttonListPublished
      case ExperimentStatus.paused:
        return buttonListPaused
      case ExperimentStatus.ready:
        return buttonListReady
      default: return []
    }
  }

  const buttonListPublished = [<Button onClick={() => setStatus(ExperimentStatus.paused)}><PauseOutlined />Pause</Button>]
  const buttonListPaused = [<Button onClick={() => setStatus(ExperimentStatus.published)}><PlayCircleOutlined />Resume</Button>, <Button onClick={() => setStatus(ExperimentStatus.completed)}><StopOutlined />Stop</Button>]
  const buttonListReady = [<Button onClick={() => setStatus(ExperimentStatus.published)}><EyeOutlined />Publish</Button>]

  const path = "/start-experiment/" + experiment?.id + "/"
  const demoParticipantId = 'demo'
  const linkParticipantId = '[PARTICIPANT_ID]'
  const linkToExperiment = window.location.protocol + "//" + window.location.host + path + linkParticipantId

  return isLoading ? <Spin /> :
    (
      <Show title={experiment.name} headerButtons={<><Text>created on {new Date(experiment.$createdAt).toLocaleDateString('en')}</Text>{selectButtonList(experiment.status)}</>}>
        {(experiment.status == ExperimentStatus.completed ||
          experiment.status == ExperimentStatus.published ||
          experiment.status == ExperimentStatus.paused) && <><PageTitle title="Progress" />
            <Row gutter={24}>
              <Col>
                <Progress size={[300, 20]} percent={Math.round((participations.length / availableSpots) * 100)} style={{ maxWidth: '400px' }} status={experiment.status == ExperimentStatus.published ? "active" : "normal"} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                <Paragraph>{participations.length}/{availableSpots} Participants completed the experiment.</Paragraph>
              </Col>
            </Row></>}

        {experiment.status == ExperimentStatus.published && <><PageTitle title="Link to Experiment" />
          <Title level={5} copyable code>{linkToExperiment}</Title>
          <Paragraph style={{ paddingTop: '12px' }}><InfoCircleOutlined /> Replace [PARTICIPANT_ID] with a unique identifier for each participant. <Button type="link" onClick={() => { go({ to: path + demoParticipantId }) }}>Open Demo</Button></Paragraph>
        </>}

        {(experiment.status != ExperimentStatus.draft && experiment.status != ExperimentStatus.ready) && <><PageTitle title="Interactions" buttonAction={triggerExport} buttonText="Export" buttonIcon={<ExportOutlined />} />
          <Interactions experimentId={experiment.id} /></>}

        {experiment.status == ExperimentStatus.ready && <Result
          status="404"
          title="Experiment not yet published..."
          subTitle="How do you want to proceed?"
          extra={<><Button type="primary" icon={<EditOutlined />} onClick={() => go({ to: { action: "edit", resource: EXPERIMENT_COLLECTION, id: experiment.id } })}>Edit</Button><Button icon={<EyeOutlined />} onClick={() => setStatus(ExperimentStatus.published)}>Publish</Button></>}
        />
        }
      </Show >
    )
};

export enum ExperimentStatus {
  'draft' = 'draft',
  'ready' = 'ready',
  'published' = 'published',
  'paused' = 'paused',
  'completed' = 'completed'
}