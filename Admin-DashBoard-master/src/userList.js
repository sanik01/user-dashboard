import React, { useEffect, useState } from "react";
import "../src/userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        updateTotalPages(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply search filter
    const filteredData = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filteredData);
    setCurrentPage(1);
    updateTotalPages(filteredData);
  }, [searchTerm, users]);

  const updateTotalPages = (data) => {
    setTotalPages(Math.ceil(data.length / pageSize));
  };

  const handleEditClick = (user) => {
    // Set the edited user when the edit button is clicked
    setEditedUser(user);
  };

  const handleSaveEdit = () => {
    // Implement edit logic in memory
    const updatedUsers = users.map((u) =>
      u.id === editedUser.id ? editedUser : u
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditedUser({
      id: "",
      name: "",
      email: "",
      role: "",
    });
  };

  const handleDeleteClick = (userId) => {
    // Implement delete logic in memory
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((id) => id !== userId));
  };

  const handleCheckboxChange = (userId) => {
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

  const handleDeleteSelected = () => {
    // Delete selected rows in memory
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    debugger;
    setSearchTerm(e.target.value);
    console.log(e.target.value, "inside click");
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>User List</h1>
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
            <th>Actions</th>
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
          <button onClick={handleSelectAll}>Select/Deselect All</button>
          <button onClick={handleDeleteSelected}>Delete Selected</button>
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
    </div>
  );
};

export default UserList;
