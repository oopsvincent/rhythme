// app/(dashboard)/settings/loading.tsx
export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />
      </div>
      <div className="h-10 w-32 bg-muted animate-pulse rounded" />
    </div>
  )
}
