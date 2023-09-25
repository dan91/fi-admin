import { Checkbox, Form, Input, InputNumber, Select, Space, Switch } from "antd"
import { IIntervention, IStimuliSet, ITrial } from "../../../../../interfaces"
import { FormProps } from "antd/lib"
import { useState } from "react"
interface TrialFormProps {
    formProps: FormProps
    interventions: IIntervention[]
    stimuliSets: IStimuliSet[]
    groupId: string,
    nextKey?: string
}
export const TrialForm: React.FC<TrialFormProps> = ({ formProps, interventions, groupId, nextKey, stimuliSets }) => {

    const [intervention, setIntervention] = useState(formProps.initialValues?.interventionId)

    const interventionOptions = interventions.map((intervention: IIntervention) => {
        return { value: intervention.id, label: intervention.name }
    })
    interventionOptions.unshift({ value: '', label: 'Control' })


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
            <InputNumber suffix='min' />
        </Form.Item>
        <Form.Item
            label="Intervention"
            name="interventionId"
        >
            <Select onChange={setIntervention}
                options={interventionOptions} />
        </Form.Item>
        <Form.Item
            label="Stimuli Set"
            name="stimuliSetId"
        >
            <Select
                disabled={intervention == ''}
                options={stimuliSets.map((stimuliSet: IStimuliSet) => {
                    return { value: stimuliSet.id, label: stimuliSet.name }
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
            <InputNumber suffix='%' />
        </Form.Item>
    </Form>
}
