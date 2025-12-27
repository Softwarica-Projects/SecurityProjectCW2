import React from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../services/authService';
import { handleError, handleSuccess } from '../../utils/toastUtils';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layout/PublicLayout';
import PasswordInput from '../../components/PasswordInput';
import LoadingBar from '../../components/LoadingBar';
import { validatePasswordComplexity } from '../../utils/passwordUtils';
import { useRecaptcha } from '../../hooks/useRecaptcha';
import { useEffect } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const { loadRecaptcha, execute, unloadRecaptcha } = useRecaptcha();
    const onSubmit = async (data) => {
        try {
            const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
            loadRecaptcha(siteKey);
            let token = await execute(siteKey, 'register') ;
            // reCAPTCHA token handled
            await registerUser({ ...data, recaptchaToken: token });
            handleSuccess('Registration successful!');
            reset();
            navigate('/login');
        } catch (err) {
            handleError(err);
        } finally {
            unloadRecaptcha();
        }
    };

    return (
        <PublicLayout>
            {isSubmitting && <LoadingBar message="Signing up..." />}
            <div className="w-full h-screen">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="/"
                    className="hidden sm:block absolute w-full h-full object-cover"
                />
                <div className="bg-black/60 fixed top-0 left-0 w-full h-screen"></div>
                <div className="fixed w-full px-4 py-24 z-50">
                    <div className="max-w-[450px] h-[600px] mx-auto bg-black/75 text-white">
                        <div className="max-w-[320px] mx-auto py-16">
                            <h1 className="text-3xl font-bold">Sign up</h1>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col py-4'>
                                <Form.Group className="mb-4" controlId="formName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        {...register('name', { required: 'Name is required' })}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Enter a valid email address',
                                            },
                                        })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <PasswordInput
                                    {...register('password', {
                                        required: 'Password is required',
                                        validate: (v) => {
                                            const res = validatePasswordComplexity(v);
                                            return res.valid || 'Password does not meet complexity requirements';
                                        }
                                    })}
                                    error={errors.password}
                                    value={undefined}
                                />
                                <button className="bg-emerald-600 py-3 my-6 rounded w-full font-bold">
                                       Sign Up
                                </button>
                                <p className="py-8">
                                    <span className="text-gray-600">
                                        Already subscribed to MovieVault?
                                    </span>{" "}
                                    <Link to="/login">Sign In</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );


    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Register</h2>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        {...register('name', { required: 'Name is required' })}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Enter a valid email address',
                                            },
                                        })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div className="text-end my-3">
                                    Already have an account?{' '}
                                    <Link to="/login">Login here</Link>
                                </div>
                                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                    Register
                                </Button>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;