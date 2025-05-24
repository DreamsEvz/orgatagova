import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";


export function ConfirmAlertDialog({ children, title, description, onConfirm }: { children: React.ReactNode, title: string, description: string, onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800/60 border-gray-700 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-teal-400">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel className="bg-red-400 hover:bg-red-500">Non</AlertDialogCancel>
          <AlertDialogAction className="bg-green-400 hover:bg-green-500" onClick={onConfirm}>Oui</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}