import sqlite3
from libs.db_setting import get_db_path

def create(data):
    try:
        con = sqlite3.connect(get_db_path())
        cur = con.cursor()

        query = 'INSERT INTO store_users(store_name, store_address, contact_name, phone_number, email, password ) VALUES(?,?,?,?,?,?);'

        cur.execute(query, (data['store_name'], data['store_address'], data['contact_name'], data['phone_number'], data['email'], data['password']))

        query = 'SELECT id FROM store_users WHERE store_name = ?'
        cur.execute(query, (data['store_name'],))

        row = cur.fetchone()
        if row is None:
            raise Exception("store_id not found after insert")
        store_id = row[0]

        query = 'INSERT INTO store_info(store_users_id, latitude, longitude ) VALUES(?,?,?);'
        cur.execute(query, ( store_id, data['latitude'], data['longitude']))

        con.commit()
        con.close()
        return {"status":"success"}
    except sqlite3.Error as e:
        return {"status":"error", "error": str(e)}

def index():

    store_info = {}

    try:
        con = sqlite3.connect(get_db_path())
        cur = con.cursor()

        query = "SELECT store_users_id, latitude, longitude, category_id, description, student_discount FROM store_info;"

        data = cur.execute(query).fetchall()

        for i in range(len(data)):
            info_data = {
                "store_users_id":data[i][0],
                "latitude":data[i][1],
                "longitude":data[i][2],
                "image_path":data[i][3],
                "description":data[i][4],
                "student_discount":data[i][5]
            }

            store_info[i] = info_data 

        con.commit()
        con.close()

        return store_info
    except sqlite3.Error as e:
        return {"status":"error", "error": str(e)}