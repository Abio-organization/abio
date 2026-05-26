import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <p className="text-sm text-muted-foreground">
          Onboarding flow will branch from here.
        </p>
      </div>
      <form className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" name="email" autoComplete="email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
            />
          </Field>
        </FieldGroup>
        <Button type="submit">Create account</Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
