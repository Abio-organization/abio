import { ErrorComponent, type ErrorComponentProps } from '@tanstack/react-router'

import { isChunkLoadError, reloadOnceForNewVersion } from '@/shared/lib/chunk-reload'

// If a page's code file is missing because a new version was deployed,
// reload once to pick up the new version instead of showing "Something went wrong!".
export function RouteErrorFallback(props: ErrorComponentProps) {
  if (isChunkLoadError(props.error) && reloadOnceForNewVersion()) return null
  return <ErrorComponent {...props} />
}
