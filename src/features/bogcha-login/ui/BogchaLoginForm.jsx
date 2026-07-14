import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { KeyRound, LockKeyhole, User } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/button'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'

export function BogchaLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const login = useBogchaAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await login(username, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      toast.error(result.error)
      return
    }

    toast.success('Xush kelibsiz!')
    navigate(location.state?.from?.pathname ?? BOGCHA_ROUTES.DASHBOARD, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <Label htmlFor="username">Login</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            autoComplete="username"
            placeholder="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-9"
            autoFocus
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Parol</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full gap-1.5">
        <KeyRound className="size-4" /> Kirish
      </Button>
    </form>
  )
}
