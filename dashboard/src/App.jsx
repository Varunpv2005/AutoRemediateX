import React from "react";
import Dashboard from "./pages/Dashboard";
import { globalStyles } from "./utils/theme";

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <Dashboard />
    </>
  );
}
