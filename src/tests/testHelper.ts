export async function closeServer(server: { close: (callback: () => void) => void }) {
  console.log('Closing server after tests...');
  await new Promise((resolve) => setTimeout(resolve, 500));
  await new Promise<void>((resolve) => server.close(() => resolve()));
}