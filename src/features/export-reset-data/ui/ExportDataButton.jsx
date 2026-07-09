import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useConvex } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Button } from '@/shared/ui/button'
import { useAuthStore } from '@/entities/session/model/store'

export function ExportDataButton() {
  const convex = useConvex()
  const token = useAuthStore((s) => s.token)

  const handleExport = async () => {
    const payload = await convex.query(api.backup.exportAll, { token })

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coin-system-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success('Zaxira nusxa yuklab olindi')
  }

  return (
    <Button variant="outline" onClick={handleExport} className="gap-1.5">
      <Download className="size-4" /> Zaxira nusxa (JSON)
    </Button>
  )
}
