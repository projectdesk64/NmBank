import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Skeleton } from '../ui/skeleton';

const ProtectedRoute = () => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-nmb-smoke">
                <div className="space-y-4 w-full max-w-md px-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
