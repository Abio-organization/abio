export interface Link {
  id: string
  title: string
  url: string
  platform: string
  displayOrder: number
  isVisible: boolean
  clickCount: number
  /** Custom link icon — backend serializes this raw Prisma field name as-is. */
  icon_link: string | null
}
