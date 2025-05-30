from flask import Flask, send_from_directory, request, url_for, jsonify
from libs import user_students_controller, store_controller
import os

STORE_VIEWS = "../frontend/views/store"
STUDENT_VIEWS = "../frontend/views/student"
CSS = "../frontend/css"
JS = "../frontend/js"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_PATH = os.path.join(BASE_DIR, 'image')
# IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), 'image')

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = IMAGE_PATH

@app.route('/')
def home():
		return send_from_directory( STUDENT_VIEWS, 'user_login.html')

@app.route('/stylecss/<path:filename>')
def serve_css(filename):
    return send_from_directory(CSS, filename)

@app.route('/javascript/<path:filename>')
def serve_js(filename):
    return send_from_directory(JS, filename)

@app.route('/uploaded_image/<filename>')
def serve_uploaded_image(filename):
    return send_from_directory(IMAGE_PATH, filename)

############################################ STUDENT ############################################
@app.route('/user-login')
def user_login():
	return send_from_directory( STUDENT_VIEWS, 'user_login.html')

@app.route('/user-register')
def user_register():
	return send_from_directory( STUDENT_VIEWS, 'user_register.html')

# 学生の新規登録
@app.route('/user-register', methods=['POST'])
def user_register_post():
	data = request.get_json()
	res = user_students_controller.create(data)
	if res['status'] == 'success':
		return jsonify({"redirect": url_for('main_map')})
	else:
		if res["error"] == "UNIQUE constraint failed: student_users.display_name":
			return jsonify({"status":"error","msg": "この表示名はすでに登録されています。"})
		return res

@app.route('/user-profile')
def user_profile():
	return send_from_directory( STUDENT_VIEWS, 'user_profile.html')

@app.route('/user-profile-edit')
def user_profile_edit():
	return send_from_directory( STUDENT_VIEWS, 'user_profile_edit.html')

@app.route('/map')
def main_map():
	return send_from_directory( STUDENT_VIEWS, 'main_map.html')

@app.route('/map/stores-info', methods=['GET'])
def get_info():
	stores_info = store_controller.index()
	return stores_info

#################################################################################################




############################################  STORE  ############################################

@app.route('/store-login')
def store_login():
	return send_from_directory( STORE_VIEWS, 'store_login.html')

@app.route('/store-register')
def store_register():
	return send_from_directory( STORE_VIEWS, 'store_register.html')

# 店舗の新規登録
@app.route('/store-register', methods=['POST'])
def store_register_post():
	data = request.get_json()
	res = store_controller.create(data)
	if res['status'] == 'success':
		return jsonify({"redirect": url_for('main_map')})
	else:
		if res["error"] == "UNIQUE constraint failed: store_users.store_name":
			return jsonify({"status":"error","msg": "この店舗はすでに登録されています。"})
		return res

@app.route('/store-info', methods=['GET'])
def store_info_show():
	id = request.args.get('id')
	res = store_controller.show(id)
	
	return res

@app.route('/store-info-edit')
def store_info_edit():
	return send_from_directory( STORE_VIEWS, 'store_info_edit.html')

@app.route('/store-info-edit', methods=['POST'])
def store_info_update():
	
	store_name = request.form.get('store_name')
	student_discount = request.form.get('student_discount')
	store_description = request.form.get('store_description')

	path = None

	if 'image' in request.files:
		file = request.files['image']
		path = store_controller.upload_image(file, IMAGE_PATH, store_name)

	else:
		path = store_controller.get_image(store_name)



	data = {
		"store_name" : store_name,
		"student_discount" : student_discount,
		"store_description" : store_description,
		"category_id" : path
	}

	res = store_controller.update(data)

	if res['status'] == 'success':
		return jsonify({"redirect": url_for('main_map')})
	else:
		if res["error"] == "UNIQUE constraint failed: store_users.store_name":
			return jsonify({"status":"error","msg": "この店舗はすでに登録されています。"})
		return res



################################################################################################

if __name__ == ('__main__'):
		app.run(debug=True,  host='localhost', port=8080)
