import { IResourceComponentsProps, LogicalFilter, useExport, useList, useShow, useUpdate } from "@refinedev/core";
import { PageTitle } from "../../utility/pageTitle";
import { ExportButton, Show } from "@refinedev/antd";
import { Col, Typography, Progress, Row, Spin, Button } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { ExportOutlined, EyeOutlined, InfoCircleOutlined, PauseOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { Checkbox } from "antd/lib";
import { ReactNode } from "react";
import { IExperiment, IExperimentParticipation, IGroup, IInteraction, ITrial } from "../../interfaces/index"
import { EXPERIMENT_COLLECTION, EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION, INTERACTION_COLLECTION, TRIAL_COLLECTION } from "../../utility";
import { Interactions } from "./interactions";
const { Text } = Typography

export const ExperimentShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IExperiment>();
  const { data, isLoading } = queryResult;
  const experiment: IExperiment = data?.data as IExperiment;



  const { mutate } = useUpdate<IExperiment>()

  const updateExperimentStatus = (newStatus: string) => {
    mutate({ resource: EXPERIMENT_COLLECTION, values: { status: newStatus }, id: experiment.id })
  }

  const { data: participationsData } = useList<IExperimentParticipation>({ resource: EXPERIMENT_PARTICIPATIONS, filters: [{ field: 'experimentId', operator: 'eq', value: experiment?.id }] })



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

  const buttonListPublished = [<Button onClick={() => updateExperimentStatus(ExperimentStatus.paused)}><PauseOutlined /> Pause</Button>]
  const buttonListPaused = [<Button onClick={() => updateExperimentStatus(ExperimentStatus.published)}><PlayCircleOutlined /> Resume</Button>, <Button onClick={() => updateExperimentStatus(ExperimentStatus.completed)}><StopOutlined /> Stop</Button>]
  const buttonListReady = [<Button onClick={() => updateExperimentStatus(ExperimentStatus.published)}><EyeOutlined /> Publish</Button>]

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
              {/* <Col>
                <Title level={5}>3%</Title>
                <Paragraph>Drop-outs</Paragraph>
              </Col> */}
            </Row></>}

        {experiment.status == ExperimentStatus.published && <><PageTitle title="Link to Experiment" />
          <Title level={5} copyable code>feedinsights.com/start-experiment/{experiment.id}/[PARTICIPANT_ID]</Title>
          <Paragraph style={{ paddingTop: '12px' }}><InfoCircleOutlined /> Replace [PARTICIPANT_ID] with a unique identifier for each participant.</Paragraph>
        </>}

        {/* {experiment.status != ExperimentStatus.draft && <><PageTitle title="Participants" />
          <ExperimentParticipations experimentId={experiment.id} /></>} */}

        {experiment.status != ExperimentStatus.draft && <><PageTitle title="Interactions" buttonAction={triggerExport} buttonText="Export" buttonIcon={<ExportOutlined />} />
          <Interactions experimentId={experiment.id} /></>}

        {(experiment.status == ExperimentStatus.completed ||
          experiment.status == ExperimentStatus.published ||
          experiment.status == ExperimentStatus.paused) && <><PageTitle title="Export" />
            Download the collected data as a .CSV file.
            <PageTitle titleLevel={5} title="Interactions" otherButtons={<ExportButton onClick={triggerExport} style={{ float: "right" }} />} />
            <Paragraph>Each row is an interaction. Interactions are likes, comments and shares.</Paragraph>
            <Checkbox.Group defaultValue={['stimuli']} options={interactionOptions} />

            <PageTitle titleLevel={5} title="Trials" otherButtons={<ExportButton onClick={triggerExport} style={{ float: "right" }} />} />
            <Paragraph>Each row is a completed trial.</Paragraph>
            {/* <Checkbox.Group options={trialOptions} /> */}</>}
      </Show >
    )
};

const interactionOptions = [
  { label: 'Interactions with stimuli', value: 'stimuli' },
  { label: 'Interactions with other content', value: 'Interactions other' },
  { label: 'Trial Completion Time', value: 'Trial Completion Time' },

];
const trialOptions = [
  { label: 'Trial Completion Time', value: 'Trial Completion Time' },
  { label: 'Stimulus View Times', value: 'Stimulus View Times' },
  { label: 'Device and Software', value: 'Device and Software' },
];



export enum ExperimentStatus {
  'draft' = 'draft',
  'ready' = 'ready',
  'published' = 'published',
  'paused' = 'paused',
  'completed' = 'completed'
}