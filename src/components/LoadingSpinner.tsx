interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gray'
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  fullScreen = false 
}: Props) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-300'
  }

  return (
    <div className={fullScreen ? 'fixed inset-0 flex items-center justify-center bg-white/80' : ''}>
      <div
        className={`
          border-2 rounded-full animate-spin
          ${sizeClasses[size]}
          border-t-transparent
          ${colorClasses[color]}
        `}
      />
    </div>
  )
} 