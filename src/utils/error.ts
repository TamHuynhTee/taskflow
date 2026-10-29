/** Gets a readable message from any error (Error, string, ...). */
export function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}
