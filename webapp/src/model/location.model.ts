export interface location {
    id: number;
    createdAt: object;
    modifiedAt: object;
    visits: visit[];
    language: string;
    address: string;
    area: area;
    note: string;
    type: string;
    status: string;
    isBusiness: boolean;
    apartmentNr: string;
}

interface user {
    id: number;
    username: string;
    fullname: string;
    /* may add more stuff here like settings or roles .. but don't think roles need to be propagated to client..
    * enough to handle on server-side  maybe some link to user-settings or so. but nothing for now.*/
}

interface visit {
    id: number;
    user: user;
    visitDate: object;
    status: string;
    note: string;
}

interface area {
    id: number;
    areaName: string;
}

