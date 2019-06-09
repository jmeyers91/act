export default async function getUsers(options) {
  const response = await fetch('/api/getUsers', {
    method: 'POST',
    body: JSON.stringify(options),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}
