export interface INews {
    id: number;
    name: string;
    about: string;
    description: string;
    isTickered?: boolean;
}

export interface INewsCreatePayload {
    name: string;
    nameAr: string;
    about: string;
    aboutAr: string;
    description: string;
    descriptionAr: string;
}

export interface INewsUpdatePayload extends INewsCreatePayload {
    id: number;
}