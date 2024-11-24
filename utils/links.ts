type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/favorites ", label: "favorites" },
  { href: "/bookings ", label: "bookings" },
  { href: "/reviews ", label: "reviews" },
  { href: "/reservations ", label: "reservations" },
  { href: "/properties/create ", label: "create property" },
  { href: "/properties/my", label: "my properties" },
  { href: "/admin", label: "admin" },
  { href: "/profile ", label: "profile" },
];
