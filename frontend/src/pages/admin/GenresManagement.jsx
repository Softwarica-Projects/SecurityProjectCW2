import React, { useEffect, useState } from 'react';
import { getGenres, createGenre, deleteGenre, updateGenre } from '../../services/genreService';
import { Button, Modal, Form } from 'react-bootstrap';
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
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Manage Genres</h3>
                    <Button variant="primary" onClick={() => setShowModal(true)}>Add New Genre</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {genres.map(genre => (
                        <div key={genre._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center">
                            {genre.image ? (
                                <a href={genre.image.startsWith('http') ? genre.image : `${window.location.origin}${genre.image}`} target="_blank" rel="noopener noreferrer">
                                    <img src={genre.image.startsWith('http') ? genre.image : `${window.location.origin}${genre.image}`} alt={genre.name} className="w-24 h-24 object-cover rounded-md mb-3" />
                                </a>
                            ) : (
                                <div className="w-24 h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="font-semibold mb-2">{genre.name}</div>
                            <div className="flex items-center gap-3">
                                <CiEdit size={20} className="text-yellow-500 cursor-pointer" onClick={() => {
                                    setNewGenre({ name: genre.name, image: null, _id: genre._id });
                                    setShowModal(true);
                                }} />
                                <FaTrash size={18} className="text-red-500 cursor-pointer" onClick={() => handleDelete(genre._id)} />
                            </div>
                        </div>
                    ))}
                </div>

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
            </div>
        </AdminLayout>
    );
};

export default GenresManagement;