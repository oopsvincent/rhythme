// lib/slug.ts

/**
 * Generate a clean URL-safe slug from a title
 * - Converts to lowercase
 * - Replaces spaces with dashes
 * - Removes special characters (commas, dots, quotes, etc.)
 * - Removes multiple consecutive dashes
 * - Trims leading/trailing dashes
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with dashes
    .replace(/[\s_]+/g, '-')
    // Remove special characters except dashes
    .replace(/[^\w\-]/g, '')
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
}

/**
 * Format a slug back to a readable title
 * - Replaces dashes with spaces
 * - Capitalizes first letter of each word
 * - Removes trailing numeric ID if present
 */
export function formatSlugToTitle(slug: string): string {
  const parts = slug.split('-')
  
  // Remove trailing numeric ID (task_id)
  const lastPart = parts[parts.length - 1]
  if (/^\d+$/.test(lastPart)) {
    parts.pop()
  }
  
  return parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
