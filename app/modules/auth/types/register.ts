export interface RegisterPayload {
    Name: string
    Email: string
    Birth_date: string
    Captcha_token: string
}

export interface verifyAccountPayload {
    Email: string
    token: string
}

export interface finalizeRegisterPayload {
    Email: string
    Password: string
    Username: string
    Language: string
}
