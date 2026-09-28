const express = require('express')
const cors = require('cors')

const app = express()

const PORT = 3000
const PYTHON_API_URL = 'http://127.0.0.1:8000'

app.use(cors())
app.use(express.json())


// ---------------------------------------------------------
// Health check
// ---------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PerceiverCPI API',
  })
})


// ---------------------------------------------------------
// Prediction
// ---------------------------------------------------------

app.post('/api/predict', async (req, res) => {
  const { smiles, sequence } = req.body

  // Validate SMILES
  if (!smiles || !smiles.trim()) {
    return res.status(400).json({
      error: 'SMILES is required.',
    })
  }

  // Validate protein sequence
  if (!sequence || !sequence.trim()) {
    return res.status(400).json({
      error: 'Protein sequence is required.',
    })
  }

  try {
    // -----------------------------------------------------
    // Forward request to Python / PerceiverCPI API
    // -----------------------------------------------------

    const response = await fetch(`${PYTHON_API_URL}/predict`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        smiles: smiles.trim(),
        sequence: sequence.trim(),
      }),
    })

    const data = await response.json()

    // -----------------------------------------------------
    // Forward Python API errors
    // -----------------------------------------------------

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || 'PerceiverCPI prediction failed.',
      })
    }

    // -----------------------------------------------------
    // Return actual prediction to React
    // -----------------------------------------------------

    return res.json({
      status: 'success',
      smiles: data.smiles,
      sequence: data.sequence,
      prediction: data.prediction,
    })

  } catch (error) {

    console.error('Python API connection error:', error)

    return res.status(500).json({
      error: 'Could not connect to the PerceiverCPI inference server.',
      details: error.message,
    })
  }
})


// ---------------------------------------------------------
// Start server
// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `PerceiverCPI backend running on http://localhost:${PORT}`
  )
})