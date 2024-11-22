export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background flex justify-center pt-24">{children}</div>;
}
