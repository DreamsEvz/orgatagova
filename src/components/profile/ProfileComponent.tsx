import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function ProfileComponent({ children, session }: { children: React.ReactNode, session: Session | null }) {

  return (
    <Sheet modal={false}>
      <SheetTrigger>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-full w-full bg-gray-800 flex flex-col items-center justify-center">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
            <div className="flex items-center justify-center">
              <Image src={session?.user?.image!} alt="Profile" width={100} height={100} />
              <p>{session?.user?.name}</p>
            </div>
            <Button onClick={() => signOut()}>
                Se déconnecter
            </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
