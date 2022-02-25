import sqlite3

class DB:

    def get_connection(self):
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        conn = self.get_connection()
        with open('initdb.sql') as f:
            conn.executescript(f.read())

    def select(self, sql, parameters):
        conn = self.get_connection()
        rows = conn.execute(sql, parameters).fetchall()
        conn.close()
        return rows

    def insert(self, sql, parameters):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, parameters)
        conn.commit()
        conn.close()
