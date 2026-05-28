/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Landing from "./views/Landing";
import Admin from "./views/Admin";
import JudgeScore from "./views/JudgeScore";
import SupervisorScore from "./views/SupervisorScore";
import Audience from "./views/Audience";

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/judge/:id" element={<JudgeScore />} />
          <Route path="/supervisor/:id" element={<SupervisorScore />} />
          <Route path="/audience" element={<Audience />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
