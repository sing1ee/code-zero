import favicon from '../favicon.svg'
import Image from 'next/image'
export function Logo() {
  return (
    <div className="mb-8 text-2xl font-bold">
      <Image src={favicon.src} alt="favicon" width={32} height={32} />
    </div>
  )
}
