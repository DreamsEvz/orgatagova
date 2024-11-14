import CarpoolHeader from "@/src/components/carpool/CarpoolHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main><CarpoolHeader /> {children}</main>;
}
