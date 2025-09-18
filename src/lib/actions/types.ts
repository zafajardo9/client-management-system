export type ActionError = { code: string; message: string; details?: unknown };
export type ActionResult<T> = { success: true; data: T } | { success: false; error: ActionError };
