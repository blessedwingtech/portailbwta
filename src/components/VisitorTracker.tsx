'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Éviter d'enregistrer les visites admin dans l'audience publique du site
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    const timer = setTimeout(() => {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname })
      }).catch(() => {
        // Enregistrement silencieux
      })
    }, 1200) // Petit délai pour s'assurer que c'est un vrai visiteur qui charge la page

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
