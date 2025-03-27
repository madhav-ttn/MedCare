import { RefObject } from "react";

export interface SideCardProps {
  title: string;
  data: string[];
  handleFilter: (type: string, value: string) => void;
}

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  photo_url?: string;
  rating?: number;
  location: string;
  gender: string;
  disease?: string[];
}
