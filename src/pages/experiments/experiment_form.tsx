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
                </Row>
            </Col>
        </Row>
    </Form>
}