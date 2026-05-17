import HeroSection    from '@/components/modules/HeroSection'
import TopCategories  from '@/components/modules/TopCategories'
import BestDeals      from '@/components/modules/BestDeals'
import ChooseByBrand  from '@/components/modules/ChooseByBrand'
import Promotions     from '@/components/modules/Promotions'
import WeeklyPopular  from '@/components/modules/WeeklyPopular'
import Services       from '@/components/modules/Services'
import Footer         from '@/components/modules/Footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TopCategories />
      <BestDeals />
      <ChooseByBrand />
      <Promotions />
      <WeeklyPopular />
      <Services />
      <Footer />
    </>
  )
}

