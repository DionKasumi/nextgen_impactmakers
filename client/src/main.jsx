import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrimaryLayout from './routes/PrimaryLayout.jsx';
import SecondaryLayout from './routes/SecondaryLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import TrainingsPage from './pages/TrainingsPage.jsx';
import TrainingDetailsPage from './pages/TrainingDetailsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import InternshipsPage from './pages/InternshipPage.jsx';
import InternshipDetailsPage from './pages/InternshipDetailsPage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrimaryLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/contact',
                element: <ContactPage />,
            },
            {
                path: '/trainings',
                element: <TrainingsPage />,
            },
            {
                path: '/Events',
                element: <EventsPage />,
            },
            {
                path: '/Internships',
                element: <InternshipsPage />,
            },
        ],
    },
    {
        path: '/',
        element: <SecondaryLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/courses/:id',
                element: <TrainingDetailsPage />,
            },
            {
                path: '/courses/:id',
                element: <EventDetailsPage />
            },
            {
                path: '/courses/:id',
                element: <InternshipDetailsPage />
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
