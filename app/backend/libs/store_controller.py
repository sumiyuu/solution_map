import sqlite3, time, os
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

def show(id):
    try:
        con = sqlite3.connect(get_db_path())
        cur = con.cursor()

        query = "SELECT store_name, store_address FROM store_users WHERE id = ?;"
        info_1 = cur.execute(query,(id,)).fetchone()

        query = "SELECT description, student_discount, category_id FROM store_info WHERE store_users_id = ?;"
        info_2 = cur.execute(query,(id,)).fetchone()

        store_info = {
            "store_name":info_1[0],
            "store_address":info_1[1],
            "description":info_2[0],
            "student_discount":info_2[1],
            "category_id":info_2[2]
        }

        con.commit()
        con.close()

        return store_info

    except sqlite3.Error as e:
        return {"status": "error", "error": str(e)}

def update(data):
    try:
        con = sqlite3.connect(get_db_path())
        cur = con.cursor()

        query = "SELECT id FROM store_users WHERE store_name = ?;"
        id = cur.execute(query,(data['store_name'],)).fetchone()

        store_id = id[0]

        query = "UPDATE store_info SET description = ?, student_discount = ?, category_id = ? WHERE store_users_id = ?;"
        cur.execute(query, ( data['store_description'], data['student_discount'], data['category_id'], store_id))

        if cur.rowcount == 0:
            raise Exception("No record updated. store_users_id may not exist.")

        con.commit()
        con.close()
        return {"status": "success"}

    except sqlite3.Error as e:
        return {"status": "error", "error": str(e)}
    

def upload_image(image, absolute_path, store_name):
    _, ext = os.path.splitext(image.filename)
    timestamp = time.strftime("%Y%m%d%H%M%S")

    con = sqlite3.connect(get_db_path())
    cur = con.cursor()

    query = "SELECT id FROM store_users WHERE store_name = ?;"
    id = cur.execute(query,(store_name,)).fetchone()

    query = "SELECT category_id FROM store_info WHERE store_users_id = ?;"
    existing_image = cur.execute(query,(id[0],)).fetchone()

    if existing_image[0] != None:
        existing_image_path = f"{absolute_path}/{existing_image[0]}"
        os.remove(existing_image_path)

    unique_filename = f"{timestamp}{ext}"

    save_path = os.path.join(absolute_path, unique_filename)
    image.save(save_path)

    return unique_filename