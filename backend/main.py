

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()
#
# origins = [
#     "http://localhost",
#     "http://localhost:3000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_heade rs=["*"],
# )

MODEL = tf.keras.models.load_model("model1/model1/4")

# CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
CLASS_NAMES =['Dry Leaf', 'Healthy Leaf', 'Leaf Blotch']

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):


#     global MODEL
#
#     print("Model Type:", type(MODEL))  # Debugging Step
#
#     # Read image correctly
#     image = Image.open(BytesIO(await file.read())).convert("RGB").resize((256, 256,))
#     image = np.array(image) / 256.0  # Normalize
#     img_batch = np.expand_dims(image, axis=0)
#
#     # Ensure MODEL is valid
#     if not hasattr(MODEL, "predict"):
#         raise RuntimeError("MODEL does not have a 'predict' method. Check model loading.")
#
#     predictions = MODEL.predict(img_batch)
#
#     predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
#     confidence = np.max(predictions[0])
#     print(predicted_class)
#     return {'class': predicted_class, 'confidence': float(confidence)}





    print(type(MODEL))

    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    print(predicted_class)
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
