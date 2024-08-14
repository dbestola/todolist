import { useState, useEffect } from 'react';
import './App.css';
import ICON1 from './assets/edit.png';
import ICON2 from './assets/remove-icon-png-7132.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

const url = import.meta.env.VITE_URL

  const [task, setTask] = useState([]);
  const [formData, setFormData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const handleGetTask = () => {
    axios.get(`${url}/getall`)
      .then((res) => {
        console.log(res.data);

        setTask(res.data)
      })

      .catch((error) => {
        console.log(error);

      });
  };

  useEffect(() => {
    handleGetTask()
  }, []);

  const handleDelete = async (id) => {

    try {

      await axios.delete(`${url}/${id}`);

      toast('task deleted succesfully', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      await handleGetTask();

    } catch (error) {
      toast(error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
  };

  const handleEdit = (id, name) => {
    setIsEditing(true);
    setFormData(name);
    setCurrentTaskId(id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!currentTaskId) return;

    axios.put(`${url}/update/${currentTaskId}`, { name: formData })
      .then(() => {
        toast('Task updated successfully', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFormData('');
        setIsEditing(false);
        setCurrentTaskId(null);
        handleGetTask();
      })
      .catch((error) => {
        toast('Error updating task: ' + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleInputChange = (e) => {
    setFormData(e.target.value);
  };


  const createTask = async (e) => {
    e.preventDefault()

    if (formData.trim() === '') {
      toast.error('Please enter a task name', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }


    try {

      await axios.post(`${url}/create`, { name: formData })

      toast.success('Task added successfully', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setFormData('');

      await handleGetTask();

    } catch (error) {
      toast.error('Error adding task: ' + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

  };

  return (
    <>
      <div className='handle_flex'>

        <div className="h1-tag">
          <h1>MANAGER</h1>
        </div>

        <div className="task-count">
          <h4>Total Tasks: {task.length}</h4>
          <h4>Completed Tasks: 0</h4>
        </div>



        {
          task.map((tasks) => {
            return (<div className="handle-div" key={tasks._id}>
              <p>{tasks.name} <span> {tasks.createdAt}</span> </p>
              <div className='my-icons'>
                <img className='icon1' src={ICON1} alt="edit-icon" onClick={() => handleEdit(tasks._id, tasks.name)} />
                <img className='icon2' src={ICON2} alt="delete-icon" onClick={() => handleDelete(tasks._id)} />
              </div>
            </div>)
          })
        }

        <form onSubmit={isEditing ? handleUpdate : createTask}>
          <div className="input">
            <input type="text" placeholder={isEditing ? 'Edit Task' : 'Add a Task'} name='name' value={formData} onChange={handleInputChange} />
          </div>

          <div className="button">
            <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
          </div>

        </form>


        <ToastContainer />

      </div>
    </>
  )
}

export default App
