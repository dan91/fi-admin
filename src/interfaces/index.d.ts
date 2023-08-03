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
