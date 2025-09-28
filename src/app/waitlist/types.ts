export type WaitlistFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export const initialWaitlistFormState: WaitlistFormState = {
  status: "idle",
};
