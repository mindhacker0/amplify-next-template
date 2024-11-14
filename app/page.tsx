"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import UserInfo from "./components/UserInfo";
import CreateGroup from "./components/Group/create";
import GroupList from "./components/Group/groups";

Amplify.configure(outputs,{ssr: true});

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [curGroupId,setCurGroupId] = useState<string>("");
  function listTodos() {
    client.models.Todo.observeQuery({filter:{groupId:{eq:curGroupId}}}).subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, [curGroupId]);

  function createTodo() {
    client.models.Todo.create({
      groupId:curGroupId,
      content: window.prompt("Todo content"),
    });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  return (
    <main style={{width:"100%",height:"100vh"}}>
      <div style={{display:"flex",height:"100%"}}>
        {/* left bar */}
        <div style={{width:"300px",padding: "20px"}}>
          <UserInfo />
          <CreateGroup />
          <GroupList setCurGroupId={setCurGroupId}/>
        </div>
        {/* right bar */}
        <div style={{borderLeft:"1px solid #fff",flex:"1 1 0%",padding: "20px"}}>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{todo.content}</span>
                <span onClick={() => deleteTodo(todo.id)}>X</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
