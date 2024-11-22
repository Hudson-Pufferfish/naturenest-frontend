"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import UserIcon from "./UserIcon";
import { links } from "@/utils/links";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

function LinksDropdown() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Parse cookies into an object
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });

    setIsAuthenticated(!!cookies["jwt"]);
  }, []);

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
