export interface LinkItem {
  text: string
  url: string
}

export interface ProfileInfo {
  name: string
  username: string
  bio: string
  avatar: string
  location: string
}

export interface TemplateButtonStyle {
  backgroundColor?: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  accentColor?: string
  fontFamily: string
  buttonStyle: 'rounded' | 'pill' | 'square' | 'outline'
  buttonBorder: boolean
  buttonEffect: 'flat' | '3d' | 'glass' | 'neon' | 'shadow' | 'minimal'
  backgroundImage?: string
  overlay?: boolean
}

export interface TemplateConfig {
  id: string
  name: string
  profile: ProfileInfo
  links: LinkItem[]
  style: TemplateButtonStyle
}
