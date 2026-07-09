import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ROUTES } from '@/shared/config/constants'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <EmptyState
        icon={Compass}
        title="Sahifa topilmadi"
        description="Siz izlagan sahifa mavjud emas yoki ko'chirilgan."
        action={
          <Button asChild>
            <Link to={ROUTES.DASHBOARD}>Bosh sahifaga qaytish</Link>
          </Button>
        }
      />
    </div>
  )
}
