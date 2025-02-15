import { useState, useEffect } from "react";
import { ethers } from "ethers";

import ToDoList from "./artifacts/contracts/ToDoList.sol/ToDoList.json"// ABI from compiled contract

const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const connectBlockchain = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ToDoList.abi, signer);

        setProvider(provider);
        setContract(contract);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        console.log("Contract Address:", contract.address);
        console.log("Contract ABI:", JSON.stringify(contract.interface.fragments, null, 2));

        var taskCount = 0;
        //const taskCount = await contract.taskCount();
        async function getTaskCount() {
          try {
              taskCount = await contract.taskCount;  // Assuming taskCount is a function
              console.log("Task Count: ", taskCount.toString());
          } catch (error) {
              console.error("Error getting task count: ", error);
          }
        }
      
        getTaskCount();
        const loadedTasks = [];

        for (let i = 1; i <= taskCount; i++) {
          const task = await contract.tasks(i);
          loadedTasks.push(task);
        }

        setTasks(loadedTasks);
      } else {
        alert("Please install MetaMask!");
      }
    };

    connectBlockchain();
  }, []);

  const addTask = async () => {
    if (!input) return;
    const tx = await contract.createTask(input);
    await tx.wait();

    setTasks([...tasks, { id: tasks.length + 1, content: input, completed: false }]);
    setInput("");
  };

  const toggleTask = async (id) => {
    const tx = await contract.toggleTask(id);
    await tx.wait();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Decentralized To-Do List</h1>
      <p>Connected Account: {account}</p>

      <input
        type="text"
        placeholder="New Task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "" }}>
            {task.content}
            <button onClick={() => toggleTask(task.id)}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
