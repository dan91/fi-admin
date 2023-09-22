

import { Form, Input, InputNumber } from "antd"
import { FormProps } from "antd/lib"
interface GroupFormProps {
    formProps: FormProps

}
export const GroupForm: React.FC<GroupFormProps> = ({ formProps }) => {

    return <Form {...formProps} layout="vertical" >
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