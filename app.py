from flask import Flask, render_template, request, jsonify
from conexionDB import *
from werkzeug.exceptions import BadRequest

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/libros", methods=["GET"])
def mostrar_libros():
    con = connectionDB()
    sql = "SELECT * FROM libros"

    # Crear cursor
    cur = con.cursor()
    cur.execute(sql)

    myresult = cur.fetchall()

    cur.close()
    con.close()
    
    return jsonify(myresult)

@app.route("/api/libros", methods=["POST"])
def agregar_libros():
    con = connectionDB()
    # Convierto datos de la solicitud en diccionario Python
    data = request.json

    # Enviar un error 400 si el score es incorrecto.
    if not (1 <= int(data["score"])) <= 10:
        raise BadRequest("El score es inválido")
    
    sql = """
        INSERT INTO libros (titulo, autor, release_date, genero, score) 
        VALUES (%s, %s, %s, %s, %s)
        """

    values = (data["titulo"], data["autor"], data["fecha"], data["genero"], data["score"])

    cur = con.cursor()
    cur.execute(sql,values)
    con.commit()
    cur.close()
    con.close()

    return jsonify({"message":"Libro agregado!"}, 201)

@app.route("/api/libros/<int:id_libro>", methods=["GET","PUT"])
def editar_libro(id_libro):
    con = connectionDB()
    cursor = con.cursor()

    # Si el método de la solicitud es GET
    if request.method == 'GET':
        sql = "SELECT titulo, autor, release_date, genero, score FROM libros WHERE id_libro = %s"

        cursor.execute(sql,(id_libro,))

        # Obtengo el registro que acabo de insertar
        data = cursor.fetchone()
        cursor.close()
        con.close()
        
        if data:
            return jsonify({
                "titulo": data[0],
                "autor": data[1],
                "fecha": data[2],
                "genero": data[3],
                "score": data[4]
            })
        else:
            return jsonify({"message":"Datos no encontrados"})
    
    elif request.method == 'PUT':
        data = request.json

        sql = """
            UPDATE libros SET titulo = %s, autor = %s, release_date = %s, 
            genero = %s, score = %s WHERE id_libro = %s
            """
    
        values = (data["titulo"], data["autor"], data["fecha"], data["genero"], data["score"], id_libro)

        cursor.execute(sql, values)

        con.commit()
        cursor.close()
        con.close()

        return jsonify({
            "message":"Libro editado con éxito",
            "titulo":data["titulo"],
            "autor":data["autor"],
            "fecha":data["fecha"],
            "genero":data["genero"],
            "score":data["score"]
        })

@app.route("/api/libros/<int:id_libro>", methods=["GET", "DELETE"])
def eliminar_libro(id_libro):
    con = connectionDB()
    sql = "DELETE FROM libros WHERE id_libro = %s"
    val = (id_libro,)

    cursor = con.cursor()
    cursor.execute(sql, val)

    con.commit()
    cursor.close()
    con.close()

    return jsonify({"message":"Libro eliminado con éxito!"})






if __name__ == "__main__":
    app.run(debug=True)