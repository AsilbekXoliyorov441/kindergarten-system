import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Archive } from 'lucide-react'
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
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'

export function ArchiveGroupDialog({ group, redirectAfter = false }) {
  const [open, setOpen] = useState(false)
  const archiveGroup = useBogchaGroupStore((s) => s.archive)
  const navigate = useNavigate()

  const handleArchive = () => {
    archiveGroup(group.id)
    toast.success(`"${group.name}" guruhi arxivlandi`)
    setOpen(false)
    if (redirectAfter) navigate(BOGCHA_ROUTES.GROUPS, { replace: true })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Guruhni arxivlash">
          <Archive className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Guruhni arxivlash</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{group.name}</strong> ro'yxatdan yashiriladi, lekin yoqlama tarixi saqlanib qoladi. Buni
            keyinroq qaytarib bo'lmaydi.
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
