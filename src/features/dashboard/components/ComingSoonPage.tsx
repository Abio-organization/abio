interface ComingSoonPageProps {
  title: string
  description: string
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-[#331400] dark:text-[#F5EEE4]">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-[#666464] dark:text-[#F5EEE4]/60">{description}</p>
    </div>
  )
}
