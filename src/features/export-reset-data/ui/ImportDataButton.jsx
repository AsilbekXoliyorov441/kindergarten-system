import { useRef } from 'react'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Button } from '@/shared/ui/button'
import { useAuthStore } from '@/entities/session/model/store'

const REQUIRED_KEYS = ['groups', 'students', 'lessons', 'coinEntries', 'transactions', 'gifts']

export function ImportDataButton() {
  const inputRef = useRef(null)
  const token = useAuthStore((s) => s.token)
  const importAll = useMutation(api.backup.importAll)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const data = JSON.parse(await file.text())
      if (!REQUIRED_KEYS.every((key) => Array.isArray(data[key]))) {
        throw new Error('invalid backup shape')
      }

      await importAll({ token, data })

      toast.success("Ma'lumotlar tiklandi, sahifa yangilanmoqda...")
      setTimeout(() => window.location.reload(), 800)
    } catch {
      toast.error("Fayl noto'g'ri formatda")
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={handleFile} />
      <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-1.5">
        <Upload className="size-4" /> Tiklash (JSON)
      </Button>
    </>
  )
}
