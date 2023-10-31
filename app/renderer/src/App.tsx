import React from "react";
import {Route, Routes} from "react-router-dom";
import ClipBoard from "./pages/main/clipBoard";

export const App = () => {
    return <Routes>
      <Route path="/" element={<ClipBoard />} />
    </Routes>
}
