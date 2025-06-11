"use server";

import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export async function getCurrentUserId() {
  // Récupère les en-têtes de la requête actuelle
  const headersList = await headers();
  const currentHeaders = Object.fromEntries(headersList.entries());
  
  // Récupère le cookie contenant le token
  const token = await getToken({
    req: {
      headers: currentHeaders,
    },
    secret: process.env.NEXTAUTH_SECRET, // Remplacez AUTH_SECRET par NEXTAUTH_SECRET
  });

  return token?.id as string || null; // Retourne l'id ou null si non connecté
}
