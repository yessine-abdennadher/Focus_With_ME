from tensorflow.keras.models import load_model
import cv2

# Constantes
CLASS_NAMES = ['Fatigue1', 'Fatigue2', 'Neutre']
ZOOM_FACTOR = 1.7
FRAME_MARGIN = 0.5
TARGET_SIZE = (48, 48)

# Charger modèle une fois
MODEL = load_model('models/best_resnet101_model.keras')

# Détecteur de visage
FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')