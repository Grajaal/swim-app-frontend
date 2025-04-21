import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface ConfirmationDialogProps {
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  confirmButtonText?: string
  confirmButtonVariant?: 'default' | 'destructive'
  cancelButtonText?: string

}

export function ConfirmationDialog({
  description,
  open, onOpenChange,
  onConfirm,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonVariant = 'default'
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn({
              'bg-destructive text-white hover:bg-destructive/80': confirmButtonVariant === 'destructive'
            })}
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}