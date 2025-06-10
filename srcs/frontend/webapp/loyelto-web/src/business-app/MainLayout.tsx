import { Outlet } from 'react-router-dom';
import BusinessWebBar from './BusinessWebBar';

export default function MainLayout() {
    return (
        <>
        <main className='contentArea'>
            <Outlet />
        </main>
        <BusinessWebBar />
        </>
    )
}