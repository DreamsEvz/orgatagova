import CarpoolJoinWithCode from "@/src/components/carpool/CarpoolJoinWithCode";
import { CarpoolList } from "@/src/components/carpool/CarpoolList";
import { Button } from "@/src/components/ui/button";
import { prisma } from "@/src/lib/prisma/prisma";
import { FaPlus } from "react-icons/fa";

export default async function Page() {
  const carpools = await prisma.carpool.findMany();

  return <main className="flex flex-col items-center min-h-100 bg-gray-900 p-6">
    <h1 className="text-4xl text-teal-400 font-bold mb-10 text-center">Liste des covoiturages</h1>
    <CarpoolJoinWithCode>
      <Button className="mb-10"><FaPlus /> Rejoindre un covoiturage avec code</Button>
    </CarpoolJoinWithCode>
      <CarpoolList carpools={carpools} />
  </main>
}
