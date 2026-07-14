import { motion } from 'framer-motion'
import { Baby } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { BogchaLoginForm } from '@/features/bogcha-login/ui/BogchaLoginForm'

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-app-gradient" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-coin/20 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-hover text-primary-foreground shadow-lg">
              <Baby className="size-7" />
            </div>
            <CardTitle className="text-2xl">Bogcha</CardTitle>
            <CardDescription>Yoqlama va oylik hisobot tizimi</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <BogchaLoginForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
