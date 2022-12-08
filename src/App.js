import "./App.css"
import React, { useState, useEffect } from 'react';
import UserForm from "./components/UserForm";

// http://localhost:4000/users
// /users -> GET -> {id, username, email}
// /users/ -> POST -> {username, email}
// /users/:id -> PUT -> update the user
// /users/:id -> DELETE -> delete the user

// CRUD -> CREATE(POST), READ(GET), UPDATE(PUT/PATCH), DELETE

// const URL = 'https://jsonplaceholder.typicode.com/users';
const URL = 'http://localhost:4000/users';

function App() {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // update
    const [selectedUser, setSelectedUser] = useState({
        username: "",
        email: "",
    });
    const [updateFlag, setUpdateFlag] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");

    const getAllUsers = () => {
        fetch(URL)
            .then((res) => {
                if (!res.ok) {
                    throw Error("Could not fetch");
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data.users);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false)
            });
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    // Delete user
    const handleDelete = (id) => {
        fetch(URL + `/${id}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) {
                    throw Error("could not delete");
                }
                getAllUsers();
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    // Add user
    const addUser = (user) => {
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => {
                if (res.status === 201) {
                    getAllUsers();
                } else {
                    throw new Error("could not create new user");
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    const handleEdit = (id) => {
        setSelectedUserId(id);
        setUpdateFlag(true);
        const filteredData = users.filter((user) => user.id === id);
        setSelectedUser({
            username: filteredData[0].username,
            email: filteredData[0].email,
        });
    }

    const handleUpdate = (user) => {
        fetch(URL + `/${selectedUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("failed to update");
                }
                getAllUsers();
                setUpdateFlag(false);
            })
            .catch((err) => {
                setError(err.message);
            });
    }

    return (
        <div className="App">
            <h1>User Management App</h1>
            {updateFlag ? (<UserForm btnText="Update User" selectedUser={selectedUser} handleSubmitData={handleUpdate} />) : (<UserForm btnText="Add User" handleSubmitData={addUser} />)}
            {isLoading && <h2 style={{ color: "green" }}>Loading...</h2>}
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <section>
                {users && users.map((user) => {
                    const { id, username, email } = user;
                    return (
                        <article key={id} className="card">
                            <p>{username}</p>
                            <p>{email}</p>
                            <button className="btn" onClick={() => { handleEdit(id); }}>Edit</button>
                            <button className="btn" onClick={() => { handleDelete(id); }}>Delete</button>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}

export default App;
