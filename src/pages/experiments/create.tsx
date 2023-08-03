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
} from "antd";

import { IExperiment, IPost } from "../../interfaces";
import { EXPERIMENT_COLLECTION, POST_COLLECTION } from "../../utility";

import { useState } from "react";
import { PostList } from "../posts";
import { ExperimentForm } from "./experiment_form";
import { PostForm } from "./post_form";


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

  const [addedExperimentId, setExperimentId] = useState({ experimentId: "" });

  const { mutate } = useCreate();

  const { list } = useNavigation();

  const { isLoading: uploadInProgress, onChange: changeUploadState } = useFileUploadState();


  const formList = [
    <ExperimentForm formProps={formProps} setValues={setExperimentValues} values={experimentValues} />
    ,
    <PostForm formProps={formProps} changeUploadState={changeUploadState} setValues={setPostValues} values={postValues} />
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
              <SaveButton {...saveButtonProps} onClick={() => {
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
              }} />
            )}

            {current === formList.length - 1 && (
              <Button disabled={uploadInProgress} onClick={() => {
                mutate({
                  resource: POST_COLLECTION,
                  values: postValues
                },
                  {
                    onSuccess: () => handleReset()
                  }
                )
              }
              }
              >
                Add Post
              </Button>
            )}
          </>
        }
      >
        <Steps {...stepsProps} responsive >
          <Steps.Step title={'Experiment'} />
          <Steps.Step title={'Posts'} />
        </Steps>
        {formList[current]}
      </Create >
      {current === 1 &&
        <PostList experimentId={addedExperimentId.experimentId} />
      }
      {current > 0 && (
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
  );
};
