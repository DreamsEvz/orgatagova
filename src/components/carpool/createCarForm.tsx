"use client";

import { createCar } from "@/supabase/cars";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  departure: z.string().min(1, { message: "Le champ départ est requis" }),
  destination: z.string(),
  departureDate: z
    .string()
    .min(1, { message: "Le champ date de départ est requis" })
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const currentDate = new Date();
        return selectedDate > currentDate;
      },
      { message: "La date de départ doit être supérieure à la date actuelle" }
    ),
  departureTime: z
    .string()
    .min(1, { message: "Le champ heure de départ est requis" }),
  seats: z.string().min(1, { message: "Le champ nombre de places est requis" }),
});

const CreateCarForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure: "",
      destination: "",
      departureDate: "",
      departureTime: "",
      seats: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCar(values);
    form.reset();
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form
          className="flex gap-4 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="departure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Départ</FormLabel>
                <FormControl>
                  <Input placeholder="Lyon" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Paris" {...field}></Input>
                </FormControl>
                <FormDescription>Optionnel</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de départ</FormLabel>
                <FormControl>
                  <Input type="date" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de départ</FormLabel>
                <FormControl>
                  <Input type="time" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de places</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={10} {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Créer une voiture</Button>
        </form>
      </Form>
    </Card>
  );
};

export default CreateCarForm;
