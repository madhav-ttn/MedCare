export interface Doctor{
    id?: number;
    name:string;
    speciality: string;
    experience: number;
    photo_url?: string;
    rating?: number;
    location: string;
    gender: "male" | "female" | "other";
    disease?: string[];
}