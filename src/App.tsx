import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MilestonesPage from "./pages/milestones";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MilestonesPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
