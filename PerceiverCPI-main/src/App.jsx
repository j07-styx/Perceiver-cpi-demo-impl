import { useState } from 'react'

function App() {
  const [smiles, setSmiles] = useState('')
  const [sequence, setSequence] = useState('')
  const [error, setError] = useState('')
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState(null)

  const loadExample = () => {
    setSmiles('CCO')
    setSequence('MKTIIALSYIFCLVFADYKDDDDK')
    setError('')
    setResult(null)
  }

  const clearInputs = () => {
    setSmiles('')
    setSequence('')
    setError('')
    setResult(null)
  }

  const handlePredict = async () => {
    setError('')
    setResult(null)

    if (!smiles.trim()) {
      setError('Please enter a compound SMILES string.')
      return
    }

    if (!sequence.trim()) {
      setError('Please enter a protein sequence.')
      return
    }

    setIsPredicting(true)

    try {
      const response = await fetch('http://localhost:3000/api/predict', {
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

      if (!response.ok) {
        throw new Error(data.error || 'Prediction request failed.')
      }

      setResult(data)
    } catch (error) {
      setError(
        error.message ||
          'Could not connect to the PerceiverCPI backend.'
      )
    } finally {
      setIsPredicting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0e0f] text-[#f1eee7]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#e87952]" />

            <span className="text-sm font-semibold tracking-[0.18em]">
              PERCEIVERCPI
            </span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-white/50">
            <a
              href="#"
              className="transition hover:text-white"
            >
              Research
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Documentation
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8">
        <section className="grid min-h-[calc(100vh-73px)] items-center gap-20 py-20 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.3em] text-[#e87952]">
              Computational Drug Discovery
            </p>

            <h1 className="max-w-3xl text-6xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Compound
              <br />

              <span className="text-white/35">
                × Protein
              </span>

              <br />

              Interaction.
            </h1>

            <p className="mt-8 max-w-lg text-base leading-7 text-white/45">
              Explore compound–protein interactions using the
              PerceiverCPI architecture, combining molecular
              representations with protein sequence features.
            </p>

            <div className="mt-10 flex items-center gap-5 text-xs uppercase tracking-[0.2em] text-white/30">
              <span>PerceiverCPI</span>

              <span className="h-px w-10 bg-white/15" />

              <span>Research Interface</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-[#e87952]/5 blur-3xl" />

            <div className="relative border border-white/10 bg-[#121416]">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                  Prediction Input
                </span>

                <span className="flex items-center gap-2 text-xs text-white/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7fb069]" />
                  Model ready
                </span>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Compound
                    </label>

                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                      SMILES
                    </span>
                  </div>

                  <textarea
                    value={smiles}
                    onChange={(event) => {
                      setSmiles(event.target.value)
                      setError('')
                      setResult(null)
                    }}
                    placeholder="Enter molecular SMILES..."
                    rows={4}
                    className="w-full resize-none border border-white/10 bg-[#0d0e0f] px-4 py-4 font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#e87952]/60"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Protein
                    </label>

                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                      Amino Acid Sequence
                    </span>
                  </div>

                  <textarea
                    value={sequence}
                    onChange={(event) => {
                      setSequence(event.target.value)
                      setError('')
                      setResult(null)
                    }}
                    placeholder="Enter protein sequence..."
                    rows={6}
                    className="w-full resize-none border border-white/10 bg-[#0d0e0f] px-4 py-4 font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#e87952]/60"
                  />
                </div>

                {error && (
                  <div className="border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={loadExample}
                    className="border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/50 transition hover:border-white/20 hover:text-white"
                  >
                    Example
                  </button>

                  <button
                    type="button"
                    onClick={clearInputs}
                    className="border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/50 transition hover:border-white/20 hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={isPredicting}
                  className="group flex w-full items-center justify-between bg-[#e87952] px-5 py-4 text-sm font-semibold text-[#17110e] transition hover:bg-[#f08a66] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {isPredicting
                      ? 'Sending request...'
                      : 'Run prediction'}
                  </span>

                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

                {result && (
                  <div className="border-t border-white/10 pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Backend response
                      </span>

                      <span className="text-xs text-[#7fb069]">
                        Connected
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="border border-white/10 bg-[#0d0e0f] p-4">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/25">
                          SMILES received
                        </p>

                        <p className="break-all font-mono text-sm text-white/70">
                          {result.smiles}
                        </p>
                      </div>

                      <div className="border border-white/10 bg-[#0d0e0f] p-4">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/25">
                          Protein sequence received
                        </p>

                        <p className="break-all font-mono text-sm text-white/70">
                          {result.sequence}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-white/25">
            <span>PerceiverCPI</span>

            <span>
              PyTorch · Chemprop · TAPE
            </span>

            <span>
              Compound–Protein Interaction
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App