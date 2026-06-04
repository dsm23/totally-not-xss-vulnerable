import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";

import "~/index.css";

const Layout = () => (
  <TooltipProvider>
    <Outlet />
    <Toaster />
  </TooltipProvider>
);

export default Layout;
