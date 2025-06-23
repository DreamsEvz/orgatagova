"use server";

import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export async function getCurrentUserId() {
  try {
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

    if (!token) {
      console.log("No token found");
      return null;
    }

    if (!token.id) {
      console.log("Token found but no id field:", token);
      return null;
    }

    return token.id as string; // Retourne l'id ou null si non connecté
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}
