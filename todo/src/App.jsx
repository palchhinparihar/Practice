import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import Navbar from './components/Navbar';

// Icons
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  useEffect(() => {
    let todoString = JSON.parse(localStorage.getItem("todos"));

    if (todoString) {
      let todos = todoString;
      setTodos(todos);
    }
    
  }, []);

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  const toogleFinished = () => {
    setshowFinished(!showFinished);
  }

  const handleAdd = () => {
    setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}]);
    setTodo("");

    saveToLS();
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id = id);

    setTodo(t[0].todo);

    let newTodos = todos.filter(item => {
      return item.id !== id;
    });

    setTodos(newTodos);
    
    saveToLS();
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });

    setTodos(newTodos);

    saveToLS();
  }

  const handleChange = (e) => {
    setTodo(e.target.value);
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;

    let index = todos.findIndex(item => {
      return item.id === id;
    });

    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);

    saveToLS();
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="mx-5 md:container my-5 rounded-xl bg-purple-300 p-5 md:mx-auto min-h-[88vh] md:w-3/4 lg:w-1/2">
          <section className="add-todo my-3 w-full">
            <h1 className="text-3xl font-bold text-center mb-5">iTask - Manage Your To-Dos at One Place</h1>
            <h2 className="font-bold text-xl">Add To-Do</h2>

            <div className="flex flex-col mt-3 md:gap-4 gap-3 items-center">
              <input autoFocus onChange={handleChange} value={todo} type="text" placeholder="Add your to-do" className="p-2 w-full rounded-md"/>
              <button onClick={handleAdd} disabled={todo.length < 3} className="disabled:bg-purple-500 disabled:text-gray-800 bg-purple-800 hover:bg-purple-900 py-[10px] rounded-lg text-md text-white font-semibold cursor-pointer w-1/2">Save</button>
            </div>
          </section>

          <section className="display-todo w-full">
            <div className="flex items-center gap-2">
              <input id="show-finished" onChange={toogleFinished} type="checkbox" checked={showFinished} className="h-4 w-4" />
              <label for="show-finished" className="font-semibold">Show Finished</label>
            </div>
            <div className="h-[2px] w-[97%] mx-auto bg-black mt-3 opacity-15"></div>

            <h2 className="font-bold text-xl mt-5">Your To-Dos</h2>

            <div className="todos w-full">
              {todos.length === 0 && <div className="text-xl bg-gray-300 my-3 p-3 font-semibold rounded-md">No to-Dos to display. Add your first to-do!</div>}
              {todos.map(item => {
                return (
                  (showFinished || !item.isCompleted) && (
                    <div key={item.id} className="todo flex justify-between my-3 gap-2 md:mx-6 items-center">
                      <div className="flex md:gap-5 gap-3 items-center w-3/4">
                        <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} name={item.id} className="h-4 w-4 mt-[2px]"/>
                        <label className={`${item.isCompleted ? "line-through" : ""} break-words overflow-x-auto`}>{item.todo}</label>
                      </div>
    
                      <div className="button flex h-full gap-2">
                        <button onClick={(e) => {handleEdit(e, item.id)}} className="bg-purple-800 hover:bg-purple-900 py-2 px-3 rounded-md text-md text-white font-semibold"><FaEdit /></button>
                        <button onClick={(e) => {handleDelete(e, item.id)}} className="bg-purple-800 hover:bg-purple-900 py-2 px-3 rounded-md text-md text-white font-semibold"><MdDelete /></button>
                      </div>
                    </div>
                  )
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default App;
