import { Router } from 'express';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ success: true, message: 'Queue service is running' });
});

router.post('/jobs', (req, res) => {
  res.json({ success: true, message: 'Job added to queue' });
});

export default router;
