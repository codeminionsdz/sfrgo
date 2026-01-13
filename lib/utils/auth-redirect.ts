/**
 * Auth redirect utilities for handling authentication flows
 */

/**
 * Redirects to login page with a return URL
 * @param redirectTo - The URL to redirect to after successful login
 */
export function redirectToLogin(redirectTo?: string) {
  const currentUrl = redirectTo || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const loginUrl = `/login?redirectTo=${encodeURIComponent(currentUrl)}`
  
  if (typeof window !== 'undefined') {
    window.location.href = loginUrl
  }
  
  return loginUrl
}

/**
 * Gets the redirect URL from query parameters
 * @param searchParams - URL search parameters
 * @returns The decoded redirect URL or null
 */
export function getRedirectUrl(searchParams: URLSearchParams | null): string | null {
  if (!searchParams) return null
  return searchParams.get('redirectTo')
}

/**
 * Checks if a user is authenticated and redirects to login if not
 * @param userId - The user ID to check (null if not authenticated)
 * @param redirectTo - Optional custom redirect URL
 * @returns true if authenticated, false otherwise
 */
export function requireAuth(userId: string | null | undefined, redirectTo?: string): boolean {
  if (!userId) {
    redirectToLogin(redirectTo)
    return false
  }
  return true
}
