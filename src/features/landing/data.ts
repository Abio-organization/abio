import type { LinkItem, ProfileInfo, TemplateConfig } from './types'

export const navLinks = [
  { label: 'Themes', href: '/template' },
  { label: 'Store', href: '/store' },
  { label: 'Contact Us', href: '/contact-us' },
]

export const offers = [
  {
    plan: 'Free',
    description: 'Start free. Upgrade anytime.',
    type: 'Free',
    benefits: [
      '1 Smart Profile Page.',
      'Access to basic templates.',
      'Add your bio, profile image & social links',
      'Basic design themes (limited)',
      'QR code generator',
      'Basic analytics (visits & clicks)',
      'Community Support',
      'Add up to 5 extra external links',
      'Advanced analytics (CTR, devices, traffic sources).',
      'Priority customer support.',
      'Custom Analytics dashboard.',
      'Dedicated Support Manager',
      'Full design customization (fonts, backgrounds, themes.',
    ],
  },
]

const defaultProfile: ProfileInfo = {
  name: 'Mary Godwin',
  username: 'Mayeetee',
  bio: 'Unleashing creativity, one link at a time.',
  avatar: '/icons/osh.svg',
  location: 'Embu, Kenya',
}

const defaultLinks: LinkItem[] = [
  { text: 'Instagram', url: '#' },
  { text: 'Behance', url: '#' },
  { text: 'Snapchat', url: '#' },
  { text: 'Twitter', url: '#' },
  { text: 'My Portfolio', url: '#' },
]

/** Fallback template gallery, shown when GET /themes returns nothing (or errors). */
export const staticTemplates: TemplateConfig[] = [
  {
    id: 'minimal-pink',
    name: 'Minimal Pink',
    profile: defaultProfile,
    links: defaultLinks,
    style: {
      textColor: '#333333',
      buttonColor: '#ffffff',
      buttonTextColor: '#333333',
      accentColor: '#ff6b8b',
      fontFamily: "'Inter', sans-serif",
      buttonStyle: 'pill',
      buttonBorder: false,
      buttonEffect: 'flat',
      backgroundImage: "url('/images/template-image.svg')",
    },
  },
]

export { defaultLinks, defaultProfile }
