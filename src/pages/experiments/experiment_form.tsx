import { Col, Form, FormProps, Input, Row, Select } from "antd"
import { Dispatch, SetStateAction } from "react";
import { IExperiment } from "../../interfaces";
import { SaveButton, SaveButtonProps } from "@refinedev/antd";

export interface ExperimentFormProps {
    formProps: FormProps;
    saveButtonProps: SaveButtonProps,
    onFinish: (values: IExperiment) => Promise<void>
    goToNext: () => void
    type: string
}

export const ExperimentForm: React.FC<ExperimentFormProps> = ({ goToNext, type, formProps, saveButtonProps, onFinish }) => {
    const test = (experiment: IExperiment) => {
        onFinish(experiment).then(() => {
            if (type == 'create') {
                goToNext()
            }
        })
    }

    return (
        <Form
            {...formProps}
            style={{ marginTop: 30 }}
            layout="vertical"
            onFinish={test}
        >
            <Row gutter={20}>

                <Col xs={24} lg={16}>
                    <Row gutter={10}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <SaveButton {...saveButtonProps} icon={false}>{type == 'edit' ? 'Save' : 'Next'}</SaveButton>
        </Form>
    )
}