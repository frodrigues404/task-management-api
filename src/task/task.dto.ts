export class TaskDto {
    id: string;
    title: string;
    description: string;
    status: string;
    expirationDate: Date;
}

export interface FindAllParams {
    title: string;
    status: string;
}