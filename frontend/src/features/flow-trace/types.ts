export type TraceEvent = {
  phase: "enter" | "exit";
  nodeId: string;
  type?: string;
  name?: string;
  z?: string;
  msgid: string;
  t: number;
};
