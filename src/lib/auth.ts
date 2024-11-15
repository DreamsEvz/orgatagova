import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma/prisma";

export const { auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Configuration pour JWT
  session: {
    strategy: "jwt", // Utilisation des JWT
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ajoute l'ID utilisateur au token
        token.email = user.email; // Ajoute l'email utilisateur au token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Rediriger vers /carpool après connexion
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/carpool`;
      }
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
});
