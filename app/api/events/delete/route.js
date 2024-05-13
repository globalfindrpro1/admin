import auth from '@/app/lib/firebase/admin/auth';
import { deleteEvent } from '@/app/controllers/EventsController'
import { createEdgeRouter } from 'next-connect';

const router = createEdgeRouter();
router.use(auth).post(deleteEvent);

export async function POST(request, ctx) {
    return router.run(request, ctx);
}