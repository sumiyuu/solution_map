import sqlite3

def create_database():
    con = sqlite3.connect("add.db")
    con.close()

create_database()
