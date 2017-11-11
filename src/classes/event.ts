import { IEvent } from '../interfaces/ievent';
import { IUser } from "../interfaces/iuser";
import { IResponse } from "../interfaces/iresponse";
import { Http } from "../classes/http";
import { EVENTS_PATH, EVENT_PATH, ATTEND_PATH } from "../contants";
import { User } from "./user";

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

    constructor(eventItem: IEvent) {
        this.id = +eventItem.id;
        this.title = eventItem.title;
        this.date = eventItem.date;
        this.description = eventItem.description;
        this.image = eventItem.image;
        this.price = +eventItem.price;
        this.address = eventItem.address;
        this.lat = +eventItem.lat;
        this.lng = +eventItem.lng;
        this.mine = eventItem.mine;
        this.attend = eventItem.attend;
        this.distance = +eventItem.distance;

        if(eventItem.creator){
            this.creator = new User(eventItem.creator);
        }
    }

    static getEvents(): Promise<EventItem[]> {
        return Http.ajax('GET', EVENTS_PATH).then( (response: IResponse) => {
            if (response.ok )
                return response.events.map( ev => new EventItem(ev));
            else
                throw response.error;
        });
    }


    static getEvent(id: number): Promise<EventItem> {
        return Http.ajax('GET', `${EVENT_PATH}${id}`).then( (response:IResponse) => {
            if (response.ok)
                return new EventItem(response.event);
            else
                throw response.ok;
        });
    }

    post(): Promise<boolean> {
        return Http.ajax('POST',EVENT_PATH,this).then( response => {
            if (response.ok)
                return response.ok;
            else
                throw response.errors;
        });
    }

    delete(): Promise<boolean> {
        return Http.ajax('DELETE',`${EVENT_PATH}${this.id}`).then( response => {
            if (response.ok)
                return response.ok;
            else
                throw response.error;
        })
    }

    toggleAttend(): Promise<boolean> {
        let action;
        if (this.attend) action = 'DELETE';
        else action = 'POST';

        return Http.ajax(action, `${ATTEND_PATH}${this.id}`)
        .then((response:IResponse) => {
            if(response.ok){
                this.attend = !this.attend;
                return response.ok;
            }else{
                throw response.error;
            }
        });
    }

    getAttendees(): Promise<boolean> {
        return Http.ajax('GET',`${ATTEND_PATH}${this.id}`).then( response => {
            if (response.ok)
                return response.ok;
            else
                throw response.error;
        })
    }

    //TODO implement
    toHTML(): HTMLDivElement{
        return new HTMLDivElement;
    }
}

