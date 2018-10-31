import { IUser } from './iuser';

export interface IEvent {
    id?: number,
    title: string,
    date: string | Date,
    description: string,
    image: string,
    price: number,
    address: string,
    lat: number,
    lng: number,
    creator?: IUser,
    mine?: boolean,
    attend?: boolean
    distance?: number
}
