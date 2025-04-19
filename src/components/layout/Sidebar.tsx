
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  BarChart4,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useMobile } from "@/hooks/use-mobile";

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart4,
    },
    {
      name: "Settings",
      href: "/profile",
      icon: Settings,
    },
  ];

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "border-r bg-background z-10",
        isOpen
          ? "fixed md:sticky top-0 w-[240px] h-screen"
          : "fixed top-0 w-0 md:w-[80px] h-screen"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between h-14 border-b px-4 py-2">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 font-semibold",
              !isOpen && "md:hidden"
            )}
          >
            <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <span>TaskMaster</span>
          </Link>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <div className="hidden md:block">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent
          forceMount
          className={cn(
            "flex flex-col gap-2 p-2 h-full",
            !isOpen && "hidden md:flex md:items-center"
          )}
        >
          <div className="flex flex-col gap-2 flex-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex justify-start gap-2 w-full",
                      !isOpen && "md:justify-center md:px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className={cn(!isOpen && "md:hidden")}>
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <Link to="/profile">
              <Button
                variant="ghost"
                className={cn(
                  "flex justify-start gap-2 w-full",
                  !isOpen && "md:justify-center md:px-2"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {getInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
                <span className={cn(!isOpen && "md:hidden")}>Profile</span>
              </Button>
            </Link>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
