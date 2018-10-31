export interface IUser {
    id?: number,
    name: string,
    avatar: string,
    email: string,
    email2?: string, // Register form will send this
    password?: string,
    lat?: number,
    lng?: number,
    me?: boolean // If the user is the current logged user
}
