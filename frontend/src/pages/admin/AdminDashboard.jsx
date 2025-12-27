import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
               try{
                 const res = await axios.get('/general/summary');
                setStats({
                    genres: res.data.totalGenres || 0,
                    movies: res.data.totalMovies || 0,
                    admins: res.data.totalAdmins || 0,
                    users: res.data.totalUsers || 0,
                    topViewedMovie: res.data.topViewedMovie || '',
                });
               }catch(ex){
                //
               }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Welcome back</h2>
                        <p className="text-sm text-slate-500">Overview of your platform's statistics</p>
                    </div>
                </div>

                <Row className="g-4">
                    <Col md={3} xs={12}>
                        <Card className="text-white" style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <div className="p-4" style={{ background: 'linear-gradient(135deg,#6a11cb,#2575fc)' }}>
                                <div className="text-sm">Genres</div>
                                <div className="text-3xl font-bold mt-2">{stats.genres}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} xs={12}>
                        <Card className="text-white" style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <div className="p-4" style={{ background: 'linear-gradient(135deg,#11998e,#38ef7d)' }}>
                                <div className="text-sm">Movies</div>
                                <div className="text-3xl font-bold mt-2">{stats.movies}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} xs={12}>
                        <Card className="text-white" style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <div className="p-4" style={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)' }}>
                                <div className="text-sm">Admins</div>
                                <div className="text-3xl font-bold mt-2">{stats.admins}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col md={3} xs={12}>
                        <Card className="text-white" style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <div className="p-4" style={{ background: 'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>
                                <div className="text-sm">Top Viewed</div>
                                <div className="text-xl font-bold mt-2">{stats.topViewedMovie || '—'}</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
        </AdminLayout>
    );
};

export default AdminDashboard;