exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  var body = JSON.parse(event.body);
  var name = body.name;
  var email = body.email;

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email requerido' }) };
  }

  var API_KEY = process.env.MAILERLITE_API_KEY;
  var GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  var payload = {
    email: email,
    fields: { name: name || '' },
    groups: GROUP_ID ? [GROUP_ID] : []
  };

  try {
    var response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify(payload)
    });

    var data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Error al suscribir' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
