import app from './app';

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Currency Service running on port ${PORT}`);
});
