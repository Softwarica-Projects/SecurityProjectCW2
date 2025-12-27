import { useEffect, useState } from 'react';
import { Button, Container, Modal, Table } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CiEdit } from 'react-icons/ci';
import { FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layout/AdminLayout';
import { deleteMovie, getMovies, toggleFeatured } from '../../services/movieService';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import MovieForm from './AddMoviePage';
const MoviesManagement = () => {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const fetchMovies = async () => {
        const data = await getMovies();
        setMovies(data);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this genre?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteMovie(id);
                            handleSuccess('Genre deleted successfully');
                        } catch (err) {
                            handleError(err, 'Failed to save genre');
                        }
                        fetchMovies();
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
                    Manage Movies
                    <Link to="/admin/movies/create" >
                        <Button variant="primary">
                            Add New Movie
                        </Button>
                    </Link>
                </h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Average Rating</th>
                            <th>Genre</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie._id}>
                                <td>
                                    {movie.coverImage ? (
                                        <img
                                            src={movie.coverImage}
                                            alt={movie.title}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                        />
                                    ) : (
                                        <span style={{ color: '#adb5bd' }}>No Image</span>
                                    )}
                                </td>
                                <td>{movie.title}</td>
                                <td>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : ''}</td>
                                <td>{movie.averageRating?.toFixed(2) ?? '-'}</td>
                                <td>
                                    <div style={{ maxWidth: 180, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        {movie.genre}
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/admin/movies/update/${movie._id}`}>
                                        <span
                                            style={{ cursor: 'pointer', color: '#ffc107', marginRight: 16 }}
                                            title="Edit"
                                        >
                                            <CiEdit size={20} />
                                        </span>
                                    </Link>
                                    <span
                                        style={{ cursor: 'pointer', color: '#dc3545', marginRight: 16 }}
                                        title="Delete"
                                        onClick={() => handleDelete(movie._id)}
                                    >
                                        <FaTrash size={20} />
                                    </span>
                                    <span
                                        style={{ cursor: 'pointer', color: movie.featured ? '#ffc107' : '#adb5bd' }}
                                        title={movie.featured ? 'Unmark as Featured' : 'Mark as Featured'}
                                        onClick={async () => {
                                            try {
                                                await toggleFeatured(movie._id);
                                                handleSuccess(
                                                    movie.featured
                                                        ? 'Movie removed from featured!'
                                                        : 'Movie marked as featured!'
                                                );
                                                fetchMovies();
                                            } catch (err) {
                                                handleError(err, 'Failed to toggle featured');
                                            }
                                        }}
                                    >
                                        {movie.featured ? <FaStar size={20} /> : <FaRegStar size={20} />}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Movie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MovieForm></MovieForm>

                    </Modal.Body>
                </Modal>
            </Container>
        </AdminLayout >
    );
};

export default MoviesManagement;