import { uploadFile } from '@/app/controllers/EventsController'
import { createEdgeRouter } from 'next-connect';

const router = createEdgeRouter();
router.post(uploadFile);

export async function POST(request, ctx) {
    return router.run(request, ctx);
}