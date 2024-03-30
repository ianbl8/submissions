export type Rubric = {
  total_marks: number;
  levels: { name: string, min_marks: number, max_marks: number }[];
  show_levels_marks: boolean;
  areas: { name: string, marks: number, descriptors: Array<string> }[];
  require_self_assessment: boolean;
  require_files: boolean;
  require_repo: boolean;
  require_url: boolean;
  require_audio: boolean;
  require_video: boolean;
}

export type Levels = {
  name: string;
  min_marks: number;
  max_marks: number;
}[];

export type Areas = {
  name: string;
  marks: number;
  descriptors: Array<string>
 }[];
