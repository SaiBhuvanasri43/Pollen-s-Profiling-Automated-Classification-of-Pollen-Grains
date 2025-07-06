from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import numpy as np
from PIL import Image
import io
import base64
import json
from datetime import datetime
import random

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Mock pollen classification data
POLLEN_TYPES = [
    'Betula (Birch)',
    'Quercus (Oak)',
    'Pinus (Pine)',
    'Alnus (Alder)',
    'Corylus (Hazel)',
    'Fagus (Beech)',
    'Populus (Poplar)',
    'Salix (Willow)',
    'Fraxinus (Ash)',
    'Tilia (Linden)'
]

MORPHOLOGIES = [
    'Tricolporate',
    'Inaperturate',
    'Monocolpate',
    'Tricolpate',
    'Stephanocolpate',
    'Periporate'
]

SIZE_CATEGORIES = [
    'Small (10-25μm)',
    'Medium (25-50μm)',
    'Large (50-100μm)',
    'Very Large (100+μm)'
]

SURFACE_PATTERNS = [
    'Smooth',
    'Reticulate',
    'Striate',
    'Scabrate',
    'Verrucate',
    'Rugulate'
]

class PollenClassifier:
    """Mock pollen classification system"""
    
    def __init__(self):
        self.model_loaded = True
    
    def preprocess_image(self, image):
        """Preprocess image for classification"""
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize((224, 224))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values
        img_array = img_array / 255.0
        
        return img_array
    
    def extract_features(self, image_array):
        """Extract morphological features from image"""
        # Mock feature extraction
        features = {
            'shape_complexity': random.uniform(0.3, 0.9),
            'surface_texture': random.uniform(0.2, 0.8),
            'size_ratio': random.uniform(0.4, 0.7),
            'aperture_count': random.randint(1, 6),
            'symmetry_score': random.uniform(0.5, 0.95)
        }
        return features
    
    def classify(self, image):
        """Classify pollen grain from image"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Extract features
            features = self.extract_features(processed_image)
            
            # Mock classification results
            primary_type = random.choice(POLLEN_TYPES)
            primary_confidence = round(random.uniform(75, 95), 1)
            
            # Generate alternative classifications
            alternatives = []
            remaining_types = [t for t in POLLEN_TYPES if t != primary_type]
            
            for i in range(3):
                alt_type = random.choice(remaining_types)
                remaining_types.remove(alt_type)
                alt_confidence = round(random.uniform(45, 75), 1)
                alternatives.append({
                    'type': alt_type,
                    'confidence': alt_confidence
                })
            
            # Sort alternatives by confidence
            alternatives.sort(key=lambda x: x['confidence'], reverse=True)
            
            # Generate morphological details
            details = {
                'morphology': random.choice(MORPHOLOGIES),
                'size_category': random.choice(SIZE_CATEGORIES),
                'surface_pattern': random.choice(SURFACE_PATTERNS),
                'processing_time': round(random.uniform(1.2, 3.5), 2)
            }
            
            return {
                'success': True,
                'primary': {
                    'type': primary_type,
                    'confidence': primary_confidence
                },
                'alternatives': alternatives,
                'details': details,
                'features': features,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Initialize classifier
classifier = PollenClassifier()

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/classify', methods=['POST'])
def classify_pollen():
    """API endpoint for pollen classification"""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Please upload an image.'
            }), 400
        
        # Read and process image
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Classify the image
        result = classifier.classify(image)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Classification failed: {str(e)}'
        }), 500

@app.route('/api/session', methods=['GET'])
def get_session_info():
    """Get session information"""
    return jsonify({
        'status': 'active',
        'timestamp': datetime.now().isoformat(),
        'classifications_today': random.randint(0, 15)
    })

@app.route('/api/session', methods=['DELETE'])
def logout_session():
    """Handle logout"""
    return jsonify({
        'success': True,
        'message': 'Session terminated successfully',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier.model_loaded,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs('uploads', exist_ok=True)
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)
