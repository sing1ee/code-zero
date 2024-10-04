import { SVGProps } from 'react'

export default function IconRefresh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.33 2.67v4h-4" />
      <path d="M0.67 13.33v-4h4" />
      <path d="M2.34 6a6 6 0 019.9-2.24L15.33 6.67M0.67 9.33l3.09 2.91A6 6 0 0013.66 10" />
    </svg>
  )
}
