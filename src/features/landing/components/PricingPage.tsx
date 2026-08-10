import { Button } from '@/shared/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

import { offers } from '../data'

export function PricingPage() {
  return (
    <main className="relative mx-auto container mb-20 flex min-h-screen flex-col">
      <div className="mx-auto mb-10 flex flex-col items-center justify-center gap-5 md:mb-8">
        <h1 className="text-center text-3xl font-extrabold lg:text-5xl">One plan, endless possibilities.</h1>
        <p className="px-16 text-center text-lg font-semibold">Powerful features. Simple choice. Freedom included.</p>
      </div>

      <div className="no-scrollbar mx-auto flex gap-x-5 overflow-x-auto px-6">
        {offers.map((offer, index) => (
          <div
            key={index}
            className={`mx-auto flex h-[600px] w-[90%] flex-shrink-0 flex-col items-center justify-center rounded-none p-0 text-white md:w-[350px] ${
              index === 0 ? 'bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] p-1' : 'bg-gradient-to-b from-[#7140EB] to-[#FB8E8E]'
            }`}
          >
            <div className="mx-auto h-56 w-full">
              <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
                <div className="flex w-20 max-w-28 justify-center rounded-full py-0 text-center text-xs font-medium shadow-md shadow-black drop-shadow-md">
                  {offer.type}
                </div>
                <CardHeader className="flex w-full flex-col space-y-0 py-0">
                  <CardTitle className="m-0 flex w-full justify-center p-0 text-center text-2xl font-semibold">{offer.plan}</CardTitle>
                  <CardDescription className="flex w-full justify-center text-center text-xs font-medium text-white">{offer.description}</CardDescription>
                </CardHeader>
              </div>
            </div>
            <div className="w-[85%] bg-white py-0">{index !== 0 ? <Separator className="py-0" /> : null}</div>
            <div className={`flex h-full w-full flex-col items-center justify-between p-5 ${index === 0 ? 'bg-white text-[#7140EB]' : 'bg-transparent text-white'}`}>
              <div className="space-y-1.5">
                {offer.benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img
                      src={index === 0 ? '/assets/icons/dashboard/blue-check.svg' : '/assets/icons/dashboard/white-check.svg'}
                      alt="check icon"
                      width={15}
                      height={15}
                    />
                    <p className="text-xs font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {}}
                className={`shadow-3xl max-h-7 w-24 max-w-28 p-0 text-xs font-semibold ${
                  index === 1 ? 'bg-white text-[#7140EB] hover:bg-gray-100' : index === 2 ? 'bg-white text-[#7140EB] hover:bg-gray-100' : 'text-white'
                }`}
              >
                Get started
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
