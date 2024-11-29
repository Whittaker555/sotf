'use client'
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs);
const client = generateClient<Schema>();


const fetchTodos = async () => {
  const { data: todos } = await client.models.Todo.list();
  console.log(todos);
};
const addToDo = async () => {
    const { data: todo } = await client.models.Todo.create({
        content: 'Hello, world!',
        isDone: false,
    });
    console.log(todo);
    };
    
// return a frontend that just says hello
export default function Page() {
  return <div>
    <button onClick={addToDo}>Add Todo</button>
    <button onClick={fetchTodos}>Fetch Todos</button>
  </div>;
}