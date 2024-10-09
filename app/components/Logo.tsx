import Link from 'next/link'
import Image from 'next/image'
import favicon from '../favicon.svg'

export function Logo() {
  return (
    <Link href="/welcome" className="mb-8 inline-block text-2xl font-bold">
      <Image src={favicon.src} alt="favicon" width={32} height={32} />
    </Link>
  )
}
