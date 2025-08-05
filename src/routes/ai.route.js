import { Router } from 'express';

import { verifyToken } from '../middleware/auth.middleware.js';
import { estimateTimeline, generateProjectDescription, predictTechStack } from '../services/ai.service.js';

const router = Router();
router.post('/description', verifyToken, generateProjectDescription);
router.post('/tech-stack', verifyToken, predictTechStack);
router.post('/timeline', verifyToken, estimateTimeline);

export default router;
