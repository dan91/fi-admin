import { PauseOutlined } from "@ant-design/icons";
import { IResourceComponentsProps } from "@refinedev/core";
import { Card, Progress, Row, Col, List, Tag, Button } from "antd";
import { Box } from "@ant-design/charts";

export const Dashboard: React.FC<IResourceComponentsProps> = () => {
  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={16}>
          <h1>Aktuelles Experiment: Twitter Misinformation Part X <Tag color="green">aktiv</Tag> <Button icon={<PauseOutlined />} >
            Pausieren
          </Button></h1>
        </Col>
        <Col flex={'auto'}>


        </Col>
        <Col xs={24} md={12}>

        </Col>
      </Row>


      <Row gutter={[12, 12]}>
        <Col xs={24} md={12} lg={6}>
          <Card title="Fortschritt">
            <Progress percent={75} />
            150/200 Teilnehmende

          </Card>
        </Col>
        <Col xs={24} md={12} lg={12} xl={6}>
          <Card title="Erfolgsquote">
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12} lg={12}>
                <Progress percent={96} type="dashboard" />
              </Col>
              <Col xs={24} md={12} lg={12}>
                <h3>Gründe für Abbruch:</h3>
                <List
                  dataSource={dataSource}
                  renderItem={(item) => (
                    <List.Item>
                      {item.name} (2%)
                    </List.Item>
                  )}
                />
              </Col>
            </Row>

          </Card>
        </Col>
        <Col xs={24} md={12} lg={12} xl={6}>
          <Card title="Dauer">
            {/* <DemoBox /> */}
          </Card>
        </Col>
      </Row>
    </>
  );
};

const dataSource = [
  {
    key: '1',
    name: 'App nicht geladen',
    frequency: 32,
  },
  {
    key: '2',
    name: 'App geladen, aber Einladungscode nicht eingegeben',
    frequency: 42,
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Häufigkeit',
    dataIndex: 'frequency',
    key: 'frequency',
  },

];



const DemoBox = () => {
  const data = [
    {
      x: 'Gesamt',
      low: 1,
      q1: 9,
      median: 16,
      q3: 22,
      high: 24,
    },
    {
      x: 'Abgeschlossen',
      low: 1,
      q1: 5,
      median: 8,
      q3: 12,
      high: 16,
    },
    {
      x: 'Abgebrochen',
      low: 1,
      q1: 8,
      median: 12,
      q3: 19,
      high: 26,
    },

  ];
  const config = {
    width: 400,
    height: 500,
    data: data,
    xField: 'x',
    yField: ['low', 'q1', 'median', 'q3', 'high'],
    boxStyle: {
      stroke: '#545454',
      fill: '#1890FF',
      fillOpacity: 0.3,
    },
    animation: false,
  };
  // return <Box {...config} />
};