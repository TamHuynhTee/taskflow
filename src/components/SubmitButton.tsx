import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui";

/**
 * Nút submit tự biết form cha đang gửi (T4.4).
 * useFormStatus đọc trạng thái của <form> CHA GẦN NHẤT — giống một context do <form> cung cấp.
 * Gọi nó ngay trong component render ra <form> thì luôn pending=false, vì form đó là con,
 * không phải cha của component đang gọi hook.
 */
export function SubmitButton({
  children,
  pendingText = "Đang lưu…",
}: {
  children: ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" loading={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
