import { Sticker, NotebookPen, Coffee, Usb, Crown, Mouse, Shirt, Backpack, Gift as GiftFallback } from 'lucide-react'

const ICON_MAP = { Sticker, NotebookPen, Coffee, Usb, Crown, Mouse, Shirt, Backpack }

function GiftIcon({ icon, className }) {
  const Icon = ICON_MAP[icon] || GiftFallback
  return <Icon className={className} />
}

export { GiftIcon }
