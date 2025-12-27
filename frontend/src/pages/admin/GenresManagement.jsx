import React, { useEffect, useState } from 'react';
import { getGenres, createGenre, deleteGenre, updateGenre } from '../../services/genreService';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import AdminLayout from '../../layout/AdminLayout';
import { FaTrash } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const GenresManagement = () => {
    const [genres, setGenres] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGenre, setNewGenre] = useState({ name: '', image: null });

    const fetchGenres = async () => {
        const data = await getGenres();
        setGenres(data);
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', newGenre.name);
        if (newGenre.image) {
            formData.append('image', newGenre.image);
        }
        try {
            if (newGenre._id) {
                await updateGenre(newGenre._id, formData);
                handleSuccess('Genre updated successfully');
            } else {
                await createGenre(formData);
                handleSuccess('Genre created successfully');
            }
            setNewGenre({ name: '', image: null });
            setShowModal(false);
            fetchGenres();
        } catch (err) {
            handleError(err, 'Failed to save genre');
        }
    };
    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this genre?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteGenre(id);
                            handleSuccess('Genre deleted successfully');
                        } catch (err) {
                            handleError(err, 'Failed to save genre');
                        }
                        fetchGenres();
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
                    Manage Genres
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Add New Genre
                    </Button>
                </h3>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres.map(genre => (
                            <tr key={genre._id}>
                                <td>{genre.name}</td>
                                <td>
                                    {genre.image && (
                                        <a href={genre.image.startsWith('http') ? genre.image : `${window.location.origin}${genre.image}`} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={genre.image.startsWith('http') ? genre.image : `${window.location.origin}${genre.image}`}
                                                alt={genre.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        </a>
                                    )}
                                </td>
                                <td>
                                    <span
                                        style={{ cursor: 'pointer', color: '#ffc107', marginRight: 16 }}
                                        title="Edit"
                                        onClick={() => {
                                            setNewGenre({ name: genre.name, image: null, _id: genre._id });
                                            setShowModal(true);
                                        }}
                                    >
                                        <CiEdit size={20} />
                                    </span>
                                    <span
                                        style={{ cursor: 'pointer', color: '#dc3545' }}
                                        title="Delete"
                                        onClick={() => handleDelete(genre._id)}
                                    >
                                        <FaTrash size={20} />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>{newGenre._id ? 'Edit' : 'Add New'} Genre</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter genre name"
                                    value={newGenre.name}
                                    required
                                    onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setNewGenre({ ...newGenre, image: e.target.files[0] })}
                                />
                            </Form.Group>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit'>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </AdminLayout>
    );
};

export default GenresManagement;