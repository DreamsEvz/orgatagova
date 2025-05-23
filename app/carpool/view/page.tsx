import { CarpoolList } from "@/src/components/carpool/CarpoolList";
import { prisma } from "@/src/lib/prisma/prisma";

export default async function Page() {
  const carpools = await prisma.carpool.findMany();

  return <main className="flex flex-col items-center min-h-screen bg-gray-900 mt-10">
    <h1 className="text-4xl text-teal-400 font-medium mb-10">Liste des covoiturages</h1>
    <CarpoolList carpools={carpools} />
  </main>
}
