import { getCarpoolsWhereUserBelongs, getFinishedCarpools, getUserUnFinishedCarpools } from "@/app/carpool/carpool.action";
import CarpoolUserSwap from "@/src/components/carpool/CarpoolUserSwap";

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const ownedCarpools = await getUserUnFinishedCarpools();
  const joinedCarpools = await getCarpoolsWhereUserBelongs(userId as string);     
  const finishedCarpools = await getFinishedCarpools();
  return <main className="flex flex-col items-center min-h-100 bg-gray-900 p-6">
    <h1 className="text-4xl text-teal-400 font-bold mb-10">Mes covoiturages</h1>

    <CarpoolUserSwap ownedCarpools={ownedCarpools} joinedCarpools={joinedCarpools} finishedCarpools={finishedCarpools} /> 
  
  </main>
}
