import sqlite3

def create(data):
    try:
        con = sqlite3.connect('../db/app.db')
        cur = con.cursor()

        query = 'INSERT INTO student_users(display_name, first_name, last_name, birth, phone, email, password ) VALUES(?,?,?,?,?,?,?)'

        cur.execute(query, (data['display_name'], data['first_name'], data['last_name'], data['birth'], data['phone'], data['email'], data['password']))

        con.commit()
        con.close()
        return {"status":"success"}
    except sqlite3.Error as e:
        return {"status":"error", "error": str(e)}


# サンプルデータ
# {
#     "display_name":"kokoko",
#     "first_name":"山本",
#     "last_name":"太郎",
#     "birth":"2000-09-02",
#     "phone":"08055558888",
#     "email":"dkfidjs@gmail.com",
#     "password":"password"
# }
