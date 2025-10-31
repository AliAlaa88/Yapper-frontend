export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string | null;
  github_id: string | null;
  facebook_id: string | null;
  google_id: string | null;
  avatar_url: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}