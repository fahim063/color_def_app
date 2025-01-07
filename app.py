from flask import Flask, make_response, request, jsonify, render_template
import os
import json
import random

app = Flask(__name__)  # Initialize the Flask app

# Directory to save results
RESULTS_DIR = "results"
os.makedirs(RESULTS_DIR, exist_ok=True)

@app.route('/')
def home():
	return render_template('index.html')

# Generate a random FM100 Hue Test sequence
@app.route('/generate-test', methods=['GET'])
def generate_test():
    # Define the 4 rows' start and end colors (in RGB format)
    row_colors = [
        {"start": (178, 118, 11), "end": (157, 142, 72)},  
        {"start": (151, 145, 75), "end": (82, 150, 135)}, 
        {"start": (78, 150, 137), "end": (123, 132, 163)},  
        {"start": (132, 132, 163), "end": (179, 118, 115)}
    ]

    hue_test = []  # Store all generated tiles

    for row_index, colors in enumerate(row_colors):
        start_color = colors["start"]
        end_color = colors["end"]

        row_tiles = []
        in_between_tiles = []

        for i in range(10):
            if i == 0:  # First tile (start color)
                tile_color = start_color
                tile_type = "fixed"  # Indicate fixed tiles
            elif i == 9:  # Last tile (end color)
                tile_color = end_color
                tile_type = "fixed"
            else:  # Interpolate the color for the in-between tiles
                t = i / 9  # Normalized position (0 to 1)
                tile_color = (
                    int(start_color[0] + (end_color[0] - start_color[0]) * t),  # R
                    int(start_color[1] + (end_color[1] - start_color[1]) * t),  # G
                    int(start_color[2] + (end_color[2] - start_color[2]) * t)   # B
                )
                tile_type = "sortable"
                in_between_tiles.append({
                    "id": f"row-{row_index}-tile-{i}",
                    "color": f"rgb{tile_color}",
                    "type": tile_type
                })

            # Add fixed tiles directly
            #if tile_type == "fixed":
                #row_tiles.append({
                    #"id": f"row-{row_index}-tile-{i}",
                    #"color": f"rgb{tile_color}",
                    #"type": tile_type
                #})

            # Randomize the 8 in-between tiles
        random.shuffle(in_between_tiles)

        # Build the row with start, shuffled in-between, and end tiles
        row_tiles = [
            {"id": f"row-{row_index}-tile-0", "color": f"rgb{start_color}", "type": "fixed"},  # Start tile
            *in_between_tiles,  # Add the shuffled in-between tiles
            {"id": f"row-{row_index}-tile-9", "color": f"rgb{end_color}", "type": "fixed"}   # End tile
        ]



        hue_test.extend(row_tiles)  # Add the row to the overall tiles

        #print(row_tiles)

        response = make_response(jsonify(hue_test))
        response.headers["Cache-Control"] = "no-store"  # Prevent caching
        

    return response

# Save user responses
@app.route('/submit-results', methods=['POST'])
def submit_results():
	data=request.json
	user_id = data.get('user_id', 'unknown')
	responses = data.get('responses', [])
	
	#save to json
	with open(f"{RESULTS_DIR}/{user_id}_results.json", "w") as f:
		json.dump(responses,f)
		
	return jsonify({"status":"success", "message": "Results_saved."})
	
	
if __name__ == '__main__':
	app.run(debug=True)
	
	