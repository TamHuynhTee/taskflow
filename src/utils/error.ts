/** Lấy thông điệp dễ đọc từ một lỗi bất kỳ (Error, string, ...). */
export function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Lỗi không xác định";
}
