from pathlib import Path
import csv
import tempfile

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from chemprop.args import PredictArgs
from chemprop.train.make_predictions import make_predictions


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

CHECKPOINT_DIR = (
    PROJECT_ROOT
    / "regression_150_newprot_pre"
)


# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="PerceiverCPI Inference API",
    description="PerceiverCPI compound-protein interaction prediction API",
    version="1.0.0",
)


# ---------------------------------------------------------
# Request schema
# ---------------------------------------------------------

class PredictionRequest(BaseModel):
    smiles: str
    sequence: str


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "PerceiverCPI inference",
    }


# ---------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------

@app.post("/predict")
def predict(request: PredictionRequest):

    smiles = request.smiles.strip()
    sequence = request.sequence.strip()

    # -----------------------------------------------------
    # Validate input
    # -----------------------------------------------------

    if not smiles:
        raise HTTPException(
            status_code=400,
            detail="SMILES is required.",
        )

    if not sequence:
        raise HTTPException(
            status_code=400,
            detail="Protein sequence is required.",
        )

    # -----------------------------------------------------
    # Check checkpoint directory
    # -----------------------------------------------------

    if not CHECKPOINT_DIR.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Checkpoint directory not found: {CHECKPOINT_DIR}",
        )

    test_path = None

    try:

        # -------------------------------------------------
        # Create temporary input CSV
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".csv",
            delete=False,
            newline="",
            encoding="utf-8",
        ) as temp_file:

            writer = csv.DictWriter(
                temp_file,
                fieldnames=["smiles", "sequence"],
            )

            writer.writeheader()

            writer.writerow(
                {
                    "smiles": smiles,
                    "sequence": sequence,
                }
            )

            test_path = Path(temp_file.name)

        # -------------------------------------------------
        # Create prediction arguments
        # -------------------------------------------------

        args = PredictArgs()

        args.test_path = str(test_path)

        args.preds_path = str(
            test_path.with_name(
                test_path.stem + "_predictions.csv"
            )
        )

        args.checkpoint_dir = str(CHECKPOINT_DIR)

        args.checkpoint_path = None
        args.checkpoint_paths = None

        # Use RTX 4060
        args.gpu = 0

        # Windows-compatible DataLoader configuration.
        # The repository otherwise attempts to use
        # "forkserver" from the FastAPI worker thread.
        args.num_workers = 0

        # -------------------------------------------------
        # Process prediction arguments
        # -------------------------------------------------

        args.process_args()

        # -------------------------------------------------
        # Run existing PerceiverCPI inference
        # -------------------------------------------------

        predictions = make_predictions(
            args=args,
        )

        # -------------------------------------------------
        # Extract the single regression prediction
        # -------------------------------------------------

        prediction = float(predictions[0][0])

        # -------------------------------------------------
        # Return API response
        # -------------------------------------------------

        return {
            "status": "success",
            "smiles": smiles,
            "sequence": sequence,
            "prediction": prediction,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    finally:

        # -------------------------------------------------
        # Remove temporary input CSV
        # -------------------------------------------------

        if test_path is not None:

            try:
                test_path.unlink(
                    missing_ok=True
                )
            except Exception:
                pass

            # ---------------------------------------------
            # Remove temporary prediction CSV
            # ---------------------------------------------

            try:

                prediction_path = test_path.with_name(
                    test_path.stem + "_predictions.csv"
                )

                prediction_path.unlink(
                    missing_ok=True
                )

            except Exception:
                pass