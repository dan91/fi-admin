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
    id?: string;
    name: string;
    required_participants: number;
    session_duration: number;
    website_redirect_after_session?: string;
    website_redirect_after_experiment?: string;
    number_sessions: number;
    status?: 'running' | 'paused' | 'finished' | 'ready';
    proportion_manipulated: number
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
    id?: string,
    name: string,
    message: string,
    apply_on_likes?: boolean,
    apply_on_comments?: boolean,
    apply_on_shares?: boolean,
}

export interface IStimulus {
    id?: string,
    userName: string,
    userImage: string,
    stimulusText: string,
    likes: number,
    comments: number,
    shares: number,
    stimulusImage: string,
    stimuliSets: number[]
}

export interface IGroup {
    id: string,
    name: string,
    numParticipants: number
}

export interface ITrial {
    id: string,
    groupId: string,
    key: number,
    interventionId: string,
    duration: number,
    proportionStimuli: number
}