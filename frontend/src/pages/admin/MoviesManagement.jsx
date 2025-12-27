import { useEffect, useState } from 'react';
import { Button, Container, Modal, Dropdown } from 'react-bootstrap';
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
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Manage Movies</h3>
                    <Link to="/admin/movies/create">
                        <Button variant="primary">Add New Movie</Button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {movies.map(movie => (
                        <div key={movie._id} className="bg-white shadow-sm rounded-lg">
                            <div className="flex items-center gap-4 p-3">
                                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                    {movie.coverImage ? (
                                        // eslint-disable-next-line
                                        <img src={movie.coverImage} alt={`cover ${movie.title}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="truncate">
                                            <div className="text-lg font-semibold truncate">{movie.title}</div>
                                            <div className="text-sm text-gray-500">{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : ''}</div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <Dropdown align="end" drop="down" renderMenuOnMount popperConfig={{ strategy: 'fixed' }} container={typeof document !== 'undefined' ? document.body : undefined}>
                                                <Dropdown.Toggle variant="light" id={`dropdown-${movie._id}`} className="p-1 rounded">
                                                   
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="!z-50">
                                                    <Dropdown.Item as={Link} to={`/admin/movies/update/${movie._id}`}>
                                                        Edit
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDelete(movie._id)}>
                                                        Delete
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={async () => {
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
                                                    }}>
                                                     {movie.featured ? 'Unmark Featured' : 'Mark Featured'}
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">Rating: <span className="font-semibold">{movie.averageRating?.toFixed(2) ?? '-'}</span></div>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(movie.genre) ? movie.genre.map(g => (
                                                <span key={g} className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">{g}</span>
                                            )) : (
                                                <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">{movie.genre}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Movie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MovieForm />
                    </Modal.Body>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default MoviesManagement;