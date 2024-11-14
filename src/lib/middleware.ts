// middleware.ts
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Liste des chemins publics accessibles sans authentification
  const publicPaths = ['/', '/login'];
  const path = request.nextUrl.pathname;

  // Récupérer le token via NextAuth pour vérifier si l’utilisateur est connecté
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // Si l'utilisateur essaie d'accéder à une page publique alors qu'il est connecté, rediriger vers /carpool/view
  if (publicPaths.includes(path) && token) {
    return NextResponse.redirect(new URL('/carpool/view', request.url));
  }

  // Si l'utilisateur essaie d'accéder à une page protégée sans être connecté, rediriger vers /login
  if (!publicPaths.includes(path) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur est autorisé, continuer la requête
  return NextResponse.next();
}

export const config = {
  matcher: ['/carpool/:path*', '/dashboard/:path*'], // Spécifie les routes protégées ici
};
