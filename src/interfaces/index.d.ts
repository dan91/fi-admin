export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
}


export interface IExperiment {
    id: string;
    $createdAt: Date
    name: string;
    status: ExperimentStatus;
}

export interface IPost {
    id?: string;
    image: string;
    experiment_id?: string,
    likes: number;
    shares: number;
    comments: number;
    author: string;
    description: string
}

export interface IIntervention {
    id: string,
    name: string,
    message: string,
    apply_on_likes?: boolean,
    apply_on_comments?: boolean,
    apply_on_shares?: boolean,
}

export interface IStimulus {
    id: string,
    userName: string,
    userImage: string,
    stimulusText: string,
    likes: number,
    comments: number,
    shares: number,
    stimulusImage: string,
    stimuliSets: string[]
}

export interface IGroup {
    id: string,
    name: string,
    numParticipants: number
}

export interface ITrial {
    id: string,
    groupId: string,
    key: string,
    interventionId: string,
    duration: number,
    proportionStimuli: number,
    stimuliSetId: string
}

export interface IStimuliSet {
    id: string,
    name: string,
    experimentId: string
}

export interface IExperimentParticipation {
    id?: string;
    userId: string;
    expiryDate: Date;
    status: ParticipationStatus;
    code: number;
    experimentId: string;
    groupId: string;
}

export interface IInteraction {
    id: string;
    $createdAt: Date
    userId: string;
    stimuliId: string;
    type: 'like' | 'comment' | 'share'
    subType: 'shareAsMessage' | 'shareInStory' | 'shareInFeed' | 'shareWithButtons'
    action: 'confirm' | 'reject'
    trialId: string
}

