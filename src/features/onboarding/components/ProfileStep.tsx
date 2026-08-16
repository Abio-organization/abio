import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Upload, User as UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { cn } from '@/shared/lib/utils'
import { toast } from '@/shared/lib/toast'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { LocationInput, useUpdateProfile, useUpdateProfileAvatar } from '@/features/profile'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

const profileStepSchema = z.object({
  bio: z.string().min(1, 'Please enter your bio').max(200, 'Bio must be 200 characters or less'),
  location: z.string().min(1, 'Please select your location'),
})

type ProfileStepValues = z.infer<typeof profileStepSchema>

export function ProfileStep() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const updateAvatarMutation = useUpdateProfileAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileStepValues>({
    resolver: zodResolver(profileStepSchema),
    defaultValues: { bio: '', location: '' },
  })

  useEffect(() => {
    if (!user?.profile) return
    reset({
      bio: user.profile.bio ?? '',
      location: user.profile.location ?? '',
    })
    setAvatarPreview(user.profile.avatarUrl)
  }, [user, reset])

  const bio = watch('bio') ?? ''

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
      onError: (error) => toast.error('Could not upload avatar', { description: getApiErrorMessage(error) }),
    })
  }

  const onSubmit = (values: ProfileStepValues) => {
    updateProfileMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/onboarding/complete' }),
      onError: (error) => toast.error('Could not save profile', { description: getApiErrorMessage(error) }),
    })
  }

  return (
    <OnboardingLayout step={6}>
      <div className="flex flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">Complete your profile</h1>
            <p className="mt-2 text-sm text-[#666464] dark:text-[#F5EEE4]/60">Add a bio and location so people know it's you.</p>
          </div>

          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#331400] bg-[#FED45C] dark:border-[#F5EEE4]"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-10 w-10 text-[#331400]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 rounded-full bg-[#331400] p-1.5 text-[#FED45C] shadow-lg hover:bg-[#4a2c1a]"
              >
                <Upload className="h-3.5 w-3.5" />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <p className="text-xs text-[#666464] dark:text-[#F5EEE4]/60">
              {updateAvatarMutation.isPending ? 'Uploading avatar…' : 'Click to upload your profile picture'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <div className="relative">
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself…"
                  maxLength={200}
                  rows={4}
                  aria-invalid={!!errors.bio}
                  {...register('bio')}
                />
                <span className={cn('absolute right-2.5 bottom-2 text-xs', bio.length > 180 ? 'text-red-500' : 'text-[#666464]/50')}>
                  {bio.length}/200
                </span>
              </div>
              <FieldError>{errors.bio?.message}</FieldError>
            </Field>

            <div>
              <LocationInput value={watch('location')} onChange={(value) => setValue('location', value, { shouldValidate: true })} />
              <FieldError>{errors.location?.message}</FieldError>
            </div>

            <AuthSubmitButton pending={updateProfileMutation.isPending} pendingLabel="Saving…" className="mt-2">
              Continue
            </AuthSubmitButton>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  )
}
