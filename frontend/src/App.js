// Engy Masoud, 4/13/26, IT302452, Phase 4, eam64@njit.edu
import React, { useState, useCallback } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import BooksList from "./components/BooksList";
import Book from "./components/book";
import AddCritique from "./components/addCritique";
import Login from "./components/login";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function App() {
  const [user, setUser] = useState(null);

  const loginSetter = useCallback(user => {
    setUser(user);
  }, [setUser]);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Books - eam64</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to={"/eam64_books"}>
              Books
            </Nav.Link>
            <Nav.Link as={NavLink} to={user ? "" : "/login"}
              onClick={user ? logout : null}>
              {user ? "Logout User" : "Login"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<BooksList />}></Route>
        <Route path="/eam64_books" element={<BooksList />}></Route>
        <Route path="/eam64_books/:id" element={<Book user={user} />}></Route>
        <Route
          path="/eam64_books/:id/critique"
          element={<AddCritique user={user} />}
        ></Route>
        <Route path="/login" element={<Login user={user} loginSetter={loginSetter} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
