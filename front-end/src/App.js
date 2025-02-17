import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styled from "styled-components";
import CreateTask from "./CreateTask";
import bgImage from "./assets/hello.jpg"; // ✅ Import your local image

// 🌟 Styled Container with Background Image
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${bgImage}) center/cover no-repeat;
  background-attachment: fixed;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.08);
  }
`;

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 style={{ color: "white", textAlign: "center" }}>🚀 Hyperfocus Timer & Task Manager 🚀</h1>
                <Link to="/create-task">
                  <ActionButton>Create Task</ActionButton>
                </Link>
              </>
            }
          />
          <Route path="/create-task" element={<CreateTask />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
