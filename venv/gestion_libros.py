import mysql.connector
import matplotlib.pyplot as plt
from crud import *
import sys

# Menú del programa
print("¡Bienvenido a nuestra biblioteca virtual!\n")
print("¿Qué desea hacer?")
print("1- Ver libros")
print("2- Agregar libros")
print("3- Actualizar libros")
print("4- Eliminar libros\n")
print("5- Ver gráfico de promedios\n")
print("6- Salir")

opcion = int(input("> "))

while not (opcion >= 1 and opcion <= 5):
    print("Opción inválida! Vuelve a intentarlo\n")
    opcion = int(input("> "))

if opcion == 1:
    mostrar_libros()

elif opcion == 2:
    agregar_libro()

elif opcion == 3:
   editar_libro()

elif opcion == 4:
    eliminar_libro()

elif opcion == 5:
    promedio_score_genero()

elif opcion == 6:
    sys.exit()
    

