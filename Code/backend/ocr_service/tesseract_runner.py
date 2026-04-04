import pytesseract
from PIL import Image
import os

# Set tesseract cmd if it's not in PATH. On Windows, it's often:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def perform_ocr(image_path: str) -> str:
    """
    Perform OCR on the given image path using Tesseract with Vietnamese language.
    """
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")
            
        img = Image.open(image_path)
        # Using 'vie' language pack for Vietnamese
        # Make sure vie.traineddata is installed in your Tesseract-OCR/tessdata directory
        text = pytesseract.image_to_string(img, lang='vie')
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
