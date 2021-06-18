# ProyectoFinalDVI - Super Meat Boy

Nuestro proyecto se basa en el videojuego llamado **Super Meat Boy**, realizado para la asignatura de **Desarrollo de videojuegos mediante tecnologías Web 20/21**. El grupo lo formamos **Adrián Salvador Crespo**, **Miriam Cabana Ramírez** y **Sergio José Gómez Cortés**.






## 1. Diseño del juego
### 1.1. Objetivo del juego (cómo se gana, cómo se pierde)

 Super Meat Boy es un juego de plataformas en el que Meat Boy tiene que rescatar Bandage Girl en cada mapa y superar los distintos obstaculos que se le presentan (sierras con dinámicas diferentes, tierra que se deshace, cerrojos que tiene que abri con llaves a lo largo de los mapas, enemigo final...). Tiene que superar todos estos obstáculos en cada mapa, pero si muere, vuelve a empezar en el nivel en el que se encuentra, no hay límite de vidas, tiene que conseguir llegar a su meta, Bandage Girl en todo momento.





### 1.2. Principales mecánicas

Meat Boy, nuestro jugador, tiene un movimiento con aceleración que es lo característico de él. Puede saltar de forma normal como saltar contra la pared para poder impulsarse aún más. También puede deslizarse contra ella.

Además existen bloques de tierra que se destruyen al poco de que MeatBoy los toque.

Por otro lado, si hablamos de las distintas llaves que aparecen en los mapas, Meat Boy puede cogerlas para abrir los cerrojos que pueda haber en el nivel en el que se encuentra.

Pulsando R en el teclado podemos resetear el mapa actual, evitando que nos quedemos atascados.

Como "enemigo" principal encontramos las sierras, que puden ser estáticas, o presentar un movimiento horizontal, vertical, diagonal o angular.
También pueden ser generadas y lanzadas a traves del escenario hasta que colisiones contra algo, en este caso se destruyen.

Y como último recurso, el malvado **Doctor Fetus** ha creado un robot con el que intentará acabar con **Meat Boy** y llevarse a **Bandage Girl** para siempre. ¡Huye de él! Quizas el
robot acabe explotando...




### 1.3. Personajes

Tenemos 3 personajes principales, **Meat Boy**, que es un cubo de color rojizo; **Bandage Girl**, la chica que Meat Boy quiere rescatar, que también es un cubo pero de color rosa. Y el malvado **Doctor Fetus**, que es el que ha secuestrado a Bandage Girl. 
	





## 2. Diseño de la implementación (arquitectura y principales componentes)

En esta asignatura hemos utilizado por primera vez **Quintus**, un motor de juegos JavaScript HTML5. Aún no tiene tanto material como otros motores, por lo que nos ha costado en muchas ocasiones encontrar lo que buscábamos, pero se pueden hacer cosas muy interesantes.
Hemos utilizado editores como **Sublime Text** y **VS Code**, lo cual nos ha ayudado a ver el código de una mejor manera, visualmente hablando. También utilizamos la consola de Chrome para probar y debuggear el flujo que realizaba. 

En cuanto al tema de JavaScript y HTML, hemos utilizado editores como Sublime Text y VS Code, lo cual nos ha ayudado a ver el código de una mejor manera visualmente hablando. También utilizamos la consola de Chrome para debuggear el flujo que realizaba, nos ha sido muy útil.

Por otro lado, los diferentes mapas que hemos creado han sido en **Tiled**, un editor de mapas que se adapta a todo tipo de proyectos. El formato de Tiled es el TMX, que es un fichero XML.

La edición de imágenes ha sido algo muy recurrente a lo largo de la práctica y vimos que **MediBang** y **GIMP** nos ayudaban un montón en esta parte.

Todo esto lo hemos podido trabajar en equipo y de manera síncrona gracias a **Git**, lo cual nos ha permitido tener un buen registro de los cambios que hacíamos y tener un trabajo más estructurado. 






## 3. Equipo de trabajo y reparto de tareas (descripcíón y carga de trabajo)

El trabajo lo repartimos de manera que pudieramos colaborar todos por igual. Ya que nos era muy dificil coincidir por los diferentes horarios, hicimos reuniones semanales para ir viendo cosas que iban surgiendo, dudas o propuestas entre nosotros. Pudimos trabajar individualmente y en grupo.

Para la primera entrega...

En conjunto desarrollamos el juego base sobre el que aplicar las nuevas mecánicas, así contábamos con un MeatBoy con un movimiento mas burdo
y capaz de saltar desde las paredes y el suelo, y sierras estáticas como obstaculos mortales para MeatBoy.
También hicimos un par de mapas con diversas capas, que no colisionaban, y la capa principal en la que se movía MeatBoy.
Además incluimos una pantalla de inicio y de final.


Y para la entrega final...

**Adrián**:
- El Boss
- Velocidad de movimiento y salto de MeatBoy
- Animación de muerte de MeatBoy

**Miriam**: 
- Bordes del mapa
- Cronómetro
- Sonidos
- Transicion entre mapas / final
- Readme con los demás


**Sergio**:
- Sprites del MeatBoy y Bandage Girl mejorados
- Sierras que se generan y se mueven en bucle (vertical, horizontal y angular)
- Generadores de sierras
- Mapa Boss
- Mapa 4
- Llaves y Cerrojos
- Tierra que se destruye
- Animación de BandageGirl

A través de Discord y WhatsApp nos hemos comunicado y ayudado entre los 3. Muchas veces estábamos conectados, si no éramos los 3, éramos 2 o si estabamos haciendo cosas de DVI, estaba uno mismo en el canal de Discord por si otro quería comunicarse o lo que necesitaramos. Sergio ha estado muy implicado en todo momento y en todas las fases del videojuego, trabajando y resolviendo contratiempos que han ido surgiendo.



## 4. Demo del juego final
Aquí está la demo de la versión final: https://www.youtube.com/watch?v=4L0x40davmY





## 5. Fuentes y referencias

Gracias a estas fuentes hemos podido recopilar todo lo necesario para poder realizar esta práctica, tanto ayuda para poder programar correctamente como material para el videojuego:

* https://es.wikipedia.org/wiki/Super_Meat_Boy

* https://www.youtube.com/watch?v=PWY7ndruY2c&list=PL1A86CAFBA7B7323E

* https://es.stackoverflow.com/

* https://www.spriters-resource.com/pc_computer/supermeatboy/sheet/37357/

* https://www.sounds-resource.com/pc_computer/supermeatboy/sound/407/

* http://www.html5quintus.com/

* https://github.com/cykod/Quintus