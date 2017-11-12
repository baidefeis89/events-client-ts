import { IUser } from './iuser';
import { IEvent } from './ievent';

export interface IResponse {
    ok: boolean,
    error?: string,
    errors?: string[],
    event?: IEvent,
    events?: IEvent[],
    profile?: IUser, 
    users?: IUser[],
    token?: string,
    avatar: string
}
