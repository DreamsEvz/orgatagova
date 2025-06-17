import { CarpoolList } from "@/src/components/carpool/CarpoolList";
import { prisma } from "@/src/lib/prisma/prisma";

export default async function Page() {
  const carpools = await prisma.carpool.findMany();

  return <main className="flex flex-col items-center min-h-100 bg-gray-900 p-6">
    <h1 className="text-4xl text-teal-400 font-bold mb-10 text-center">Liste des covoiturages</h1>
    <CarpoolList carpools={carpools} />
  </main>
}
