import {
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Create,
  Edit,
  SaveButton,
  useForm,
  useStepsForm,
} from "@refinedev/antd";
import {
  Button,
  Steps,
} from "antd";

import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";

import { ReactNode, useEffect, useState } from "react";
import { ExperimentForm } from "./experiment_form";
import { InterventionForm } from "./intervention_form";
import { StimulusList } from "./stimulus_list";
import { GroupTrialForm } from "./group_trial_form";
import { Permission, Role } from "@refinedev/appwrite";

interface ExperimentMasterProps {
  experimentToEdit?: IExperiment | null
}
export const ExperimentMaster: React.FC<ExperimentMasterProps> = ({ experimentToEdit }) => {

  const [experiment, setExperiment] = useState<IExperiment | null>(null);

  console.log('experiment is currently ', experiment)

  const {
    current,
    gotoStep,
    stepsProps,
  } = useStepsForm<IExperiment>({ redirect: false });

  const { data: identity } = useGetIdentity<{
    $id: string;
  }>();

  const { formProps, saveButtonProps, mutationResult, onFinish } = useForm<IExperiment>({
    action: "create", redirect: false,
    meta: {
      writePermissions: identity ? [Permission.write(Role.user(identity?.$id ?? ''))] : [],
      readPermissions: identity ? [Permission.read(Role.user(identity?.$id ?? ''))] : []
    },
    successNotification: () => { return { message: 'Experiment draft created', type: "success" } },
  })
  const { formProps: editFormProps, saveButtonProps: editSaveButtonProps, onFinish: onFinishEdit } =
    useForm<IExperiment>({ action: "edit", redirect: false, id: experiment?.id })

  useEffect(() => {
    if (mutationResult?.data?.data) {
      console.log('just created experiment???')
      setExperiment(mutationResult.data.data as IExperiment);
    }
  }, [experiment, mutationResult]);

  useEffect(() => {
    if (experimentToEdit)
      setExperiment(experimentToEdit)
  })


  const { list } = useNavigation();

  const formList = [
    <ExperimentForm goToNext={() => gotoStep(1)} onFinish={experiment ? onFinishEdit : onFinish} type={experiment ? 'edit' : 'create'} formProps={experiment ? editFormProps : formProps} saveButtonProps={experiment ? editSaveButtonProps : saveButtonProps} />,
  ];
  if (experiment) {
    formList.push(
      <InterventionForm experimentId={experiment.id} />,
      <StimulusList experimentId={experiment.id} />,
      <GroupTrialForm experimentId={experiment?.id} />)
  }



  return (
    <>
      <CreateOrEdit
        type={experiment ? 'edit' : 'create'}
        footerButtons={
          <>
            {(current !== 0 || experiment) &&
              <Button
                style={{ float: 'right' }}
                type='primary'
                onClick={() => {
                  if (current < formList.length - 1)
                    return gotoStep(current + 1)
                  else if (current == formList.length - 1)
                    return list(EXPERIMENT_COLLECTION)
                }}
              >
                {current < formList.length - 1 ? 'Next' : 'Done'}
              </Button>
            }
          </>
        }
      >
        <Steps {...stepsProps} responsive >
          <Steps.Step title={'Experiment Name'} />
          <Steps.Step title={'Interventions'} />
          <Steps.Step title={'Stimuli'} />
          <Steps.Step title={'Groups & Trials'} />
        </Steps>
        {formList[current]}
      </CreateOrEdit>


    </>
  );
};

type CreateOrEditProps = { children: ReactNode; type: string, footerButtons: ReactNode };


export const CreateOrEdit: React.FC<CreateOrEditProps> = ({ children, type, footerButtons }) => {
  console.log(type)
  return type == "edit" ? <Edit headerButtons={<></>} footerButtons={footerButtons} > {children}</Edit >
    : <Create footerButtons={footerButtons} > {children}</Create >
}

