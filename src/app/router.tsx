// Router configuration
import { createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import Tool from "@/pages/Tool"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/tools/:toolId", element: <Tool /> },
])
