import { type User } from "~/modules/Common/types/user";

export type { User };

export interface AuthResponse {
  access_token: string;
  user: User;
}