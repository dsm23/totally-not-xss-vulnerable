import { BrowserRouter, Route } from "react-router-dom";
import { GlobalStyles } from "twin.macro";

import { Home, User } from "./components";

const App = () => (
  <BrowserRouter>
    <GlobalStyles />
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/:username">
      <User />
    </Route>
  </BrowserRouter>
);

export { App };
