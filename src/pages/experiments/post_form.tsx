import { Avatar, Button, Col, Form, FormInstance, FormProps, Input, InputNumber, Row, Space, Typography, Upload, UploadFile } from "antd"
import { Dispatch, SetStateAction } from "react";
import { IPost } from "../../interfaces";
import { getValueFromEvent } from "@refinedev/antd";
import { APPWRITE_URL, storage } from "../../utility";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { useTranslate } from "@refinedev/core"
import { CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
export interface PostFormProps {
    formProps: FormProps;
    changeUploadState: (info: UploadChangeParam<UploadFile<any>>) => void;
    setValues: Dispatch<SetStateAction<IPost>>;
    values: IPost;
}
const { Text } = Typography;

export const PostForm: React.FC<PostFormProps> = ({ formProps, changeUploadState, setValues, values }) => {
    const t = useTranslate();
    console.log('rerender post form with', values)

    return <Form {...formProps}
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
                    <Input value={values.description} />
                </Form.Item>
            </Col>
            <Col xs={24} lg={12}>

                <Form.Item label={'Bild'}>
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
                            accept=".png,.jpg"
                            onChange={changeUploadState}
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
                                    setValues({
                                        ...values,
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
                    <InputNumber addonAfter={<LikeOutlined />} value={values.likes}
                        onChange={(value) =>
                            setValues({ ...values, 'likes': value as number })
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
                    <InputNumber value={values.comments} onChange={(value) =>
                        setValues({ ...values, 'comments': value as number })
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
                    <InputNumber value={values.shares} onChange={(value) =>
                        setValues({ ...values, 'shares': value as number })
                    } addonAfter={<ShareAltOutlined />} />
                </Form.Item>
            </Col>
        </Row>
    </Form>
}