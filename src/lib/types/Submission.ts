export type Submission = {
  areas: { level: number, comment: string }[];
  repo: string;
  url: string;
  audio: string;
  video: string;
  comment: string;
}

export type SubmissionAreas = {
  level: number;
  comment: string;
}[];
