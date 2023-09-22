import { HttpError, IResourceComponentsProps, useForm, useOne } from "@refinedev/core";
import { ExperimentMaster } from "./create";
import { IExperiment } from "../../interfaces";
import { EXPERIMENT_COLLECTION } from "../../utility";

export const ExperimentEdit: React.FC<IResourceComponentsProps> = () => {

  const { queryResult } = useForm<IExperiment, HttpError>();

  const experiment = queryResult?.data?.data

  // console.log(experiment)
  return (
    <ExperimentMaster experimentToEdit={experiment} />
  );
};
