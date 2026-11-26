// After a new deploy, the old hashed JS files (e.g. /assets/statistics-abc123.js)
// no longer exist. A tab that was opened before the deploy still asks for them,
// and the import fails. The fix is to reload the page once so the browser
// fetches the new index.html and the new file names.

const RELOAD_KEY = 'abio:chunk-reload-at'
// Don't reload again within this window, so a real outage can't cause a reload loop.
const RELOAD_COOLDOWN_MS = 10_000

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|is not a valid JavaScript MIME type|Unable to preload CSS/i.test(
    message,
  )
}

/** Reloads the page once. Returns false if we already reloaded very recently. */
export function reloadOnceForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    // sessionStorage can be blocked (private mode); reloading once is still fine.
  }
  window.location.reload()
  return true
}

export function installChunkReloadHandler() {
  // Vite fires this event when a lazy-loaded file can't be loaded.
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadOnceForNewVersion()) event.preventDefault()
  })
}
