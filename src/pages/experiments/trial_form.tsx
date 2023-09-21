import { Form, Input, InputNumber, Select } from "antd"
import { IIntervention } from "../../interfaces"
import { FormProps } from "antd/lib"
interface TrialFormProps {
    formProps: FormProps
    interventions: IIntervention[]
    groupId: string,
    nextKey?: string
}
export const TrialForm: React.FC<TrialFormProps> = ({ formProps, interventions, groupId, nextKey }) => {

    return <Form {...formProps} layout="vertical">
        <Form.Item name="groupId" initialValue={groupId} hidden>
            <Input type="hidden" />
        </Form.Item>
        {nextKey &&
            <Form.Item name="key" initialValue={nextKey} hidden>
                <Input type="hidden" />
            </Form.Item>}
        <Form.Item
            label="Duration"
            name="duration"
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
        <Form.Item
            label="Intervention"
            name="interventionId"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Select
                options={interventions.map((intervention: IIntervention) => {
                    return { value: intervention.id, label: intervention.name }
                })} />
        </Form.Item>
        <Form.Item
            label="Proportion Stimuli"
            name="proportionStimuli"
            rules={[
                {
                    required: true,
                    type: 'number',
                    max: 100,
                    min: 0
                },
            ]}
        >
            <InputNumber />
        </Form.Item>
    </Form>
}