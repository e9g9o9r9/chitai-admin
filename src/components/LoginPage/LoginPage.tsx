import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { login, reset } from '../../store/slices/authSlice';
import styles from './styles.module.scss';

interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.login
    );

    useEffect(() => {
        if (isError) {
            console.error('Login error:', message);
        }

        if (isSuccess) {
            console.log('Login successful');
            // Например: navigate('/dashboard');
        }

        return () => {
            dispatch(reset());
        };
    }, [isError, isSuccess, message, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const credentials = {
                email: formData.email,
                password: formData.password
            };

            dispatch(login(credentials));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>С возвращением!</h1>
                    <p>Введите пожалуйста ваши данные чтобы продолжить</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {isError && (
                        <div className={styles.errorAlert}>
                            {message === 'Access denied. Admin role required.'
                                ? 'Доступ запрещен. Требуются права администратора.'
                                : 'Ошибка входа. Проверьте правильность данных.'}
                        </div>
                    )}

                    {isSuccess && (
                        <div className={styles.successAlert}>
                            Вход выполнен успешно!
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Ваш Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.error : ''}
                            placeholder="Введите ваш email"
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? styles.error : ''}
                            placeholder="Введите ваш пароль"
                        />
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </div>

                    <div className={styles.options}>
                        <label className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            Запомнить меня
                        </label>

                        <a href="#forgot" className={styles.forgotLink}>Забыли пароль?</a>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.button} ${isLoading ? styles.submitting : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;