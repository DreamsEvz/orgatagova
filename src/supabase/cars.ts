export interface Car {
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  seats: string;
}

import { supabase } from "./supabase";

export const createCar = async (car: Car) => {
  const { data, error } = await supabase.from("cars").insert([car]);
  return { data, error };
};

export const getCars = async () => {
  const { data, error } = await supabase.from("cars").select();
  return { data, error };
};
