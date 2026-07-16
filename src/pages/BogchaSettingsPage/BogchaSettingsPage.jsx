import { useState } from 'react'
import { toast } from 'sonner'
import { Wallet, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/button'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { ResetDataDialog } from '@/features/bogcha-reset-data/ui/ResetDataDialog'

function FeeForm({ feePerDay, onSave }) {
  const [value, setValue] = useState(String(feePerDay))

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("To'g'ri summa kiriting")
      return
    }
    onSave(parsed)
    toast.success('Kunlik narx yangilandi')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="fee-per-day">Kunlik narx</Label>
        <Input id="fee-per-day" type="number" min="0" step="1000" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button type="submit">Saqlash</Button>
    </form>
  )
}

export function BogchaSettingsPage() {
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)
  const update = useBogchaSettingsStore((s) => s.update)

  return (
    <div className="max-w-md space-y-6">
      <Card>
        <CardHeader>
          <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Wallet className="size-5" />
          </div>
          <CardTitle>Kunlik narx</CardTitle>
          <CardDescription>Har bir bola kelgan kun uchun hisoblanadigan summa (so'm).</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Keyed by feePerDay so the field re-initializes once the server value loads,
              without syncing external state into local state via an effect. */}
          <FeeForm key={feePerDay} feePerDay={feePerDay} onSave={update} />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <RefreshCcw className="size-5" />
          </div>
          <CardTitle>Ma'lumotlarni tozalash</CardTitle>
          <CardDescription>
            Guruhlar, bolalar, ota-onalar, davomat va murojaatlarni butunlay o'chiradi. Xodimlar login-parollari
            saqlanib qoladi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetDataDialog />
        </CardContent>
      </Card>
    </div>
  )
}
