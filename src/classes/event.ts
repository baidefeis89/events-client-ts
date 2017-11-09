import { IEvent } from '../interfaces/ievent';
import { IUser } from "../interfaces/iuser";
import { Http } from "../classes/http";
import { EVENTS_PATH } from "../contants";

export class EventItem implements IEvent {
    id?: number;
    title: string;
    date: string | Date;
    description: string;
    image: string;
    price: number;
    address: string;
    lat: number;
    lng: number;
    creator?: IUser;
    mine?: boolean;
    attend?: boolean;
    distance?: number;

    constructor(eventJSON: IEvent){

    }

    static getEvents(): Promise<EventItem[]> {
        return Http.ajax('GET', EVENTS_PATH).then( response => {
            return response.events;
        });
    }
}

