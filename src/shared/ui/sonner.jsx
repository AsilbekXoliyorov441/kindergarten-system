import { Toaster as Sonner } from 'sonner'

const Toaster = (props) => (
  <Sonner
    className="toaster group"
    position="top-center"
    toastOptions={{
      classNames: {
        toast: 'glass-panel! rounded-2xl! shadow-lg! text-foreground!',
        title: 'text-sm! font-medium!',
        description: 'text-muted-foreground!',
        actionButton: 'bg-primary! text-primary-foreground!',
        cancelButton: 'bg-muted! text-muted-foreground!',
      },
    }}
    {...props}
  />
)

export { Toaster }
