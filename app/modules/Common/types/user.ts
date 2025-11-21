type  AbstractUser =  {
    id: string;
    email: string;
    name: string;
    username: string | null;
    avatar_url: string
}

export interface AuthUser extends AbstractUser {
    phone_number: string | null;
    github_id: string | null;
    facebook_id: string | null;
    google_id: string | null;
}
export interface User extends AbstractUser {
    id: string
    name: string
    username: string
    avatar_url: string
    verified: boolean
    is_following: boolean | null
    link: string | null
    bio: string | null
    followers: number | null
    following: number | null
    cover_url: string | null
    country: string | null
    created_at: string
    birth_date: string | null
    language: string | null
}
