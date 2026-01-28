// Router configuration
import { createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import Tool from "@/pages/Tool"
import Support from "@/pages/Support"
import Privacy from "@/pages/Privacy"
import Contact from "@/pages/Contact"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/tools/:toolId", element: <Tool /> },
  { path: "/support", element: <Support /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/contact", element: <Contact /> },
])
