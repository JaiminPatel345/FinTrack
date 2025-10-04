from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'ocr-service'})

@app.route('/api/ocr/process', methods=['POST'])
def process_receipt():
    """Process receipt image and extract data using OCR"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Mock OCR processing - in real implementation, use Tesseract or similar
        mock_data = {
            'merchant': 'Sample Merchant',
            'date': '2024-10-04',
            'total': 125.50,
            'currency': 'USD',
            'items': [
                {'description': 'Item 1', 'amount': 50.00},
                {'description': 'Item 2', 'amount': 75.50}
            ],
            'confidence': 0.95
        }
        
        return jsonify({'success': True, 'data': mock_data})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/ocr/results/<result_id>', methods=['GET'])
def get_ocr_result(result_id):
    """Get OCR result by ID"""
    # In real implementation, fetch from MongoDB
    return jsonify({'success': True, 'data': {'id': result_id, 'status': 'completed'}})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5006))
    app.run(host='0.0.0.0', port=port, debug=True)
