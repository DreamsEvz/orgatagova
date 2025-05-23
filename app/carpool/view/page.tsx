import { CarpoolList } from "@/src/components/carpool/CarpoolList";
import { prisma } from "@/src/lib/prisma/prisma";

export default async function Page() {
  const carpools = await prisma.carpool.findMany();

  return <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    <h1 className="text-4xl text-teal-400 font-medium mb-4">Liste des trajets</h1>
    <CarpoolList carpools={carpools} />
  </main>
}
