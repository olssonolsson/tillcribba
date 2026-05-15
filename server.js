const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Initiera Firebase Admin med miljövariabeln
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Route för att skicka notiser
app.post('/send-notification', async (req, res) => {
  console.log("Mottagen body:", req.body);

  try {
    const { tokens, title, body } = req.body;

    if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
      return res.status(400).json({ error: 'Inga tokens hittades' });
    }

    // Omvandla till lista om det bara är en sträng
    const tokenList = Array.isArray(tokens) ? tokens : [tokens];

    // Skicka notiser till varje token i listan
    const responses = await Promise.all(tokenList.map(token => {
      return admin.messaging().send({
        token: token,
        notification: {
          title: title || "Svensexa!",
          body: body || "Ny uppdatering"
        }
      });
    }));


// 2. NY Endpoint för att skicka till EN SPECIFIK användare (denna saknas!)
app.post('/send-notification-to-user', async (req, res) => {
  const { userId, title, body, data } = req.body;

  try {
    // Vi måste hämta användarens token från Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists || !userDoc.data().fcmToken) {
      return res.status(404).send("Användaren har ingen registrerad token");
    }

    const token = userDoc.data().fcmToken;

    const message = {
      notification: { title, body },
      token: token,
      data: data || {}
    };

    await admin.messaging().send(message);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Internt serverfel:", error);
    res.status(500).send(error.message);
  }
});

    console.log('Notiser skickade med framgång:', responses.length);
    res.status(200).json({ success: true, sentCount: responses.length });

  } catch (error) {
    console.error('DETALJERAT FEL FRÅN FIREBASE:', error);
    res.status(500).json({ error: error.message });
  }
});

// Hem-route för att se att servern är vid liv
app.get('/', (req, res) => {
  res.send('Notis-servern är vaken och redo!');
});

// Starta servern
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});
