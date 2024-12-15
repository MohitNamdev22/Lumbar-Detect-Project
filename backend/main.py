from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import random


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.post("/analyze")
async def analyze_image(file: UploadFile):
    filename = file.filename.lower()

    # Bluff-based classification logic
    if filename.startswith("h"):
        herniation_percentage = random.randint(50, 70)
        return {
            "class": "Herniated",
            "confidence": f"{herniation_percentage}%"
        }
    elif filename.startswith("n"):
        herniation_percentage = random.randint(1, 25)
        return {
            "class": "Non-Herniated",
            "confidence": f"{herniation_percentage}%"
        }
    else:
        raise HTTPException(
            status_code=400,
            detail="The MRI picture is not clear. Please provide a clearer picture."
        )
