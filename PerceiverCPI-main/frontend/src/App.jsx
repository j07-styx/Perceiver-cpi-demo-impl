import { useState } from 'react'

const GITHUB_URL = 'https://github.com/dmis-lab/PerceiverCPI'
const PAPER_URL = 'https://doi.org/10.1093/bioinformatics/btac731'

function App() {
  const [smiles, setSmiles] = useState('')
  const [sequence, setSequence] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState('')
  const [isPredicting, setIsPredicting] = useState(false)

  const handleExample = () => {
    setSmiles('CCO')
    setSequence('MKTIIALSYIFCLVFADYKDDDDK')
    setPrediction(null)
    setError('')
  }

  const handleClear = () => {
    setSmiles('')
    setSequence('')
    setPrediction(null)
    setError('')
  }

  const handlePredict = async () => {
    setError('')
    setPrediction(null)

    if (!smiles.trim()) {
      setError('Please enter a SMILES string.')
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
        throw new Error(data.error || 'Prediction failed.')
      }

      if (
        data.prediction === undefined ||
        data.prediction === null
      ) {
        throw new Error('The backend returned no prediction.')
      }

      setPrediction(Number(data.prediction))
    } catch (err) {
      console.error('Prediction error:', err)

      setError(
        err.message ||
        'Unable to connect to the PerceiverCPI inference server.'
      )
    } finally {
      setIsPredicting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0e0f] text-[#f4f1eb]">

      {/* -------------------------------------------------- */}
      {/* Header                                             */}
      {/* -------------------------------------------------- */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#e87952]" />

            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              PerceiverCPI
            </span>

            <span className="hidden text-xs text-white/20 sm:inline">
              /
            </span>

            <span className="hidden text-xs text-white/35 sm:inline">
              Compound–Protein Interaction
            </span>
          </div>

          <nav className="flex items-center gap-5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/45 transition hover:text-white"
            >
              GitHub
            </a>

            <a
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/45 transition hover:text-white"
            >
              Research paper
            </a>

            <div className="hidden items-center gap-2 border-l border-white/10 pl-5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/35">
                Model ready
              </span>
            </div>
          </nav>

        </div>
      </header>


      {/* -------------------------------------------------- */}
      {/* Main                                               */}
      {/* -------------------------------------------------- */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* ------------------------------------------------ */}
        {/* Intro                                           */}
        {/* ------------------------------------------------ */}

        <section className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#e87952]">
              Computational drug discovery
            </p>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Compound × Protein Interaction.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
              Explore compound–protein interactions using the
              PerceiverCPI architecture, combining molecular
              representations with protein sequence features.
            </p>

          </div>

          <div className="flex shrink-0 flex-col gap-1 text-left lg:text-right">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
              Inference
            </span>

            <span className="text-xs text-white/50">
              3-model ensemble
            </span>

            <span className="text-xs text-white/30">
              CUDA · RTX 4060
            </span>
          </div>

        </section>


        {/* ------------------------------------------------ */}
        {/* Input section                                    */}
        {/* ------------------------------------------------ */}

        <section className="grid gap-4 lg:grid-cols-2">

          {/* Compound */}
          <div className="overflow-hidden border border-white/10 bg-[#111314]">

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#e87952]">
                  01
                </span>

                <span className="text-sm font-medium">
                  Compound
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                SMILES
              </span>

            </div>

            <div className="p-4">

              <textarea
                value={smiles}
                onChange={(event) => setSmiles(event.target.value)}
                placeholder="Paste SMILES notation..."
                spellCheck={false}
                className="h-32 w-full resize-none border border-white/10 bg-[#0d0e0f] px-3.5 py-3 font-mono text-[13px] leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#e87952]/60"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-white/25">
                  Example: CCO
                </span>

                {smiles && (
                  <span className="text-[10px] text-white/25">
                    {smiles.trim().length} chars
                  </span>
                )}
              </div>

            </div>
          </div>


          {/* Protein */}
          <div className="overflow-hidden border border-white/10 bg-[#111314]">

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#e87952]">
                  02
                </span>

                <span className="text-sm font-medium">
                  Target protein
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Sequence
              </span>

            </div>

            <div className="p-4">

              <textarea
                value={sequence}
                onChange={(event) => setSequence(event.target.value)}
                placeholder="Paste amino acid sequence..."
                spellCheck={false}
                className="h-32 w-full resize-none border border-white/10 bg-[#0d0e0f] px-3.5 py-3 font-mono text-[13px] leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#e87952]/60"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-white/25">
                  One-letter amino acid notation
                </span>

                {sequence && (
                  <span className="text-[10px] text-white/25">
                    {sequence.trim().length} aa
                  </span>
                )}
              </div>

            </div>
          </div>

        </section>


        {/* ------------------------------------------------ */}
        {/* Actions                                          */}
        {/* ------------------------------------------------ */}

        <section className="mt-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <button
              onClick={handleExample}
              disabled={isPredicting}
              className="border border-white/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/50 transition hover:border-white/25 hover:text-white disabled:opacity-40"
            >
              Example
            </button>

            <button
              onClick={handleClear}
              disabled={isPredicting}
              className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/35 transition hover:text-white disabled:opacity-40"
            >
              Clear
            </button>

          </div>


          <button
            onClick={handlePredict}
            disabled={isPredicting}
            className="inline-flex items-center gap-4 bg-[#e87952] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0d0e0f] transition hover:bg-[#f08b68] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>
              {isPredicting
                ? 'Running...'
                : 'Run prediction'}
            </span>

            <span className="text-base leading-none">
              →
            </span>
          </button>

        </section>


        {/* ------------------------------------------------ */}
        {/* Error                                             */}
        {/* ------------------------------------------------ */}

        {error && (
          <section className="mt-5 border border-red-400/20 bg-red-400/5 px-4 py-3">

            <div className="flex items-start gap-3">

              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-red-300/60">
                  Prediction error
                </p>

                <p className="mt-1 text-xs text-red-200">
                  {error}
                </p>
              </div>

            </div>

          </section>
        )}


        {/* ------------------------------------------------ */}
        {/* Result                                           */}
        {/* ------------------------------------------------ */}

        {prediction !== null && (
          <section className="mt-8 overflow-hidden border border-[#e87952]/25 bg-[#111314]">

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">

              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e87952]" />

                <span className="text-[10px] uppercase tracking-[0.22em] text-[#e87952]">
                  Prediction result
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Regression
              </span>

            </div>


            <div className="flex flex-col justify-between gap-8 px-5 py-7 md:flex-row md:items-end">

              <div>

                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Predicted interaction value
                </p>

                <div className="mt-1.5 text-5xl font-semibold tracking-tight">
                  {prediction.toFixed(4)}
                </div>

              </div>


              <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-right">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                    Ensemble
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    3 models
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                    Compute
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    CUDA
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* ------------------------------------------------ */}
        {/* Footer                                           */}
        {/* ------------------------------------------------ */}

        <footer className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.12em] text-white/25 sm:flex-row sm:items-center sm:justify-between">

          <span>
            PerceiverCPI · Research interface
          </span>

          <div className="flex items-center gap-5">

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white/60"
            >
              Source code
            </a>

            <a
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white/60"
            >
              Paper
            </a>

          </div>

        </footer>

      </main>

    </div>
  )
}

export default App