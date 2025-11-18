import { type AuthUser as User } from "~/modules/Common/types/user";

export interface AuthResponse {
  access_token: string;
  user: User;
}