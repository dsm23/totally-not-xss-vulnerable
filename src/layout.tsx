import { Outlet } from "react-router";
import { SnackbarProvider } from "~/components/snackbar";

import "~/index.css";

const Layout = () => (
  <SnackbarProvider>
    <Outlet />
  </SnackbarProvider>
);

export default Layout;
