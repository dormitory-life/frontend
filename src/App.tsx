import { BrowserRouter, Routes, Route } from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import DormitoriesPage from "./pages/DormitoriesPage"
import DormitoryPage from "./pages/DormitoryPage"
import FeedPage from "./pages/FeedPage"
import ChatPage from "./pages/ChatPage"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/dormitories" element={<DormitoriesPage />} />

        <Route path="/dormitories/:id" element={<DormitoryPage />} />

        <Route path="/dormitories/:id/feed" element={<FeedPage />} />

        <Route path="/dormitories/:id/chat" element={<ChatPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App