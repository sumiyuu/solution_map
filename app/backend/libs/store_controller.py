import sqlite3
from libs.db_setting import get_db_path

def create(data):
    try:
        con = sqlite3.connect(get_db_path())
        cur = con.cursor()

        query = 'INSERT INTO store_users(store_name, store_address, contact_name, phone_number, email, password ) VALUES(?,?,?,?,?,?);'

        cur.execute(query, (data['store_name'], data['store_address'], data['contact_name'], data['phone_number'], data['email'], data['password']))

        con.commit()
        con.close()
        return {"status":"success"}
    except sqlite3.Error as e:
        return {"status":"error", "error": str(e)}