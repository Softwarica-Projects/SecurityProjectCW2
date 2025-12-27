import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import AdminLayout from '../../layout/AdminLayout';
import axios from '../../config/axiosConfig';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        genres: 0,
        movies: 0,
        admins: 0,
        users: 0,
        topViewedMovie: '',
    });

    useEffect(() => {
        const fetchStats = async () => {
                const res = await axios.get('/general/summary');
                setStats({
                    genres: res.data.totalGenres || 0,
                    movies: res.data.totalMovies || 0,
                    admins: res.data.totalAdmins || 0,
                    users: res.data.totalUsers || 0,
                    topViewedMovie: res.data.topViewedMovie || '',
                });
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <h2>Welcome to the Admin Dashboard</h2>
            <p>Here is an overview of your platform's statistics:</p>

            <Row className="g-4">
                <Col md={3}>
                    <Card className="text-center" style={{ background: 'linear-gradient(135deg, #6a11cb, #2575fc)', color: 'white', height: '150px' }}>
                        <Card.Body>
                            <Card.Title>Genres</Card.Title>
                            <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {stats.genres}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', height: '150px' }}>
                        <Card.Body>
                            <Card.Title>Movies</Card.Title>
                            <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {stats.movies}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center" style={{ background: 'linear-gradient(135deg, #f7971e, #ffd200)', color: 'white', height: '150px' }}>
                        <Card.Body>
                            <Card.Title>Admins</Card.Title>
                            <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {stats.admins}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center" style={{ background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: 'white', height: '150px' }}>
                        <Card.Body>
                            <Card.Title>Top Viewed Movie</Card.Title>
                            <Card.Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {stats.topViewedMovie}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default AdminDashboard;