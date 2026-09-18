import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Sign In', robots: { index: false } }

export default function SignInPage() {
  return <AuthForm mode="signin" />
}
