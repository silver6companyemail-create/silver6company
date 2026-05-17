import Header from '@/components/modules/Header'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">{children}</main>
    </>
  )
}
