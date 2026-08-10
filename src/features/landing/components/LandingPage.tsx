import { CustomNfcCardSection } from './CustomNfcCardSection'
import { DetailedAnalytics } from './DetailedAnalytics'
import { Faq } from './Faq'
import { FeaturesGrid } from './FeaturesGrid'
import { Footer } from './Footer'
import { HeroSection } from './HeroSection'
import { IntegrateSocials } from './IntegrateSocials'
import { ManageYourLinks } from './ManageYourLinks'
import { NavBar } from './NavBar'
import { Testimonials } from './Testimonials'

export function LandingPage() {
  return (
    <main className="overflow-x-hidden overflow-y-auto scroll-smooth bg-[#FEF4EA]">
      <NavBar />
      <HeroSection />
      <ManageYourLinks />
      <CustomNfcCardSection />
      <FeaturesGrid />
      <IntegrateSocials />
      <DetailedAnalytics />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  )
}
