import React, { useState } from "react";
import styled from "styled-components";
import bgImage from "./assets/hello.jpg"; // ✅ Import your local image

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${bgImage}) center/cover no-repeat;
  background-attachment: fixed;
`;

const Input = styled.input`
  width: 80%;
  max-width: 500px;
  height: 50px;
  padding: 10px;
  font-size: 1.2rem;
  border: 2px solid white;
  border-radius: 10px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  outline: none;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SubmitButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <Container>
      <h1 style={{ color: "white" }}>🎯 Create Task 🎯</h1>

      <Label>Task Name:</Label>
      <Input
        type="text"
        placeholder="Enter task name..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <Label>Deadline:</Label>
      <Input
        type="date"
        onChange={(e) => setDeadline(e.target.value)}
      />

      <SubmitButton onClick={() => alert(`Task Created: ${taskName}, Deadline: ${deadline}`)}>
        Submit Task
      </SubmitButton>
    </Container>
  );
};

export default CreateTask;
