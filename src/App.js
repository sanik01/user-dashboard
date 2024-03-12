import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserList from "../src/userList";
import "./App.css";

import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<UserList />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
