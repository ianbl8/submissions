export type Grade = {
  areas: { level: number, grade: number, comment: string }[];
  grade: number;
  feedback: string;
}

export type GradeAreas = {
  level: number;
  grade: number;
  comment: string;
}[];
