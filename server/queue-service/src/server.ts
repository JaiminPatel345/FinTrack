import app from './app';

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`Queue Service running on port ${PORT}`);
});
