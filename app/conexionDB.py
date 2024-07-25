import mysql.connector
# Conexión a base de datos

def connectionDB():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="db_gestion_libros"
    )

    if (mydb):
        print("Conexión exitosa a la base de datos")
        return mydb
    else:
        print("Falló la conexión a la BD")
