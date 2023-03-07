import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Main from "./pages/Main";
import Repo from "./pages/Repo";

export default function RouteElement() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/repo/:repo" element={<Repo />} />
      </Routes>
    </Router>
  );
}
