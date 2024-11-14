import CreateCarpoolForm from "@/src/components/carpool/CreateCarpoolForm";

export default function Page() {
  return <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    <h1 className="text-4xl font-bold text-teal-400 mb-8">Créer un covoiturage</h1>
    <CreateCarpoolForm />
  </main>
}
