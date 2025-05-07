from flask import Flask, send_from_directory, request, redirect, url_for, jsonify
from libs import user_students_controller

STUDENT_VIEWS = "../frontend/views/student"
STUDENT_CSS = "../frontend/stylecss/student"
FRONTEND_JS = "../frontend/javascript"

app = Flask(__name__)

@app.route('/')
def home():
		return send_from_directory( STUDENT_VIEWS, 'user_login.html')

@app.route('/stylecss/<path:filename>')
def serve_css(filename):
    return send_from_directory(STUDENT_CSS, filename)

@app.route('/javascript/<path:filename>')
def serve_js(filename):
    return send_from_directory(FRONTEND_JS, filename)

# 学生
@app.route('/user-login')
def user_login():
	return send_from_directory( STUDENT_VIEWS, 'user_login.html')

@app.route('/user-register')
def user_register():
	return send_from_directory( STUDENT_VIEWS, 'user_register.html')

@app.route('/user-profile')
def user_profile():
	return send_from_directory( STUDENT_VIEWS, 'user_profile.html')

@app.route('/user-profile-edit')
def user_profile_edit():
	return send_from_directory( STUDENT_VIEWS, 'user_profile_edit.html')

@app.route('/map')
def main_map():
	return send_from_directory( STUDENT_VIEWS, 'main_map.html')

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


# 飲食店情報



if __name__ == ('__main__'):
		app.run(debug=True,  host='localhost', port=8080)
