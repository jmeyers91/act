export default async function createPost(options) {
  const response = await fetch('/api/createPost', {
    method: 'POST',
    body: JSON.stringify(options),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}
