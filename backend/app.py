import re
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importer CORS

app = Flask(__name__)

# Autoriser toutes les origines par défaut
CORS(app)  # Ajouter cette ligne pour permettre les requêtes CORS

# Fonction pour extraire latitude et longitude de l'URL de Google Maps
def extract_coordinates_from_url(url):
    # Expression régulière pour extraire les coordonnées après le '@'
    pattern = r'@(-?\d+\.\d+),(-?\d+\.\d+)'
    
    match = re.search(pattern, url)
    
    if match:
        latitude = float(match.group(1))
        longitude = float(match.group(2))
        return latitude, longitude
    else:
        return None, None

@app.route('/get_coordinates', methods=['POST'])
def get_coordinates():
    # Récupérer l'URL envoyée par l'utilisateur dans la requête
    url = request.json.get('url')
    
    if not url:
        return jsonify({"error": "URL manquante"}), 400

    # Extraire les coordonnées
    latitude, longitude = extract_coordinates_from_url(url)
    
    if latitude is not None and longitude is not None:
        print(f"Latitude: {latitude}, Longitude: {longitude}")
        return jsonify({"latitude": latitude, "longitude": longitude})
    else:
        return jsonify({"error": "Coordonnées non trouvées dans l'URL"}), 400

if __name__ == '__main__':
    app.run(debug=True)
