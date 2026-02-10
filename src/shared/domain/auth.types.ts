/**
 * Shared kernel: authenticated user type used by presentation/application.
 * Infrastructure (auth.lib) maps from better-auth Session.user to this type.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  image: string | null;
}
