"use client";

import CreateCarForm from "@/components/carpool/createCarForm";
import { Button } from "@/components/ui/button";
import { Car, getCars } from "@/supabase/cars";
import { useEffect, useState } from "react";

const Carpool = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await getCars();
        if (error) {
          console.error("Error fetching cars:", error);
        } else {
          if (data) {
            setCars(data);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="h-svh flex justify-center">
      <div className="flex flex-col justify-center items-center gap-12">
        <CreateCarForm />
        <span className="block">Ou</span>
        <Button>Rejoindre une voiture</Button>
      </div>

      {loading ? (
        <p>Chargement des voitures...</p>
      ) : cars.length > 0 ? (
        cars.map((car: Car) => (
          <div
            key={Math.random()}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <p>{car.departure}</p>
            <p>{car.destination}</p>
            <p>{car.departureDate}</p>
            <p>{car.departureTime}</p>
            <p>{car.seats}</p>
          </div>
        ))
      ) : (
        <p>Aucune voiture disponible pour le moment.</p>
      )}
    </div>
  );
};

export default Carpool;
