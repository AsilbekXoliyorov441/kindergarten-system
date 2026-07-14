import { useState } from 'react'
import { toast } from 'sonner'
import { UserX } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'

export function ArchiveChildDialog({ child }) {
  const [open, setOpen] = useState(false)
  const archiveChild = useBogchaChildStore((s) => s.archive)

  const handleArchive = () => {
    archiveChild(child.id)
    toast.success(`${child.fullName} arxivlandi`)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Bolani arxivlash">
          <UserX className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bolani arxivlash</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{child.fullName}</strong> ro'yxatdan yashiriladi, yoqlama tarixi saqlanib qoladi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>Ha, arxivlash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
