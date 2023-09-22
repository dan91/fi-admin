import {
  useCreate,
  useNavigation,
} from "@refinedev/core";
import {
  Create,
  SaveButton,
  useFileUploadState,
  useStepsForm,
} from "@refinedev/antd";
import {
  Button,
  Steps,
  UploadFile,
} from "antd";

import { IExperiment, IIntervention, IPost, IStimulus } from "../../interfaces";
import { EXPERIMENT_COLLECTION, POST_COLLECTION } from "../../utility";

import { SetStateAction, useState } from "react";
import { PostList } from "../posts";
import { ExperimentForm } from "./experiment_form";
import { PostForm } from "./post_form";
import { InterventionForm } from "./intervention_form";
import { UploadChangeParam } from "antd/es/upload";
import { StimulusList } from "./stimulus_list";
import { GroupTrialForm } from "./group_trial_form";


export const ExperimentCreate: React.FC = () => {
  const {
    current,
    gotoStep,
    stepsProps,
    formProps,
    form,
    saveButtonProps,
    queryResult } = useStepsForm({ redirect: false });

  const initialPostValues: IPost = {
    author: '',
    description: '',
    image: "",
    likes: 0,
    shares: 0,
    comments: 0
  }

  const [postValues, setPostValues] = useState(initialPostValues);

  const initialExperimentValues: IExperiment = {
    name: 'FB Study 1',
    required_participants: 20,
    number_sessions: 5,
    session_duration: 20,
    proportion_manipulated: 30
  }

  const [experimentValues, setExperimentValues] = useState(initialExperimentValues);

  const initialInterventionValues: IIntervention = {
    name: '',
    message: ''
  }

  const [interventionValues, setInterventionValues] = useState(initialInterventionValues);

  const [addedExperimentId, setExperimentId] = useState({ experimentId: "" });

  const { mutate } = useCreate();

  const { list } = useNavigation();

  const { isLoading: uploadInProgress, onChange: changeUploadState } = useFileUploadState();


  const formList = [
    <ExperimentForm formProps={formProps} setValues={setExperimentValues} values={experimentValues} />
    ,
    <InterventionForm formProps={formProps} setValues={setInterventionValues} values={interventionValues} />,
    <StimulusList changeUploadState={changeUploadState} />,
    <GroupTrialForm />
    // <PostForm formProps={formProps} changeUploadState={changeUploadState} setValues={setPostValues} values={postValues} />,

  ];

  const handleReset = () => {
    form.resetFields();
    setPostValues({ ...initialPostValues, experiment_id: postValues.experiment_id })
  }

  return (
    <>
      <Create
        isLoading={queryResult?.isFetching}
        saveButtonProps={saveButtonProps}
        footerButtons={
          <>
            {current < formList.length - 1 && (
              <Button type="primary"  {...saveButtonProps} onClick={() => {
                mutate({
                  resource: EXPERIMENT_COLLECTION,
                  values: experimentValues
                },
                  {
                    onSuccess: (data) => {
                      setExperimentId({ 'experimentId': data?.data?.id as string })
                      setPostValues({ ...postValues, 'experiment_id': data?.data?.id as string })
                      gotoStep(current + 1);
                    }
                  })
              }} >Next</Button>
            )}
            {current === formList.length - 1 && (
              <Button
                style={{ float: 'right', marginTop: 20 }}
                type='primary'
                onClick={() => {
                  list(EXPERIMENT_COLLECTION)
                }}
              >
                Done
              </Button>
            )}
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
      </Create >


    </>
  );
};