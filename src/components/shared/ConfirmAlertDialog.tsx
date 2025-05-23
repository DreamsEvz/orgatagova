import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";


export function ConfirmAlertDialog({ children, title, description, onConfirm }: { children: React.ReactNode, title: string, description: string, onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
            
        </AlertDialogHeader>
          <AlertDialogCancel>Non</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Oui</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}