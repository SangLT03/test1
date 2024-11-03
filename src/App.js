import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Grades from "./components/Grades";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/student" element={<Home />} />
          <Route path="student/:studentId" element={<Grades />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
