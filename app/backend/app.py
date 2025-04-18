from flask import Flask, send_from_directory, request, jsonify, make_response

FRONTEND_VIEWS = "../frontend/views"
FRONTEND_CSS = "../frontend/stylecss"
FRONTEND_JS = "../frontend/javascript"

app = Flask(__name__)

@app.route('/')
def home():
		return send_from_directory( FRONTEND_VIEWS, 'user_login.html')

@app.route('/stylecss/<path:filename>')
def serve_css(filename):
    return send_from_directory(FRONTEND_CSS, filename)

@app.route('/javascript/<path:filename>')
def serve_js(filename):
    return send_from_directory(FRONTEND_JS, filename)

@app.route('/user-login')
def user_login():
	return send_from_directory( FRONTEND_VIEWS, 'user_login.html')

@app.route('/user-register')
def user_register():
	return send_from_directory( FRONTEND_VIEWS, 'user_register.html')

@app.route('/map')
def main_map():
	return send_from_directory( FRONTEND_VIEWS, 'main_map.html')

if __name__ == ('__main__'):
		app.run(debug=True,  host='localhost', port=8080)
