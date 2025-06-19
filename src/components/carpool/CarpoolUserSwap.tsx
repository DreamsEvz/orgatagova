"use client";

import { CarpoolWithCreator } from "@/app/carpool/carpool.action";
import { Carpool } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";
import { CarpoolViewList } from "./CarpoolViewList";

type CarpoolUserSwapProps = 'owned' | 'ongoing' | 'finished';

export default function CarpoolUserSwap({ ownedCarpools, joinedCarpools, finishedCarpools }: { ownedCarpools: Carpool[], joinedCarpools: CarpoolWithCreator[], finishedCarpools: Carpool[] }) {

  const [isMyCarpools, setIsMyCarpools] = useState<CarpoolUserSwapProps>('ongoing');

  return (<>
    <div className="flex flex-row gap-2 mb-10 bg-gray-800/60 border-gray-700 shadow-xl p-6 rounded-lg">
    <Button className="w-full" onClick={() => setIsMyCarpools('ongoing')} variant={isMyCarpools === 'ongoing' ? "default" : "outline"}>
        <span>Les covoiturages en cours</span>
      </Button>
      <Button className="w-full" onClick={() => setIsMyCarpools('owned')} variant={isMyCarpools === 'owned' ? "default" : "outline"}>
        <span>Mes covoiturages</span>
      </Button> 
      <Button className="w-full" onClick={() => setIsMyCarpools('finished')} variant={isMyCarpools === 'finished' ? "default" : "outline"}>
        <span>Les covoiturages terminés</span>
      </Button>
    </div>
    {isMyCarpools === 'owned' ? <CarpoolViewList carpools={ownedCarpools} /> : isMyCarpools === 'ongoing' ? <CarpoolViewList carpools={joinedCarpools} /> : <CarpoolViewList carpools={finishedCarpools} />}  
    </>
  );
}