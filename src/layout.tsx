import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";

import "~/index.css";

const Layout = () => (
  <>
    <Outlet />
    <Toaster />
  </>
);

export default Layout;
