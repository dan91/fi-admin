import {
  IResourceComponentsProps,
  useTranslate,
  HttpError,
  useCreate,
  useNavigation,
} from "@refinedev/core";
import {
  Create,
  SaveButton,
  getValueFromEvent,
  useStepsForm,
} from "@refinedev/antd";
import {
  Form,
  Select,
  Upload,
  Input,
  Button,
  Steps,
  Typography,
  Space,
  Avatar,
  Row,
  Col,
  InputNumber,
} from "antd";

import { IExperiment, IPost } from "../../interfaces";
import { APPWRITE_URL, storage } from "../../utility";
import { CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import { useState } from "react";
import { PostList } from "../posts";

const { Text } = Typography;



export const ExperimentCreate: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const {
    current,
    gotoStep,
    stepsProps,
    formProps,
    saveButtonProps,
    queryResult,
    submit
  } = useStepsForm<IExperiment, HttpError, IExperiment>({ redirect: false });

  const [formValues, setFormValues] = useState({
    image: "",
    experiment_id: "",
    likes: 0,
    shares: 0,
    comments: 0
  });

  const initialExperimentValues = {
    name: 'test',
    required_participants: 20,
    number_sessions: 5,
    session_duration: 20,
    proportion_manipulated: 30
  }

  const [experimentValues, setExperimentValues] = useState(initialExperimentValues);

  const [addedExperimentId, setExperimentId] = useState({ experimentId: "" });

  const [addedPostId, setPostId] = useState({ postId: "" });

  const { mutate, isLoading } = useCreate();


  const { list } = useNavigation();


  const formList = [
    <>
      <Form
        {...formProps}
        style={{ marginTop: 30 }}
        layout="vertical"
        initialValues={initialExperimentValues}
      >
        <Row gutter={20}>

          <Col xs={24} lg={16}>
            <Row gutter={10}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={t("couriers.fields.name")}
                  name="name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input onChange={(e) => setExperimentValues({
                    ...experimentValues, 'name': e.target.value
                  })} />
                </Form.Item>

              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={'Anzahl Teilnehmer'}
                  name="required_participants"
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      min: 1,
                      max: 10000
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={10}>

              <Col xs={24} lg={6}>
                <Form.Item
                  label={'Anzahl Sessions'}
                  name="number_sessions"
                  rules={[
                    {
                      required: true,
                      type: 'number'
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        label: '1',
                        value: 1,
                      },
                      {
                        label: '2',
                        value: 2,
                      },
                      {
                        label: '2',
                        value: 3,
                      },
                      {
                        label: '4',
                        value: 4,
                      },
                      {
                        label: '5',
                        value: 5,
                      },
                      {
                        label: '6',
                        value: 6,
                      },

                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={'Dauer pro Session'}
                  name="session_duration"
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      min: 1,
                      max: 500
                    },
                  ]}
                >
                  <InputNumber addonAfter={'Minuten'} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={'URL nach Session'}
                  name="website_redirect_after_session"
                  rules={[
                    {
                      type: 'url'
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={'URL nach Experiment'}
                  name="website_redirect_after_experiment"
                  rules={[
                    {
                      type: 'url',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} lg={10}>
                <Form.Item
                  label={'Anteil manipulierte Posts'}
                  name="proportion_manipulated"
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      min: 0,
                      max: 100
                    },
                  ]}
                >
                  <InputNumber value={'50'} addonAfter={'%'} />
                </Form.Item>
              </Col>

            </Row>

          </Col>
        </Row>
      </Form>
    </>,
    <><Form
      style={{ marginTop: 30 }}
      layout="vertical"

    >
      <Row key="posts" gutter={20}>
        <Col xs={24} lg={12}>

          <Form.Item
            label="Beschreibung"
            name="description"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>

          <Form.Item label={t("products.fields.images.label")}>
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              noStyle
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                action={`${APPWRITE_URL}/media/upload`}
                listType="picture"
                maxCount={1}
                accept=".png"

                customRequest={async ({
                  file,
                  onError,
                  onSuccess,
                }) => {
                  try {

                    const rcFile = file as RcFile;
                    const { $id } = await storage.createFile(
                      "64c1272a658c2465fffc",
                      rcFile.uid,
                      rcFile,
                    );

                    const url = storage.getFileView(
                      "64c1272a658c2465fffc",
                      $id,
                    );

                    onSuccess?.({ url }, new XMLHttpRequest());
                    setFormValues({
                      ...formValues,
                      'image': $id,
                    })

                  } catch (error) {
                    onError?.(new Error("Upload Error"));
                  }
                }}
              >
                <Space direction="vertical" size={2}>
                  <Avatar
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "256px",
                    }}
                    src="/images/product-default-img.png"
                    alt="Store Location"
                  />
                  <Text
                    style={{
                      fontWeight: 800,
                      fontSize: "16px",
                      marginTop: "8px",
                    }}
                  >
                    {t(
                      "products.fields.images.description",
                    )}
                  </Text>
                  <Text style={{ fontSize: "12px" }}>
                    {t("products.fields.images.validation")}
                  </Text>
                </Space>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col xs={24} lg={4}>
          <Form.Item
            label="Likes"
            name="likes"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonAfter={<LikeOutlined />} onChange={(e) =>
              setFormValues({ ...formValues, 'likes': e })
            } />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            label="Kommentare"
            name="comments"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber onChange={(e) =>
              setFormValues({ ...formValues, 'comments': e })
            } addonAfter={<CommentOutlined />} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item
            label="Geteilt"
            name="shared"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber onChange={(e) =>
              setFormValues({ ...formValues, 'shares': e })
            } addonAfter={<ShareAltOutlined />} />
          </Form.Item>
        </Col>
      </Row>
    </Form>

    </>
  ];

  return (
    <>
      <Create

        isLoading={queryResult?.isFetching}
        saveButtonProps={saveButtonProps}
        footerButtons={
          <>

            {current < formList.length - 1 && (
              <SaveButton {...saveButtonProps} onClick={() => {
                mutate({
                  resource: "64b82f7b348727a801cb",
                  values: {
                    name: experimentValues.name
                  }
                },
                  {
                    onSuccess: (data) => {
                      console.log('created experiment with ID', data?.data?.id)
                      setExperimentId({ 'experimentId': data?.data?.id })
                      setFormValues({ ...formValues, 'experiment_id': data?.data?.id })
                      gotoStep(current + 1);
                    }
                  })
              }} />
            )}

            {current === formList.length - 1 && (
              <Button onClick={() => {
                mutate({
                  resource: "64bfc5ca89fc8d8fbfa1",
                  values: {
                    image: formValues.image,
                    experiment_id: formValues.experiment_id,
                    likes: formValues.likes,
                    comments: formValues.comments,
                    shares: formValues.shares
                  }
                },
                  {
                    onSuccess: (data) => {
                      console.log('new post', data?.data?.id)
                      setPostId({ 'postId': data?.data?.id })
                    }
                  }
                )
              }
              }
              >
                Add Post
              </Button>
            )}
          </>
        }
      >
        <Steps {...stepsProps} responsive >
          <Steps.Step title={'Experiment'} />
          <Steps.Step title={'Posts'} />
        </Steps>


        {formList[current]}

      </Create >
      {current === 1 &&
        <PostList experimentId={addedExperimentId.experimentId} lastAddedPost={addedPostId.postId} />
      }
      {current > 0 && (
        <Button
          style={{ float: 'right', marginTop: 20 }}
          type='primary'
          onClick={() => {
            list("64b82f7b348727a801cb")
          }}
        >
          Done
        </Button>
      )}


    </>
  );
};
