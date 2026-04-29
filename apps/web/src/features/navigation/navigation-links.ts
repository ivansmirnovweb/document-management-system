import type { AuthenticatedUser } from "@document-flow/shared";
import { UserRole } from "@document-flow/shared";

export type MainNavigationLink = {
  href: string;
  label: string;
  requiresAuth: boolean;
  roles?: UserRole[];
};

const MAIN_NAVIGATION_LINKS: MainNavigationLink[] = [
  {
    href: "/",
    label: "Публичные документы",
    requiresAuth: false,
  },
  {
    href: "/dashboard",
    label: "Рабочая область",
    requiresAuth: true,
  },
  {
    href: "/dashboard/reports",
    label: "Отчёты",
    requiresAuth: true,
    roles: [UserRole.ROOT],
  },
  {
    href: "/dashboard/root",
    label: "Root",
    requiresAuth: true,
    roles: [UserRole.ROOT],
  },
];

export function canAccessMainNavigationLink(
  user: AuthenticatedUser | null,
  link: MainNavigationLink,
): boolean {
  if (link.requiresAuth && !user) {
    return false;
  }

  if (!link.roles || link.roles.length === 0) {
    return true;
  }

  return Boolean(user && link.roles.includes(user.role));
}

export function getVisibleMainNavigationLinks(user: AuthenticatedUser | null) {
  return MAIN_NAVIGATION_LINKS.filter((link) => canAccessMainNavigationLink(user, link));
}
