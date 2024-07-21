from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)


# Conexión a base de datos
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="db_gestion_libros"
)

# Crear cursor
cursor = mydb.cursor()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/libros", methods=["GET"])
def mostrar_libros():
    sql = "SELECT * FROM libros"
    cursor.execute(sql)
    myresult = cursor.fetchall()
    return jsonify(myresult)

@app.route("/", methods=["POST"])
def agregar_libros():
    # Convierto datos de la solicitud en diccionario Python
    data = request.json
    sql = """
    INSERT INTO libros (titulo, autor, release_date, genero, score) 
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (data["titulo"], data["autor"], data["release_date"], data["genero"], data["score"])

    cursor.execute(sql,values)

    return jsonify({"message":"Libro agregado!"}, 201)

@app.route("/<int:id_libro>", methods=["PUT"])
def editar_libro(id_libro):
    data = request.json

    sql = """
        UPDATE libros SET titulo = %s, autor = %s, release_date = %s, 
        genero = %s, score = %s WHERE id_libro = %s
        """
    
    values = (data["titulo"], data["autor"], data["release_date"], data["genero"], data["score"], id_libro)

    cursor.execute(sql, values)

    mydb.commit()

    return jsonify({"message":"Libro editado con éxito"})

@app.route("/<int:id_libro>", methods=["DELETE"])
def eliminar_libro(id_libro):
    sql = "DELETE FROM libros WHERE id_libro = %s"
    val = (id_libro,)

    cursor.execute(sql, val)

    mydb.commit()

    return jsonify({"message":"Libro eliminado con éxito!"})






if __name__ == "__main__":
    app.run(debug=True)