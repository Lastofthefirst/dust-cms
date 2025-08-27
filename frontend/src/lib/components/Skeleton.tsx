import { Component } from 'solid-js';

interface SkeletonProps {
  class?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  height?: string;
  width?: string;
  lines?: number;
}

export const Skeleton: Component<SkeletonProps> = (props) => {
  const variant = () => props.variant || 'rectangular';
  const height = () => props.height || '1rem';
  const width = () => props.width || '100%';
  const lines = () => props.lines || 1;

  const getVariantClasses = () => {
    switch (variant()) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  if (variant() === 'text' && lines() > 1) {
    return (
      <div class={`space-y-2 ${props.class || ''}`}>
        {Array.from({ length: lines() }, (_, i) => (
          <div
            class={`skeleton ${getVariantClasses()}`}
            style={{ 
              height: height(),
              width: i === lines() - 1 ? '75%' : width()
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      class={`skeleton ${getVariantClasses()} ${props.class || ''}`}
      style={{ height: height(), width: width() }}
    />
  );
};

// Site card skeleton for the homepage
export const SiteCardSkeleton: Component = () => (
  <div class="card p-6">
    <Skeleton variant="rectangular" height="12rem" class="mb-4" />
    <Skeleton variant="text" height="1.5rem" class="mb-2" />
    <Skeleton variant="text" height="1rem" width="60%" class="mb-4" />
    <Skeleton variant="text" height="0.875rem" width="40%" class="mb-4" />
    <Skeleton variant="rectangular" height="2.5rem" width="7rem" />
  </div>
);

// Content schema skeleton for dashboard
export const SchemaCardSkeleton: Component = () => (
  <div class="card p-6">
    <Skeleton variant="text" height="1.25rem" class="mb-2" />
    <Skeleton variant="text" height="0.875rem" lines={2} class="mb-4" />
    <Skeleton variant="text" height="0.75rem" width="50%" class="mb-4" />
    <div class="space-y-2">
      <Skeleton variant="rectangular" height="2.5rem" />
      <Skeleton variant="rectangular" height="2.5rem" />
    </div>
  </div>
);