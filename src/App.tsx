import { BrowserRouter, Route } from "react-router-dom";
import { Home, User } from "./components";

const App = () => (
  <BrowserRouter>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/:username">
      <User />
    </Route>
  </BrowserRouter>
);

export { App };
