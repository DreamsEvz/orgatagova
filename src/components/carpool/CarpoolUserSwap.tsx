"use client";

import { CarpoolWithCreator } from "@/app/carpool/carpool.action";
import { Carpool } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";
import { CarpoolViewList } from "./CarpoolViewList";

export default function CarpoolUserSwap({ ownedCarpools, joinedCarpools }: { ownedCarpools: Carpool[], joinedCarpools: CarpoolWithCreator[] }) {

  const [isMyCarpools, setIsMyCarpools] = useState(true);

  return (<>
    <div className="flex flex-row gap-2 mb-10 bg-gray-800/60 border-gray-700 shadow-xl p-6 rounded-lg">
      <Button className="w-full" onClick={() => setIsMyCarpools(true)} variant={isMyCarpools ? "default" : "outline"}>
        <span>Mes covoiturages</span>
      </Button> 
      <Button className="w-full" onClick={() => setIsMyCarpools(false)} variant={isMyCarpools ? "outline" : "default"}>
        <span>Les covoiturages rejoints</span>
      </Button>
    </div>
    {isMyCarpools ? <CarpoolViewList carpools={ownedCarpools} /> : <CarpoolViewList carpools={joinedCarpools} />}  
    </>
  );
}