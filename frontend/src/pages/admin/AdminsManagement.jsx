import React, { useEffect, useState } from 'react';
import { getAllUser, createAdmin, deleteAdmin } from '../../services/adminService';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import AdminLayout from '../../layout/AdminLayout';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import { confirmAlert } from 'react-confirm-alert';
import { useAuth } from '../../hooks/useAuth';

const AdminsManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const { userId: currentUserId } = useAuth();
    const fetchUsers = async () => {
        const data = await getAllUser();
        setUsers(data.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async () => {
        try {
            await createAdmin(newAdmin);
            handleSuccess('Admin created successfully');
            setNewAdmin({ name: '', email: '', password: '' });
            setShowModal(false); 
            fetchUsers();
        }
        catch (err) {
            handleError(err);
        }
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this admin?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteAdmin(id);
                            handleSuccess('Admin deleted successfully');
                        } catch (err) {
                            handleError(err);
                        }
                        fetchUsers();
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    return (
        <AdminLayout>
            <Container>
                <h3 className="my-4 d-flex align-items-center justify-content-between">
                    Manage Users
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Add New Admin
                    </Button>
                </h3>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.map(admin => (
                            <tr key={admin._id}>
                                <td>{admin.name}</td>
                                <td>{admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}</td>
                                <td>{admin.email}</td>
                                <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}</td>
                                <td>
                                    {admin.role === 'admin' && (
                                        <>
                                            <span
                                                style={{ cursor: 'pointer', color: '#ffc107', marginRight: 16 }}
                                                title="Edit"
                                            >
                                                <FaEdit size={18} />
                                            </span>
                                            {(admin._id !== currentUserId &&
                                                <span
                                                    style={{ cursor: 'pointer', color: '#dc3545' }}
                                                    title="Delete"
                                                    onClick={() => handleDelete(admin._id)}
                                                >
                                                    <FaTrash size={18} />
                                                </span>
                                            )}
                                        </>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Admin</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter admin name"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter admin email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter admin password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleCreate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </AdminLayout>
    );
};

export default AdminsManagement;