import {
  useGetIdentity,
  useNavigation,
  useUpdate,
} from "@refinedev/core";
import {
  Create,
  Edit,
  useForm,
  useStepsForm,
} from "@refinedev/antd";
import {
  Button,
  Spin,
  Steps,
} from "antd";

import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";
import { ReactNode, useEffect, useState } from "react";
import { ExperimentForm } from "./create/experiment-name/experiment_form";
import { InterventionForm } from "./create/interventions/intervention_form";
import { StimulusList } from "./create/stimuli/stimulus_list";
import { GroupTrialForm } from "./create/groups-trials/group_trial_form";
import { Permission, Role } from "@refinedev/appwrite";

interface ExperimentMasterProps {
  experimentToEdit?: IExperiment | null
}
export const ExperimentMaster: React.FC<ExperimentMasterProps> = ({ experimentToEdit }) => {

  const [experiment, setExperiment] = useState<IExperiment | null>(null);

  const {
    current,
    gotoStep,
    stepsProps,
  } = useStepsForm<IExperiment>({ redirect: false });
  const { mutate } = useUpdate<IExperiment>()

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
      setExperiment(mutationResult.data.data as IExperiment);
    }
  }, [experiment, mutationResult]);

  useEffect(() => {
    if (experimentToEdit)
      setExperiment(experimentToEdit)
  }, [experimentToEdit])


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

  const change = (current: number) => {
    if (experiment) {
      stepsProps.onChange(current)
    }
  }

  const handleNextClick = () => {
    if (current < formList.length - 1)
      return gotoStep(current + 1)
    else if (current == formList.length - 1) {
      mutate({
        resource: EXPERIMENT_COLLECTION,
        values: { status: 'ready' },
        id: experiment?.id ?? ''
      })
      return list(EXPERIMENT_COLLECTION)
    }
  }


  return (
    <>
      <CreateOrEdit
        type={experiment ? 'edit' : 'create'}
        experiment={experiment}
        footerButtons={
          <>
            {(current !== 0) &&
              <Button
                style={{ float: 'right' }}
                onClick={() => {
                  return gotoStep(current - 1)
                }} >Previous </Button>}
            {(current !== 0 || experiment) &&
              <Button
                style={{ float: 'right' }}
                type='primary'
                onClick={handleNextClick}
              >
                {current < formList.length - 1 ? 'Next' : 'Done'}
              </Button>
            }
          </>
        }
      >
        <Steps {...stepsProps} onChange={change} items={[
          {
            title: 'Experiment Name',
          },
          {
            title: 'Interventions',
          },
          {
            title: 'Stimuli',
          },
          {
            title: 'Groups & Trials',
          }
        ]} responsive />
        {experimentToEdit && !experiment ? <Spin /> : formList[current]}
      </CreateOrEdit>


    </>
  );
};

type CreateOrEditProps = { children: ReactNode; type: string, footerButtons: ReactNode, experiment?: IExperiment | null };


export const CreateOrEdit: React.FC<CreateOrEditProps> = ({ children, type, footerButtons, experiment }) => {
  return type == "edit" ? <Edit title={'Edit ' + experiment?.name ?? 'Experiment'} headerButtons={<></>} footerButtons={footerButtons} > {children}</Edit >
    : <Create footerButtons={footerButtons} > {children}</Create >
}