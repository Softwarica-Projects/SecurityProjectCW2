import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createMovie, updateMovie, getMovieById } from '../../services/movieService';
import { getGenres } from '../../services/genreService';
import AdminLayout from '../../layout/AdminLayout';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import { Spinner } from 'react-bootstrap';

const AddMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: null,
    trailerLink: '',
    movieLink: '',
    movieType: '',
    runtime: '',
    cast: [],
    coverImage: null,
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        const genreOptions = data.map(g => ({ value: g._id, label: g.name }));
        setGenres(genreOptions);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMovieById(id)
        .then((data) => {
          const genreOption = genres.find(g => g.value === (data.genre?._id || data.genreId || data.genre));
          setNewMovie({
            title: data.title || '',
            description: data.description || '',
            releaseDate: data.releaseDate ? data.releaseDate.substring(0, 10) : '',
            genre: genreOption || null,
            trailerLink: data.trailerLink || '',
            movieLink: data.movieLink || '',
            movieType: data.movieType || '',
            runtime: data.runtime || '',
            cast: Array.isArray(data.cast) ? data.cast : [],
            coverImage: null,
          });
        })
        .catch((err) => {
          handleError(err, 'Failed to fetch movie details');
        })
        .finally(() => setLoading(false));
    }
  }, [id, genres]);

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...newMovie.cast];
    updatedCast[index][field] = value;
    setNewMovie({ ...newMovie, cast: updatedCast });
  };

  const addCastMember = () => {
    setNewMovie({
      ...newMovie,
      cast: [...newMovie.cast, { name: '', type: '' }],
    });
  };

  const removeCastMember = (index) => {
    const updatedCast = [...newMovie.cast];
    updatedCast.splice(index, 1);
    setNewMovie({ ...newMovie, cast: updatedCast });
  };

  const handleFileChange = (e) => {
    setNewMovie({ ...newMovie, coverImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newMovie.cast.length === 0) {
        handleError(null, 'Please add at least one cast member');
        return;
      }
      const formData = new FormData();
      formData.append('title', newMovie.title);
      formData.append('description', newMovie.description);
      formData.append('releaseDate', newMovie.releaseDate);
      formData.append('genre', newMovie.genre?.value);
      formData.append('trailerLink', newMovie.trailerLink);
      formData.append('movieLink', newMovie.movieLink);
      formData.append('movieType', newMovie.movieType);
      formData.append('runtime', newMovie.runtime);
      formData.append('coverImage', newMovie.coverImage);
      formData.append('cast', JSON.stringify(newMovie.cast));

      if (id) {
        await updateMovie(id, formData);
        handleSuccess('Movie updated successfully!');
      } else {
        await createMovie(formData);
        handleSuccess('Movie added successfully!');
      }
      navigate('/admin/movies');
    } catch (error) {
      handleError(error, id ? 'Failed to update movie' : 'Failed to add movie');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h3>Add New Movie</h3>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                value={newMovie.releaseDate}
                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Select
                required
                options={genres}
                value={newMovie.genre}
                onChange={(selected) => setNewMovie({ ...newMovie, genre: selected })}
                placeholder="Select Genre"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 200,
                  }),
                }}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Trailer Link</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.trailerLink}
                onChange={(e) => setNewMovie({ ...newMovie, trailerLink: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Movie Link</Form.Label>
              <Form.Control
                type="text"
                value={newMovie.movieLink}
                onChange={(e) => setNewMovie({ ...newMovie, movieLink: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Movie Type</Form.Label>
              <Form.Select
                value={newMovie.movieType}
                onChange={(e) => setNewMovie({ ...newMovie, movieType: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Runtime (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={newMovie.runtime}
                onChange={(e) => setNewMovie({ ...newMovie, runtime: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            <h5>Cast</h5>
            {newMovie.cast.map((member, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Type (Actor, Director, etc.)"
                    value={member.type}
                    onChange={(e) => handleCastChange(index, 'type', e.target.value)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={() => removeCastMember(index)}>Remove</Button>
                </Col>
              </Row>
            ))}

            <Button variant="secondary" onClick={addCastMember} className="mb-3">
              Add Cast
            </Button>
            <Col>
              <Button variant="primary" type="submit">
                Save Movie
              </Button>
            </Col>
          </Form>)}
      </div>
    </AdminLayout>
  );
};

export default AddMoviePage;
