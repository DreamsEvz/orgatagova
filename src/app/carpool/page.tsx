import CreateCarForm from "@/components/carpool/createCarForm";
import { Button } from "@/components/ui/button";

const Carpool = () => {
  return (
    <div className="h-svh flex justify-center">
      <div className="flex flex-col justify-center items-center gap-12">
        <CreateCarForm />
        <span className="block">Ou</span>
        <Button>Rejoindre une voiture</Button>
      </div>
    </div>
  );
};

export default Carpool;
