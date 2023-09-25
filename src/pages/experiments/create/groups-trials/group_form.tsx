

import { Form, Input, InputNumber } from "antd"
import { FormProps } from "antd/lib"
interface GroupFormProps {
    formProps: FormProps
    experimentId?: string
}
export const GroupForm: React.FC<GroupFormProps> = ({ formProps, experimentId }) => {

    return <Form {...formProps} layout="vertical" >
        <Form.Item name="experimentId" initialValue={experimentId} hidden><Input /></Form.Item>
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
        <Form.Item
            label="Participants"
            name="numParticipants"
            rules={[
                {
                    required: true,
                    type: 'number',
                    max: 9999
                },
            ]}
        >
            <InputNumber />
        </Form.Item>
    </Form>
}