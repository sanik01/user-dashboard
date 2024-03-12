import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../src/userList.css";
import { addItem, deleteItem } from "./actions/cartActions";
import { API_BASE_URL } from "./config/config";

const UserList = () => {
  const state = useSelector((state) => state);
  console.log("store", state);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    assistantId: 1234567,
  });
  const [deletedUser, setdeletedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    assistantId: 1234567,
  });
  const [addUser, setAddUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    assistantId: 1234567,
  });

  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/demo`);
        const { docs, count } = await response.data;

        // Destructure docs and count from response
        setUsers(docs);
        setFilteredUsers(docs);
        setCount(count); // Assuming you have a state variable to store the total count
        updateTotalPages(docs);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filteredData); // Ensure filteredData is always an array
    setCurrentPage(1);
    updateTotalPages(filteredData);
  }, [searchTerm, users]); // Remove filteredUsers from dependencies

  const updateTotalPages = (data) => {
    setTotalPages(Math.ceil(data.length / pageSize));
  };

  const handleEditClick = (user) => {
    // Set the edited user when the edit button is clicked
    setEditedUser(user);
  };
  const handleAddClick = (count) => {
    // Open the dialog for adding a new user by setting showAddDialog to true
    setShowAddDialog(true);
    setCount(count);
    // Reset addUser state when the dialog opens
    setAddUser({
      id: "",
      name: "",
      email: "",
      role: "",
      assistantId: "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Implement edit logic in memory

      const response = await axios.put(`${API_BASE_URL}/demo`, editedUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.status === 200) {
        // Assuming data is the updated user received from the server
        const updatedUsers = users.map((u) =>
          u.id === editedUser.id ? data : u
        );

        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditedUser({
          id: "",
          name: "",
          email: "",
          role: "",
          assistantId: "",
        });
      } else {
        // Handle error response from the server
        console.error("Error updating user:", data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSaveAdd = async (e) => {
    const { assistantId } = editedUser;
    // Implement logic to add a new user in memory
    // Assuming user.id is a numeric value
    const usernameId =
      users.length === 0
        ? 1 // If it's the first user, assign ID as 1
        : Math.max(...users.map((user) => user.id)) + 1; // Otherwise, generate a new unique ID

    // Generate a random assistantId by multiplying with user.id
    const count = users.length + 1;
    const newUser = { ...addUser, id: usernameId, assistantId, count };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);

    // Close the dialog after saving
    setShowAddDialog(false);

    try {
      // Use async/await with axios for better readability
      const response = await axios.post(`${API_BASE_URL}/demo`, newUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Data posted successfully:", response.data);

      const data = response.data;
      const count = data.userCount;

      setCount(count);
      dispatch(addItem());
    } catch (error) {
      console.error("Failed to save new user:", error);
      alert("Failed to save new user.");
    }
  };
  const handleDeleteClick = async (id) => {
   
    try {
      ;

      const { assistantId } = deletedUser;
      const deleteSelectedUser = { assistantId, id };

      // Implement delete logic for multiple records
      const response = await axios.delete(`${API_BASE_URL}/demo`, {
        data: deleteSelectedUser, // Sending data in the request body
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Data posted successfully:", response.data);

      const { remainingUsers, count } = await response.data;
      ;

      setCount(count);
      setUsers(remainingUsers);

      // Ensure `id` is an array before using `includes`
      const updatedUsers = Array.isArray(id)
        ? users.filter((user) => !id.includes(user.id))
        : users.filter((user) => user.id !== id); // Filter out the deleted user
      setUsers(updatedUsers);

      // Filter out the deleted user from filteredUsers as well
      const updatedFilteredUsers = Array.isArray(id)
        ? filteredUsers.filter((user) => !id.includes(user.id))
        : filteredUsers.filter((user) => user.id !== id);

      setFilteredUsers(updatedFilteredUsers);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting users:", error);
      // Handle error scenario
    }
  };

  const handleCheckboxChange = (userId) => {
    ;
    // Toggle selected row
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        return prevSelectedRows.filter((id) => id !== userId);
      } else {
        return [...prevSelectedRows, userId];
      }
    });
  };

  const handleSelectAll = () => {
    // Select or deselect all rows on the current page
    const allIdsOnPage = filteredUsers
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .map((user) => user.id);

    if (selectedRows.length === allIdsOnPage.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIdsOnPage);
    }
  };

  const handleDeleteSelected = async () => {
    ;
    try {
      // Extract user IDs of selected users
      const deletedUserIds = selectedRows.map((userId) => userId);
      ;

      // Delete selected users from the backend
      await Promise.all(
        deletedUserIds.map((userId) => handleDeleteClick(userId))
      );
      ;

      // Update users state to remove deleted users
      const updatedUsers = users.filter(
        (user) => !selectedRows.includes(user.id)
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectedRows([]);
      dispatch(deleteItem());
    } catch (error) {
      console.error("Error deleting users:", error);
      // Handle error scenario
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };
  console.log(count, "inside count");
  console.log(state.numOfItems, "inside reudx");
  return (
    <div>
      <h1>User List Count : {count || state.numOfItems}</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button value={searchTerm} onClick={handleSearchChange} type="submit">
          Go
        </button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input
                className="checkbox"
                type="checkbox"
                onClick={() => handleSelectAll()}
              />
              Select
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>
              Actions{" "}
              <span>
                <button
                  className="add-btn"
                  onClick={() => {
                    handleAddClick(count);

                    ;
                  }}
                >
                  Add
                </button>
              </span>{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((user) => (
              <tr
                key={user.id}
                className={selectedRows.includes(user.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="allbuttons">
        <div>
          <button
            onClick={() => {
              handleSelectAll();
              dispatch(deleteItem());
            }}
          >
            Select/Deselect All
          </button>
          <button
            onClick={() => {
              handleDeleteSelected();
            }}
          >
            Delete Selected
          </button>
        </div>
        <div>
          <button onClick={() => handlePageChange(1)}>First Page</button>
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          >
            Previous Page
          </button>
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
          >
            Next Page
          </button>
          <button onClick={() => handlePageChange(totalPages)}>
            Last Page
          </button>
          <span>
            {"  "} Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
      {editedUser.id && (
        <div className="edit-form">
          <h2>Edit User</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Role:
              <input
                type="text"
                name="role"
                value={editedUser.role}
                onChange={handleInputChange}
              />
            </label>
            <button type="button" onClick={handleSaveEdit}>
              Save
            </button>
          </form>
        </div>
      )}
      {showAddDialog && (
        <div className="edit-form">
          <h2>Add New User</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={addUser.name}
                onChange={(e) =>
                  setAddUser({ ...addUser, name: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={addUser.email}
                onChange={(e) =>
                  setAddUser({ ...addUser, email: e.target.value })
                }
              />
            </label>
            <label>
              Role:
              <input
                type="text"
                name="role"
                value={addUser.role}
                onChange={(e) =>
                  setAddUser({ ...addUser, role: e.target.value })
                }
              />
            </label>
            <button
              type="button"
              onClick={() => {
                handleSaveAdd();
              }}
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserList;
