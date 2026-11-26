import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'
import { installChunkReloadHandler } from '@/shared/lib/chunk-reload'
import { startVersionWatcher } from '@/shared/lib/version-check'
import '@/styles/globals.css'

installChunkReloadHandler()
startVersionWatcher(router)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
