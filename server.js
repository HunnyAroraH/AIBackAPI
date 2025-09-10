const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

// 🔐 ElevenLabs Config
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const AGENT_PHONE_NUMBER_ID = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;

// 🧠 In-memory lead storage
const leads = {};

app.use(express.json());

/**
 * 🔥 Store lead & trigger call
 */
app.post('/storeLeadData', async (req, res) => {
  const {
    firstName = '',
    lastName = '',
    companyName = '',
    phone = '',
    website = '',
    industry = '',
    businessDetails = ''
  } = req.body;

  if (!firstName || !phone) {
    return res.status(400).json({ error: 'Missing required fields: firstName or phone' });
  }

  leads[phone] = {
    firstName,
    lastName,
    companyName,
    phone,
    website,
    industry,
    businessDetails
  };

  console.log('✅ Stored lead:', leads[phone]);

  const payload = {
    agent_id: AGENT_ID,
    agent_phone_number_id: AGENT_PHONE_NUMBER_ID,
    to_number: phone
  };

  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/convai/twilio/outbound-call',
      payload,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📞 Call triggered via webhook method:', response.data);
    res.status(200).json({ message: 'Call triggered via webhook method' });
  } catch (error) {
    const errRes = error.response?.data || error.message;
    console.error('❌ Call failed:', errRes);
    res.status(500).json({ error: 'Failed to trigger call', details: errRes });
  }
});

/**
 * 📡 ElevenLabs Webhook — Return dynamic variables
 */
app.post('/getClientInfo', (req, res) => {
  console.log('📥 Incoming getClientInfo request:', req.body);

  const phone = req.body.called_number?.replace('+1', '') || req.body.called_number;
  console.log('📞 Parsed phone:', phone);
  console.log('📚 Leads:', leads);

  if (!phone || !leads[phone]) {
    console.log(`❌ No data for phone: ${phone}`);
    return res.status(404).json({ error: 'Client not found' });
  }

  const lead = leads[phone];
  const dynamicVars = {
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    companyName: lead.companyName || '',
    phone: lead.phone || '',
    website: lead.website || '',
    industry: lead.industry || '',
    businessDetails: lead.businessDetails || ''
  };

  console.log('✅ Returning dynamic_variables:', dynamicVars);
  res.status(200).json({ dynamic_variables: dynamicVars });
});

/**
 * 🚀 Start server
 */
app.listen(port, '0.0.0.0', () => {
  console.log(`⚡ Server running at http://0.0.0.0:${port}`);
});
