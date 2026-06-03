import { index, layout, route } from "@react-router/dev/routes";
import type { RouteConfig } from "@react-router/dev/routes";

const routes = [
  layout("./layout.tsx", [
    index("./routes/home/index.tsx"),
    route(":username", "./routes/user/index.tsx"),
  ]),
] satisfies RouteConfig;

export default routes;
