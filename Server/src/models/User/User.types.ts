// User.types.ts
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    photo?: string;
    role: "admin" | "farmer" | "viewer";
    address?: {
        village: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export type CreateUser = Omit<User, "id">;
export type PublicUser = Omit<User, "password">;
