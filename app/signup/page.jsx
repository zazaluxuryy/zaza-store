import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Create Account', robots: { index: false } }

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}
