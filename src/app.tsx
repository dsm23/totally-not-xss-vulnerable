import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, User } from "./components";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/:username" element={<User />} />
    </Routes>
  </BrowserRouter>
);

export default App;
