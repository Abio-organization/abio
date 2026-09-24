import { muted, sectionHeaderWrap } from './styles'

export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className={sectionHeaderWrap}>
      <h2 className="font-semibold">{title}</h2>
      <p className={muted}>{description}</p>
    </div>
  )
}
