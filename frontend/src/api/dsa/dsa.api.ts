import api from "../axios";

export interface RunCodePayload {
  code: string;
  language: string;
  interviewId: string;
  problemId: string | number;
  test_cases: Array<{
    input: string;
    expectedOutput?: string;
    expected_output?: string;
    hidden?: boolean;
  }>;
}

export interface SubmitCodePayload {
  code: string;
  language: string;
  interviewId: string;
  problemId: string | number;
  test_cases?: Array<{
    input: string;
    expectedOutput?: string;
    expected_output?: string;
    hidden?: boolean;
  }>;
}

export interface SkipProblemPayload {
  interviewId: string;
  problemId: string | number;
  code?: string;
  language?: string;
}

export async function runDsaCode(payload: RunCodePayload) {
  const response = await api.post("/execute-code/run-code", payload);
  return response.data;
}

export async function submitDsaSolution(payload: SubmitCodePayload) {
  const response = await api.post("/execute-code/submit-code", payload);
  return response.data;
}

export async function skipDsaProblem(payload: SkipProblemPayload) {
  const response = await api.post("/execute-code/skip", payload);
  return response.data;
}
