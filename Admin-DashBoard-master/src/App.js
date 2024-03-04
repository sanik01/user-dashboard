import "./App.css";

import UserList from "../src/userList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
