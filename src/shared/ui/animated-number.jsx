import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

const defaultFormatter = (n) => Math.round(n).toLocaleString('uz-UZ')

function AnimatedNumber({ value, duration = 0.6, formatter = defaultFormatter }) {
  const [display, setDisplay] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: setDisplay,
    })
    prevValue.current = value
    return () => controls.stop()
  }, [value, duration])

  return formatter(display)
}

export { AnimatedNumber }
