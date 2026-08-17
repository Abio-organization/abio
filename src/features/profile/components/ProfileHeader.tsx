import { BadgeCheck, Check, MapPin, Pencil, User as UserIcon, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import type { User } from '@/features/auth/types'

import { LocationInput } from '@/features/profile/components/LocationInput'
import { useUpdateProfile, useUpdateProfileAvatar } from '@/features/profile/hooks/use-profile'

interface UseInlineEditOptions {
  commitOnEnter?: boolean
}

function useInlineEdit(initialValue: string, onCommit: (value: string) => void, options: UseInlineEditOptions = {}) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const savedValue = useRef(initialValue)
  const skipBlurSave = useRef(false)

  useEffect(() => {
    savedValue.current = initialValue
    if (!isEditing) setValue(initialValue)
  }, [initialValue, isEditing])

  const commit = () => {
    setIsEditing(false)
    const trimmed = value.trim()
    if (trimmed === savedValue.current) return
    savedValue.current = trimmed
    onCommit(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (options.commitOnEnter && e.key === 'Enter') {
      e.preventDefault()
      commit()
    }
    if (e.key === 'Escape') {
      skipBlurSave.current = true
      setValue(savedValue.current)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    if (skipBlurSave.current) {
      skipBlurSave.current = false
      return
    }
    commit()
  }

  return { isEditing, startEditing: () => setIsEditing(true), value, setValue, handleKeyDown, handleBlur }
}

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const updateProfileMutation = useUpdateProfile()
  const updateAvatarMutation = useUpdateProfileAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState(user.profile?.avatarUrl ?? null)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [locationDraft, setLocationDraft] = useState(user.profile?.location ?? '')

  useEffect(() => {
    setAvatarPreview(user.profile?.avatarUrl ?? null)
  }, [user.profile?.avatarUrl])

  const saveDisplayName = (displayName: string) => {
    updateProfileMutation.mutate(
      { displayName: displayName || user.name },
      {
        onSuccess: () => toast.success('Name updated'),
        onError: (error) => toast.error('Could not update name', { description: getApiErrorMessage(error) }),
      },
    )
  }

  const saveBio = (bio: string) => {
    updateProfileMutation.mutate(
      { bio },
      {
        onSuccess: () => toast.success('Bio updated'),
        onError: (error) => toast.error('Could not update bio', { description: getApiErrorMessage(error) }),
      },
    )
  }

  const nameEdit = useInlineEdit(user.name, saveDisplayName, { commitOnEnter: true })
  const bioEdit = useInlineEdit(user.profile?.bio ?? '', saveBio)

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }
    setAvatarPreview(URL.createObjectURL(file))
    updateAvatarMutation.mutate(file, {
      onSuccess: () => toast.success('Avatar updated'),
      onError: (error) => toast.error('Could not update avatar', { description: getApiErrorMessage(error) }),
    })
  }

  const handleLocationEdit = () => {
    setLocationDraft(user.profile?.location ?? '')
    setIsEditingLocation(true)
  }

  const handleLocationSave = () => {
    const trimmed = locationDraft.trim()
    setIsEditingLocation(false)
    if (trimmed === (user.profile?.location ?? '')) return
    updateProfileMutation.mutate(
      { location: trimmed },
      {
        onSuccess: () => toast.success('Location updated'),
        onError: (error) => toast.error('Could not update location', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <div className="flex items-center gap-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
      <button
        type="button"
        onClick={handleAvatarClick}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#331400]/15 shadow-md dark:border-[#F5EEE4]/15"
        title="Change profile picture"
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#FED45C]">
            <UserIcon className="h-8 w-8 text-[#331400]" />
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="group flex items-center gap-1.5">
          {nameEdit.isEditing ? (
            <input
              autoFocus
              value={nameEdit.value}
              onChange={(e) => nameEdit.setValue(e.target.value)}
              onKeyDown={nameEdit.handleKeyDown}
              onBlur={nameEdit.handleBlur}
              maxLength={100}
              className="min-w-0 flex-1 border-b border-[#331400] bg-transparent text-xl font-semibold text-[#331400] outline-none md:text-2xl dark:border-[#F5EEE4] dark:text-[#F5EEE4]"
            />
          ) : (
            <>
              <h1 className="truncate text-xl font-semibold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">{user.name}</h1>
              {user.isEmailVerified && <BadgeCheck className="h-5 w-5 shrink-0 fill-[#EA2228] text-white" />}
              <button
                type="button"
                onClick={nameEdit.startEditing}
                className="shrink-0 text-[#331400]/30 opacity-0 group-hover:opacity-100 hover:text-[#331400] dark:text-[#F5EEE4]/30 dark:hover:text-[#F5EEE4]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        {user.profile?.username && <p className="text-xs text-[#666464] md:text-sm dark:text-[#F5EEE4]/50">/{user.profile.username}</p>}

        <div className="group mt-1.5 flex items-start gap-1.5">
          {bioEdit.isEditing ? (
            <textarea
              autoFocus
              value={bioEdit.value}
              onChange={(e) => bioEdit.setValue(e.target.value)}
              onKeyDown={bioEdit.handleKeyDown}
              onBlur={bioEdit.handleBlur}
              maxLength={200}
              rows={2}
              className="min-w-0 flex-1 resize-none border-b border-[#331400] bg-transparent text-sm text-[#331400] outline-none dark:border-[#F5EEE4] dark:text-[#F5EEE4]"
            />
          ) : (
            <>
              <p className="min-w-0 flex-1 text-sm text-[#331400]/80 dark:text-[#F5EEE4]/70">
                {user.profile?.bio || <span className="text-[#666464]/50 italic">Add a short bio</span>}
              </p>
              <button
                type="button"
                onClick={bioEdit.startEditing}
                className="shrink-0 text-[#331400]/30 opacity-0 group-hover:opacity-100 hover:text-[#331400] dark:text-[#F5EEE4]/30 dark:hover:text-[#F5EEE4]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        <div className="mt-2">
          {isEditingLocation ? (
            <div className="flex items-center gap-2">
              <div className="max-w-55 flex-1">
                <LocationInput value={locationDraft} onChange={setLocationDraft} />
              </div>
              <button type="button" onClick={handleLocationSave} className="text-green-600 hover:text-green-700">
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingLocation(false)}
                className="text-[#331400]/40 hover:text-[#331400] dark:text-[#F5EEE4]/40 dark:hover:text-[#F5EEE4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLocationEdit}
              className="flex w-fit items-center gap-1.5 border border-[#331400]/15 px-2 py-1 text-xs font-medium text-[#666464] hover:border-[#331400]/40 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4]/50"
            >
              <MapPin className="h-3 w-3" />
              <span className="max-w-45 truncate">{user.profile?.location || 'Add location'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
