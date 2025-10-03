import cv2
import numpy as np
from tensorflow.keras.applications.resnet import preprocess_input
from fatigue_detection_config import MODEL, CLASS_NAMES, ZOOM_FACTOR, FRAME_MARGIN, TARGET_SIZE, FACE_CASCADE

def apply_zoom_and_crop(image, zoom_factor):
    height, width = image.shape[:2]
    new_height, new_width = int(height / zoom_factor), int(width / zoom_factor)
    start_x = width // 2 - new_width // 2
    start_y = height // 2 - new_height // 2
    return image[start_y:start_y + new_height, start_x:start_x + new_width]

def predict_fatigue(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = FACE_CASCADE.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return {"error": "No face detected"}

    x, y, w, h = faces[0]
    margin_w = int(w * FRAME_MARGIN)
    margin_h = int(h * FRAME_MARGIN)
    x1 = max(0, x - margin_w)
    y1 = max(0, y - margin_h)
    x2 = min(frame.shape[1], x + w + margin_w)
    y2 = min(frame.shape[0], y + h + margin_h)
    large_frame = frame[y1:y2, x1:x2]

    zoomed_frame = apply_zoom_and_crop(large_frame, ZOOM_FACTOR)
    resized_frame = cv2.resize(zoomed_frame, TARGET_SIZE, interpolation=cv2.INTER_AREA)
    img_array = preprocess_input(np.expand_dims(resized_frame, axis=0))
    prediction = MODEL.predict(img_array)
    predicted_class = CLASS_NAMES[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    return {
        "prediction": predicted_class,
        "confidence": confidence,
        "bounding_box": {"x": int(x1), "y": int(y1), "width": int(x2 - x1), "height": int(y2 - y1)}
    }