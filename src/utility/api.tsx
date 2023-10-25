import { LogicalFilter, useList } from "@refinedev/core";
import { IGroup, ITrial } from "../interfaces";
import { GROUP_COLLECTION, TRIAL_COLLECTION } from "./appwriteClient";

export const useGetTrialsByExperimentId = (experimentId: string): ITrial[] => {
    const { data: groupsData } = useList<IGroup>({ resource: GROUP_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] });
    const groups = groupsData?.data ?? []

    const filters: LogicalFilter[] = groups.map((g) => { return { field: 'groupId', operator: 'eq', value: g.id } })

    const { data: trialsData } = useList<ITrial>({
        resource: TRIAL_COLLECTION, pagination: { pageSize: 20000 }, filters: filters
    });

    const trials = trialsData?.data
    return trials ?? [];
}