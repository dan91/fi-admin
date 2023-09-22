import { Col, Form, Input, Row, Upload } from "antd"
import { IStimulus } from "../../interfaces"
import { FormProps } from "antd/lib"
import { STIMULUS_IMAGE_BUCKET, USER_IMAGE_BUCKET, normalizeFile, storage } from "../../utility"
import { RcFile } from "antd/es/upload"
interface StimulusFormProps {
    formProps: FormProps
    onFinish: (values: IStimulus) => void,
    experimentId?: string
    close: () => void,
}
export const StimulusForm: React.FC<StimulusFormProps> = ({ formProps, experimentId }) => {

    return <Form {...formProps} layout="vertical" onFinish={(stimulus: IStimulus) => {
        formProps.onFinish?.({
            ...stimulus,
            userImage: JSON.stringify(stimulus.userImage),
            stimulusImage: JSON.stringify(stimulus.stimulusImage),
        });
    }}>
        <Form.Item name="experimentId" initialValue={experimentId} hidden>
            <Input type="hidden" />
        </Form.Item>
        <Form.Item
            label="User Name"
            name="userName"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item label="User Image">
            <Form.Item
                name="userImage"
                valuePropName="fileList"
                normalize={normalizeFile}

                noStyle
            >
                <Upload.Dragger
                    name="file"
                    listType="picture"
                    multiple
                    customRequest={async ({
                        file,
                        onError,
                        onSuccess,
                    }) => {
                        try {
                            const rcFile = file as RcFile;

                            const { $id } = await storage.createFile(
                                USER_IMAGE_BUCKET,
                                rcFile.uid,
                                rcFile,
                            );

                            const url = storage.getFileView(
                                USER_IMAGE_BUCKET,
                                $id,
                            );

                            onSuccess?.({ url }, new XMLHttpRequest());

                        } catch (error) {
                            onError?.(new Error("Upload Error"));
                        }
                    }}
                >
                    <p className="ant-upload-text">
                        Drag &amp; drop a file in this area
                    </p>
                </Upload.Dragger>
            </Form.Item>
        </Form.Item>
        <Form.Item
            label="Stimulus Text"
            name="stimulusText"

        >
            <Input />
        </Form.Item>

        <Form.Item label="Stimulus Image">
            <Form.Item
                name="stimulusImage"
                valuePropName="fileList"
                normalize={normalizeFile}

                noStyle
            >
                <Upload.Dragger
                    name="file"
                    listType="picture"
                    multiple
                    customRequest={async ({
                        file,
                        onError,
                        onSuccess,
                    }) => {
                        try {
                            const rcFile = file as RcFile;

                            const { $id } = await storage.createFile(
                                STIMULUS_IMAGE_BUCKET,
                                rcFile.uid,
                                rcFile,
                            );

                            const url = storage.getFileView(
                                STIMULUS_IMAGE_BUCKET,
                                $id,
                            );

                            onSuccess?.({ url }, new XMLHttpRequest());

                        } catch (error) {
                            onError?.(new Error("Upload Error"));
                        }
                    }}
                >
                    <p className="ant-upload-text">
                        Drag &amp; drop a file in this area
                    </p>
                </Upload.Dragger>
            </Form.Item>
        </Form.Item>
        <Row gutter={[10, 10]}>
            <Col md={8}>
                <Form.Item
                    label="Likes"
                    name="likes"

                >
                    <Input />
                </Form.Item>
            </Col>
            <Col md={8}>
                <Form.Item
                    label="Comments"
                    name="comments"

                >
                    <Input />
                </Form.Item>
            </Col>
            <Col md={8}>
                <Form.Item
                    label="Shares"
                    name="shares"

                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
    </Form >
}