import React, { useEffect, useState } from 'react';
import { getAllUser, createAdmin, deleteAdmin } from '../../services/adminService';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
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

    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Role',
            selector: row => row.role.charAt(0).toUpperCase() + row.role.slice(1),
            sortable: true,
            width: '120px'
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            wrap: true
        },
        {
            name: 'Created Date',
            selector: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '',
            sortable: true,
            width: '140px'
        },
        {
            name: 'Actions',
            cell: row => (
                row.role === 'admin' ? (
                    <div className="flex items-center gap-2">
                        {(row._id !== currentUserId && <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(row._id)} />)}
                    </div>
                ) : null
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '140px'
        }
    ];

    const filteredUsers = users.filter(u => {
        const search = filterText.toLowerCase();
        return (
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.role.toLowerCase().includes(search)
        );
    });

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

                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="border px-3 py-2 rounded"
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        pagination
                        highlightOnHover
                        responsive
                        defaultSortFieldId={1}
                    />
                </div>

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