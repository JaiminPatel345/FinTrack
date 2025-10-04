import app from './app';

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Expense Service running on port ${PORT}`);
});
