import CarpoolHeader from "@/src/components/carpool/CarpoolHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CarpoolHeader />
      <main className="sm:ml-64 min-h-screen">
        {children}
      </main>
    </>
  )
}
