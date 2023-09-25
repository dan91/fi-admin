import { IResourceComponentsProps, useExport, useShow, useUpdate } from "@refinedev/core";
import { PageTitle } from "../../utility/pageTitle";
import { ExportButton, Show } from "@refinedev/antd";
import { Col, Typography, Progress, Row, Spin, Button } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { CheckOutlined, EyeOutlined, InfoCircleOutlined, PauseOutlined, PlayCircleOutlined, PlaySquareOutlined, StopOutlined, UpSquareOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { Checkbox } from "antd/lib";
import { ReactNode } from "react";
import { IExperiment } from "../../interfaces/index"
import { EXPERIMENT_COLLECTION } from "../../utility";
const { Text } = Typography

export const ExperimentShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IExperiment>();
  const { data, isLoading } = queryResult;
  const experiment: IExperiment = data?.data as IExperiment;
  const { triggerExport } = useExport<IExperiment>();

  const { mutate } = useUpdate<IExperiment>()

  const updateExperimentStatus = (newStatus: string) => {
    mutate({ resource: EXPERIMENT_COLLECTION, values: { status: newStatus }, id: experiment.id })
  }

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
                <Progress size={[300, 20]} percent={75} style={{ maxWidth: '400px' }} status={experiment.status == ExperimentStatus.published ? "active" : "normal"} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                <Paragraph>150/200 Participants completed the experiment.</Paragraph>
              </Col>
              <Col>
                <Title level={5}>3%</Title>
                <Paragraph>Drop-outs</Paragraph>
              </Col>
            </Row></>}


        {experiment.status == ExperimentStatus.published && <><PageTitle title="Link to Experiment" />
          <Title level={5} copyable code>feedinsights.com/start-experiment/{experiment.id}/[PARTICIPANT_ID]</Title>
          <Paragraph style={{ paddingTop: '12px' }}><InfoCircleOutlined /> Replace [PARTICIPANT_ID] with a unique identifier for each participant.</Paragraph>
        </>}

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