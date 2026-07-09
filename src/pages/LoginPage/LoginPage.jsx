import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { LoginForm } from '@/features/login-as-role/ui/LoginForm'

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
              <Coins className="size-7" />
            </div>
            <CardTitle className="text-2xl">Coin System</CardTitle>
            <CardDescription>PDP Frontend guruhlari uchun mukofot tizimi</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <LoginForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
