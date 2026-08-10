import { useEffect, useRef, useState } from 'react'

import { Field, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'

interface NominatimResult {
  display_name: string
}

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'AbioWeb/1.0 (location autocomplete)'

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '0',
        limit: '5',
      })
      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { 'User-Agent': USER_AGENT },
      })
      if (!res.ok) return
      const data = (await res.json()) as NominatimResult[]
      setSuggestions(data)
      setOpen(true)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Field>
      <FieldLabel htmlFor="location">Location</FieldLabel>
      <Input
        id="location"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="City, country"
      />
      {open && suggestions.length > 0 ? (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover py-1 shadow-md">
          {suggestions.map((item) => (
            <li key={item.display_name}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  setQuery(item.display_name)
                  onChange(item.display_name)
                  setOpen(false)
                }}
              >
                {item.display_name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      </Field>
    </div>
  )
}
