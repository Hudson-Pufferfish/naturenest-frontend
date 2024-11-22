"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import UserIcon from "./UserIcon";
import { links } from "@/utils/links";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getAuthToken } from "@/utils/auth";

function LinksDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status whenever component mounts or route changes
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      setIsAuthenticated(!!token);
    };

    // Check immediately
    checkAuth();

    // Add event listener for storage changes (in case token is modified in another tab)
    window.addEventListener("storage", checkAuth);

    // Add a MutationObserver to watch for cookie changes
    const observer = new MutationObserver(checkAuth);
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("storage", checkAuth);
      observer.disconnect();
    };
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = () => {
    document.cookie = "jwt=; max-age=0; path=/;";
    setIsAuthenticated(false);
    toast({
      description: "Successfully logged out!",
    });
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-w-[100px]">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start" sideOffset={10}>
        {!isAuthenticated ? (
          <>
            <DropdownMenuItem>
              <Link href="/auth/sign-in" className="w-full">
                Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth/register" className="w-full">
                Register
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {links.map((link) => (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className="capitalize w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button className="w-full text-left" onClick={handleLogout}>
                Logout
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
