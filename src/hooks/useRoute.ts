import { useEffect, useState } from 'react'

export type Route = '/' | '/tutorial' | '/play'

function readRoute(): Route {
  return window.location.pathname === '/play' ? '/play' : window.location.pathname === '/tutorial' ? '/tutorial' : '/'
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute)
  useEffect(() => {
    const onPopState = () => setRoute(readRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  const navigate = (next: Route) => { window.history.pushState({}, '', next); setRoute(next) }
  return { route, navigate }
}
