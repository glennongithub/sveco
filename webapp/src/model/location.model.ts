export interface location {
    id?: number;
    user?: user;
    createdAt?: object;
    modifiedAt?: object;
    visits?: visit[];
    language: string;
    address: {};
    formattedAddressString: string,
    area?: area;
    note: string;
    type: string;
    status?: string; // This is a virtual status .. that is set depending on some logic dependency for visits.. set in ap when reading locations
    isBusiness: boolean;
    isReturnVisit: boolean,
    overRideLocation?: {}, //not used for now.
    apartmentNr: string;
}

export interface user {
    id?: number;
    apiKey?: string; // not always required ..
    username: string;
    fullname: string;
    /* may add more stuff here like settings or roles .. but don't think roles need to be propagated to client..
    * enough to handle on server-side  maybe some link to user-settings or so. but nothing for now.*/
}

export interface visit {
    id?: number;
    user: user;
    visitDate: any;
    status: string;
    note: string;
    locationId?: number; //must be set when adding new visit to till what location it belongs to
}

export interface area {
    id: number;
    areaName: string;
}

