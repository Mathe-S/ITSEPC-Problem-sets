import "./App.css";
import { Routes, Route } from "react-router-dom";
import PracticePage from "./pages/PracticePage";
import DeckManagementPage from "./components/deck/DeckManagement";
import ProgressPage from "./components/progress/ProgressDisplay";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="practice" element={<PracticePage />} />
        <Route path="decks" element={<DeckManagementPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}

export default App;
