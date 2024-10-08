'use client'

import LayoutWithSidebar from '../layout-with-sidebar'
import { Welcome } from '../components/Welcome'

export default function WelcomePage() {
  return (
    <LayoutWithSidebar>
      <Welcome />
    </LayoutWithSidebar>
  )
}
