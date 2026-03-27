import { Calendar, Apple } from 'lucide-react'
export default function DietIcon({ size = 32 }) {
  return (
    <div style={{ position: 'relative' }}>
      <Calendar size={size} absoluteStrokeWidth>
        <Apple
          size={size * 0.3}
          x={size * 0.45}
          y={size * 0.45}
          fill="var(--bg-main)"
          absoluteStrokeWidth
        />
      </Calendar>
    </div>
  )
}
