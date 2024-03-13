import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, User } from "./components";

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    path: "/:username",
    element: <User />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
