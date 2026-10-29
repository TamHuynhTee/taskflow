import type { User } from "../types";
import "./Avatar.css";

interface AvatarProps {
  user: User;
  size?: number;
}

export function Avatar({ user, size = 24 }: AvatarProps) {
  return (
    <span
      className="avatar"
      title={user.name}
      // style inline nhận một object JS: tên thuộc tính viết camelCase, giá trị số tự hiểu là px.
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        backgroundColor: user.avatarColor,
      }}
    >
      {user.name[0]}
    </span>
  );
}
