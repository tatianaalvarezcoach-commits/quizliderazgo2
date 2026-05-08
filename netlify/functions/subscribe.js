exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, name } = JSON.parse(event.body);

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
    },
    body: JSON.stringify({
      email,
      fields: { name }
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
