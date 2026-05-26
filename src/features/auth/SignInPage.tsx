import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Auth forms will use react-hook-form + zod next.
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
              autoComplete="current-password"
            />
          </Field>
        </FieldGroup>
        <Button type="submit">Sign in</Button>
      </form>
      <p className="text-sm text-muted-foreground">
        No account?{' '}
        <Link to="/auth/sign-up" className="font-medium text-foreground underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
