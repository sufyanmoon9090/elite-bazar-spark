import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Settings,
  ArrowLeft,
  Bell,
  FolderTree,
  BookOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const ADMIN_BASE = "/admin90";

const mainItems = [
  { title: "Dashboard", url: `${ADMIN_BASE}`, icon: LayoutDashboard },
  { title: "Products", url: `${ADMIN_BASE}/products`, icon: Package },
  { title: "Categories", url: `${ADMIN_BASE}/categories`, icon: FolderTree },
  { title: "Orders", url: `${ADMIN_BASE}/orders`, icon: ShoppingCart },
  { title: "Customers", url: `${ADMIN_BASE}/customers`, icon: Users },
];

const managementItems = [
  { title: "Blog / Guides", url: `${ADMIN_BASE}/blog`, icon: BookOpen },
  { title: "Coupons", url: `${ADMIN_BASE}/coupons`, icon: Tag },
  { title: "Notifications", url: `${ADMIN_BASE}/notifications`, icon: Bell },
  { title: "Reports", url: `${ADMIN_BASE}/reports`, icon: FileText },
  { title: "Settings", url: `${ADMIN_BASE}/settings`, icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === ADMIN_BASE
      ? location.pathname === ADMIN_BASE
      : location.pathname.startsWith(path);

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)}>
          <NavLink to={item.url} end={item.url === ADMIN_BASE} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
            <item.icon className="mr-2 h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && <span className="text-lg font-display font-bold text-gradient-gold">Elite Bazar</span>}
        {!collapsed && <span className="text-xs text-muted-foreground">Admin Panel</span>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{renderItems(mainItems)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{renderItems(managementItems)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
