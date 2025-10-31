"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function CarpoolJoinWithCode({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Entrez le code du covoiturage</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Input type="text" placeholder="Code du covoiturage" />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-400 hover:bg-red-500">Annuler</AlertDialogCancel>
          <Button className="bg-teal-400 hover:bg-teal-500" onClick={() => setIsOpen(false)}>Rejoindre</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}