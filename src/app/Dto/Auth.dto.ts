export interface RegisterDto{
    name: string;
    lastname: string;
    email: string;
    password: string;
    rolId: string;
}

export interface LoginDto{
    email: string;
    password: string;
}