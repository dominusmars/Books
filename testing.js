const {google} = require('googleapis');
const books = google.books('v1');

async function main() {
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    'apiKey': "AIzaSyDXK9Z1IYpjp1PojjvyAg3xlwCWlo4jmdE",
    scopes: ['https://www.googleapis.com/auth/books'],
  });

  // Acquire an auth client, and bind it to all future calls
  const authClient = await auth.getClient();
  google.options({auth: authClient});

  // Do the magic
  const res = await books.volumes.list({
    q: 'Fahrenheit 451',
  });
  console.dir(res.data.items[1].volumeInfo);

}

main().catch(e => {
  console.error(e);
  throw e;
});