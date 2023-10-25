import { Form, Input, InputNumber, Select } from "antd"
import { IIntervention, IStimuliSet } from "../../../../../interfaces"
import { FormProps } from "antd/lib"
import { useState } from "react"
interface TrialFormProps {
    formProps: FormProps
    interventions: IIntervention[]
    stimuliSets: IStimuliSet[]
    groupId: string,
    nextKey?: number
}

interface InterventionOption {
    value: string
    label: string
}
export const TrialForm: React.FC<TrialFormProps> = ({ formProps, interventions, groupId, nextKey, stimuliSets }) => {
    const [intervention, setIntervention] = useState(formProps.initialValues?.interventionId)

    const interventionOptions: InterventionOption[] = interventions.map((intervention: IIntervention) => {
        return { value: intervention.id, label: intervention.name }
    })
    interventionOptions.unshift({ value: 'none', label: 'None / Passive Control' })

    if (intervention == 'none') {
        formProps.form?.setFieldValue('stimuliSetId', '');
        formProps.form?.setFieldValue('proportionStimuli', null);
    }

    console.log('next key is', nextKey?.toString())

    return <Form {...formProps} layout="vertical">
        <Form.Item name="groupId" initialValue={groupId} hidden>
            <Input type="hidden" />
        </Form.Item>
        {nextKey &&
            <Form.Item name="key" initialValue={nextKey.toString()} hidden>
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
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Select onChange={setIntervention}
                options={interventionOptions} />
        </Form.Item>
        <Form.Item
            label="Stimuli Set"
            name="stimuliSetId"
        >
            <Select
                disabled={intervention == 'none'}
                options={stimuliSets.map((stimuliSet: IStimuliSet) => {
                    return { value: stimuliSet.id, label: stimuliSet.name }
                })} />
        </Form.Item>
        <Form.Item
            label="Proportion Stimuli"
            name="proportionStimuli"
            rules={[
                {
                    type: 'number',
                    max: 100,
                    min: 0,
                    required: intervention != 'none'
                },
            ]}
        >
            <InputNumber disabled={intervention == 'none'}
                suffix='%' />
        </Form.Item>
    </Form>
}
