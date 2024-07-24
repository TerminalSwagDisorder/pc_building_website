import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';

const UsersAdmin = ({ setCurrentUser, currentUser, users, handleCredentialChangeAdmin, onSubmit, handleSignupAdmin }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isAdminChecked, setIsAdminChecked] = useState(0);
  const [isBannedChecked, setIsBannedChecked] = useState(0);
  const [formFields, setFormFields] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setIsAdminChecked(selectedUser.isAdmin ? 1 : 0);
      setIsBannedChecked(selectedUser.isBanned ? 1 : 0);
    }
  }, [selectedUser]);

  const closeForm = () => {
    setSelectedUser(null);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setFormFields(prevFields => ({
      ...prevFields,
      [event.target.name]: event.target.value
    }));

    if (event.target.id) {
      let userId = parseInt(event.target.value, 10);
      if (userId < users[0].ID) {
        userId = users[users.length - 1].ID;
      }
      if (userId > users[users.length - 1].ID) {
        userId = users[0].ID;
      }
      const selectedUser = users.find(user => user.ID === userId);
      setSelectedUser(selectedUser);
    }

    if (event.target.type === "checkbox") {
      if (event.target.name === "admin") {
        setIsAdminChecked(event.target.checked ? 1 : 0);
      } else if (event.target.name === "banned") {
        setIsBannedChecked(event.target.checked ? 1 : 0);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const initialAdmin = selectedUser.isAdmin ? 1 : 0;
    const initialBanned = selectedUser.isBanned ? 1 : 0;

    const newName = event.target.name.value;
    const newEmail = event.target.email.value;
    const newPassword = event.target.password.value;
    const newProfileImage = event.target.profile_image.files[0];
    const newAdmin = isAdminChecked;
    const newBanned = isBannedChecked;

    if (selectedUser !== "New user" && !newName && !newEmail && !newPassword && !newProfileImage && newAdmin === initialAdmin && newBanned === initialBanned) {
      alert("No changes detected!");
      return;
    } else if (selectedUser === "New user" && !newName && !newEmail && !newPassword) {
      alert("All required fields must be filled!");
      return;
    }
    if (newName === selectedUser.Name || newEmail === selectedUser.Email) {
      alert("You cannot use the same credentials");
      return;
    }

    if (selectedUser !== "New user") {
      try {
        await handleCredentialChangeAdmin(event, newAdmin, initialAdmin, newBanned, initialBanned, formFields);
      } catch (error) {
        console.error("Error updating credentials:", error);
        alert("Error updating credentials.");
      }
    } else if (selectedUser === "New user") {
      try {
        await handleSignupAdmin(event, newAdmin, formFields);
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Error adding user.");
      }
    }
  };

  const renderBasedOnUser = () => {
    if (selectedUser && selectedUser !== "New user") {
      return (
        <Container id="userform" className="mt-4">
          <Form onSubmit={handleSubmit} className="adminForm">
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={closeForm}>x</Button>
            </div>
            <Form.Group controlId="id">
              <Form.Label>ID</Form.Label>
              <Form.Control type="number" name="id" value={selectedUser.ID} onChange={handleInputChange} min={users[0].ID} max={users[users.length - 1].ID} />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder={selectedUser.Name} name="name" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder={selectedUser.Email} name="email" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" name="password" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="profile_image">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" name="profile_image" accept="image/png, image/jpeg, image/gif" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="admin">
              <Form.Check type="checkbox" name="admin" label="Admin" checked={isAdminChecked} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="banned">
              <Form.Check type="checkbox" name="banned" label="Banned" checked={isBannedChecked} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Change credentials
            </Button>
          </Form>
        </Container>
      );
    } else if (selectedUser === "New user") {
      return (
        <Container id="userform" className="mt-4">
          <Form onSubmit={handleSubmit} className="adminForm">
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={closeForm}>x</Button>
            </div>
            <Form.Group controlId="id">
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" name="id" value={selectedUser} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="New user name" name="name" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="New user email" name="email" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" name="password" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="profile_image">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" name="profile_image" accept="image/png, image/jpeg, image/gif" onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="admin">
              <Form.Check type="checkbox" name="admin" label="Admin" checked={isAdminChecked} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="banned">
              <Form.Check type="checkbox" name="banned" label="Banned" checked={0} onChange={handleInputChange} disabled />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Add new user
            </Button>
          </Form>
        </Container>
      );
    } else {
      return (
        <div className="userChangePrompt mt-4 text-center">
          <p>Select a user to modify their credentials.</p>
        </div>
      );
    }
  };

  return (
    <Container>
      <h2 className="mt-4">All users!</h2>
      <Row className="userChangeButtons mb-4">
        <Col>
          <Button variant="success" onClick={() => handleSelectUser("New user")}>Add new user</Button>
        </Col>
        <Col>
          <Button variant="warning" onClick={() => handleSelectUser(users[0])}>Change user credentials</Button>
        </Col>
      </Row>

      {renderBasedOnUser()}

      <ul className="list-unstyled mt-4">
        {users.map((user) => (
          <li key={user.ID} className="mb-4">
            <div className="border p-3">
              <div>ID: {user.ID}</div>
              <div>Name: {user.Name}</div>
              <div>Email: {user.Email}</div>
              <div>Admin: {user.isAdmin ? "True" : "False"}</div>
              <div>Banned: {user.isBanned ? "True" : "False"}</div>
              <div><img src={`/images/${user.Profile_image}`} alt={user.Profile_image} height="200" /></div>
              <div className="mt-2">
                <Button variant="info" onClick={() => handleSelectUser(user)}>Select user for modification</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default UsersAdmin;
