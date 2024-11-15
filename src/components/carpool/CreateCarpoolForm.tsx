"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  departure: z.string().min(1, { message: "Le champ départ est requis" }),
  arrival: z.string(),
  description: z.string(),
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
  departureTime: z.string().min(1, { message: "Le champ heure de départ est requis" }),
  availableSeats: z.string().min(1, { message: "Le champ nombre de places est requis" }),
  isDriverSoberNeeded: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
});

const CreateCarForm = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure: "",
      arrival: "",
      description: "",
      departureDate: "",
      departureTime: "",
      availableSeats: "",
      isDriverSoberNeeded: false,
      isPrivate: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/carpool/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    
    const result = await response.json();
    if (result.success) {
      //form.reset();
      //router.push(`/carpool/cm3h9bw7o00002oc0ddtznkua/${result.carpoolId}`);
    }
  };

  return (
    <Card className="bg-gray-800/60 p-8 rounded-lg shadow-lg">
      <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-12">
            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="departure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Départ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lyon"
                        {...field}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paris"
                        {...field}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400 mt-1">Optionnel</FormDescription>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Date de départ</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Heure de départ</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-400">Nombre de places</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        className="bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 mt-4">
    <FormField
      control={form.control}
      name="isDriverSoberNeeded"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between space-y-0">
          <FormLabel className="text-teal-400">Besoin d'un conducteur sobre ?</FormLabel>
          <FormControl>
            <Switch 
              checked={field.value} 
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-teal-500"
            />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="isPrivate"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between space-y-0">
          <FormLabel className="text-teal-400">Covoiturage privé ?</FormLabel>
          <FormControl>
            <Switch 
              checked={field.value} 
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-teal-500"
            />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
            </div>
          </div>
          <div className="flex mx-auto mt-6">
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-lg text-white px-6 py-3 rounded-lg transition-colors duration-150"
            >
              Créer un covoiturage
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default CreateCarForm;
