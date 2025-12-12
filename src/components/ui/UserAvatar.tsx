import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

/**
 * Extracts initials from a name string
 * Examples: "Arjun Reddy" -> "AR", "John" -> "J", "Mary Jane Watson" -> "MJ"
 */
const getInitials = (name: string): string => {
  if (!name || name.trim().length === 0) return 'U';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // Single name - return first letter
    return parts[0][0].toUpperCase();
  } else {
    // Multiple names - return first letter of first and last name
    const first = parts[0][0].toUpperCase();
    const last = parts[parts.length - 1][0].toUpperCase();
    return first + last;
  }
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  image,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const initials = getInitials(name);
  const showImage = image && !imageError;
  const showInitials = !showImage;
  
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white overflow-hidden',
        sizeClass,
        showInitials && 'bg-[#DC8924]', // NMB Orange background for initials
        className
      )}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {showImage ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : null}
      {showInitials && (
        <span className="select-none">{initials}</span>
      )}
    </div>
  );
};

