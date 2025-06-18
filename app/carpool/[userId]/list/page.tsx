import { getUserUnFinishedCarpools } from "@/app/carpool/carpool.action";
import { CarpoolViewList } from "@/src/components/carpool/CarpoolViewList";
export default async function Page() {
  const carpools = await getUserUnFinishedCarpools();

  return <main className="flex flex-col items-center min-h-100 bg-gray-900 p-6">
    <h1 className="text-4xl text-teal-400 font-bold mb-10">Mes covoiturages</h1>
    <CarpoolViewList carpools={carpools} />
  </main>
}
