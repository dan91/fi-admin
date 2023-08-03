import { Col, Form, FormProps, Input, InputNumber, Row, Select } from "antd"
import { Dispatch, SetStateAction } from "react";
import { IExperiment } from "../../interfaces";

export interface ExperimentFormProps {
    formProps: FormProps;
    setValues: Dispatch<SetStateAction<IExperiment>>;
    values: IExperiment;
}

export const ExperimentForm: React.FC<ExperimentFormProps> = ({ formProps, setValues, values }) => {
    return <Form
        {...formProps}
        style={{ marginTop: 30 }}
        layout="vertical"
        initialValues={values}
    >
        <Row gutter={20}>

            <Col xs={24} lg={16}>
                <Row gutter={10}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            label={'Titel'}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input onChange={(e) => setValues({
                                ...values, 'name': e.target.value
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
                            <InputNumber addonAfter={'%'} />
                        </Form.Item>
                    </Col>

                </Row>

            </Col>
        </Row>
    </Form>
}