import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import About from "./componets/About";
import Footer from "./componets/Footer";
import Home from "./componets/Home";
import Navbar from "./componets/Navbar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Home />
          <Footer />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <Navbar />
          <About />
          <Footer />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
