import { useState } from 'react'

import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { LocationInput } from '@/features/profile/components/LocationInput'

export function ProfileContent() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="displayName">Display name</FieldLabel>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        />
      </Field>
      <LocationInput value={location} onChange={setLocation} />
      <Field>
        <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
        <Input id="avatar" type="file" accept="image/*" />
      </Field>
    </FieldGroup>
  )
}
