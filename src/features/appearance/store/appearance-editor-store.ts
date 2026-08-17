import { create } from 'zustand'

import type { ButtonStyle, FontStyle } from '@/features/appearance/types'

const HISTORY_DEBOUNCE_MS = 500
const HISTORY_LIMIT = 50

export interface EditorSnapshot {
  buttonStyle: ButtonStyle
  fontStyle: FontStyle
  /** String-encoded wallpaper: `fill:#hex`, `gradient:#a:#b`, or an image URL/blob URL. */
  wallpaper: string
}

function snapshotsEqual(a: EditorSnapshot | null, b: EditorSnapshot | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

interface AppearanceEditorState {
  current: EditorSnapshot
  past: EditorSnapshot[]
  future: EditorSnapshot[]
  savedSnapshot: EditorSnapshot | null
  /** Set when a preset theme is applied; cleared the moment the user hand-tweaks anything after. */
  selectedThemeId: string | null
  /** Staged image file, uploaded only at Save time — not part of undo history (files aren't comparable/serializable). */
  pendingWallpaperFile: File | null
  isDirty: boolean
  canUndo: boolean
  canRedo: boolean

  hydrate: (snapshot: EditorSnapshot, selectedThemeId: string | null) => void
  update: (patch: Partial<EditorSnapshot>) => void
  applyPreset: (snapshot: EditorSnapshot, themeId: string) => void
  setPendingWallpaperFile: (file: File | null) => void
  undo: () => void
  redo: () => void
  discard: () => void
  markSaved: (snapshot?: EditorSnapshot) => void
}

// Debounce plumbing lives outside the store's observable state — it's not UI state, just timing.
let historyBase: EditorSnapshot | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function clearPendingCommit() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  historyBase = null
}

const DEFAULT_SNAPSHOT: EditorSnapshot = {
  buttonStyle: { borderRadius: '12px', backgroundColor: '#331400', borderColor: 'transparent', opacity: 1, boxShadow: 'none' },
  fontStyle: { fontFamily: "'Inter', sans-serif", fillColor: '#ffffff', strokeColor: '#000000', opacity: 1, weight: 'regular' },
  wallpaper: 'fill:#331400',
}

export const useAppearanceEditorStore = create<AppearanceEditorState>((set, get) => ({
  current: DEFAULT_SNAPSHOT,
  past: [],
  future: [],
  savedSnapshot: null,
  selectedThemeId: null,
  pendingWallpaperFile: null,
  isDirty: false,
  canUndo: false,
  canRedo: false,

  hydrate: (snapshot, selectedThemeId) => {
    clearPendingCommit()
    set({
      current: snapshot,
      past: [],
      future: [],
      savedSnapshot: snapshot,
      selectedThemeId,
      pendingWallpaperFile: null,
      isDirty: false,
      canUndo: false,
      canRedo: false,
    })
  },

  update: (patch) => {
    const state = get()
    if (historyBase === null) historyBase = state.current
    const next = { ...state.current, ...patch }

    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      const base = historyBase
      historyBase = null
      debounceTimer = null
      if (!base) return
      set((s) => ({ past: [...s.past, base].slice(-HISTORY_LIMIT) }))
    }, HISTORY_DEBOUNCE_MS)

    set({
      current: next,
      future: [],
      selectedThemeId: null, // any manual tweak detaches from the applied preset
      isDirty: !snapshotsEqual(next, state.savedSnapshot),
      canUndo: true,
      canRedo: false,
    })
  },

  applyPreset: (snapshot, themeId) => {
    clearPendingCommit()
    set((state) => ({
      current: snapshot,
      past: [...state.past, state.current].slice(-HISTORY_LIMIT),
      future: [],
      selectedThemeId: themeId,
      pendingWallpaperFile: null,
      isDirty: !snapshotsEqual(snapshot, state.savedSnapshot),
      canUndo: true,
      canRedo: false,
    }))
  },

  setPendingWallpaperFile: (file) => set({ pendingWallpaperFile: file }),

  undo: () => {
    const base = historyBase
    clearPendingCommit()
    set((state) => {
      const past = base ? [...state.past, base] : state.past
      if (past.length === 0) return state
      const previous = past[past.length - 1]
      const newPast = past.slice(0, -1)
      return {
        current: previous,
        past: newPast,
        future: [state.current, ...state.future],
        selectedThemeId: null,
        isDirty: !snapshotsEqual(previous, state.savedSnapshot),
        canUndo: newPast.length > 0,
        canRedo: true,
      }
    })
  },

  redo: () => {
    clearPendingCommit()
    set((state) => {
      if (state.future.length === 0) return state
      const next = state.future[0]
      const newFuture = state.future.slice(1)
      return {
        current: next,
        past: [...state.past, state.current].slice(-HISTORY_LIMIT),
        future: newFuture,
        selectedThemeId: null,
        isDirty: !snapshotsEqual(next, state.savedSnapshot),
        canUndo: true,
        canRedo: newFuture.length > 0,
      }
    })
  },

  discard: () => {
    clearPendingCommit()
    set((state) => ({
      current: state.savedSnapshot ?? state.current,
      past: [],
      future: [],
      pendingWallpaperFile: null,
      isDirty: false,
      canUndo: false,
      canRedo: false,
    }))
  },

  markSaved: (snapshot) => {
    clearPendingCommit()
    set((state) => {
      const saved = snapshot ?? state.current
      return {
        current: saved,
        savedSnapshot: saved,
        past: [],
        future: [],
        pendingWallpaperFile: null,
        isDirty: false,
        canUndo: false,
        canRedo: false,
      }
    })
  },
}))
