import matplotlib.pyplot as plt
import numpy as np
import mysql.connector

# Conexión a base de datos
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="db_gestion_libros"
)

# Función para mostrar gráfico de barras de género
def mostrar_grafico_barras(registros):
    categorias = {}
    for x in registros:
        genero = x[4]
        if genero in categorias:
            categorias[genero] += 1
        else:
            categorias[genero] = 1

    x = list(categorias.keys())
    y = list(categorias.values())

    plt.bar(x,y)
    plt.title("Géneros de libros")
    plt.show()

def promedio_score_genero():
    sql = "SELECT * FROM libros"

    cursor = mydb.cursor()
    cursor.execute(sql)

    registros = cursor.fetchall()

    categorias = {}

    for x in registros:
        genero = x[4]
        score = x[5]
        if genero in categorias:
            categorias[genero].append(score)
        else:
            categorias[genero] = [score]
            
    promedios = {genero: sum(score)/len(score) for genero,score in categorias.items()}


    x = list(promedios.keys())
    y = list(promedios.values())
    print(x)
    print(y)

    etiquetas_gen = categorias.keys()

    plt.pie(y, labels=etiquetas_gen)
    plt.title("Promedio de calificaciones por género")
    plt.legend(title="Géneros")
    plt.show()