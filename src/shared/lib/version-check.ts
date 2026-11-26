// Keeps open tabs in sync with the latest deploy.
//
// Every build gets a unique version id. It is baked into the JS (__APP_VERSION__)
// and also published as /version.json. While the app is open we quietly check
// /version.json. If it no longer matches, a new version was deployed and the
// old page's lazy-loaded files are gone. So the next time the user clicks a
// link, we do a normal full page load of that link instead of an in-app
// navigation. The user lands on the page they clicked, on the new version,
// and never sees the "is not a valid JavaScript MIME type" error.

import type { AnyRouter } from '@tanstack/react-router'

const CHECK_EVERY_MS = 60_000
const MIN_GAP_MS = 10_000
const RELOADED_FOR_KEY = 'abio:reloaded-for-version'

let newVersion: string | null = null
let lastCheck = 0

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { version?: unknown }
    return typeof data.version === 'string' ? data.version : null
  } catch {
    return null // offline or blocked: just try again later
  }
}

async function checkForNewVersion() {
  if (newVersion || Date.now() - lastCheck < MIN_GAP_MS) return
  lastCheck = Date.now()
  const latest = await fetchLatestVersion()
  if (!latest || latest === __APP_VERSION__) return

  // If we already reloaded for this exact version and still got the old one
  // (e.g. a CDN edge hasn't caught up), don't keep forcing full page loads.
  try {
    if (sessionStorage.getItem(RELOADED_FOR_KEY) === latest) return
  } catch {
    // ignore
  }

  newVersion = latest
  // Ask the installed app (service worker) to fetch the new version now, so
  // the full page load on the next click is served the new files.
  navigator.serviceWorker
    ?.getRegistration()
    .then((reg) => reg?.update())
    .catch(() => {})
}

export function startVersionWatcher(router: AnyRouter) {
  if (!import.meta.env.PROD) return

  void checkForNewVersion()
  window.setInterval(() => void checkForNewVersion(), CHECK_EVERY_MS)
  window.addEventListener('focus', () => void checkForNewVersion())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForNewVersion()
  })

  router.subscribe('onBeforeNavigate', ({ toLocation, pathChanged }) => {
    if (!newVersion || !pathChanged) return
    try {
      sessionStorage.setItem(RELOADED_FOR_KEY, newVersion)
    } catch {
      // ignore
    }
    window.location.assign(toLocation.href)
  })
}
