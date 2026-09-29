CONSUMO DE ENERGIA
1.	¿Cómo va a funcionar?
Se tiene en mente que sea un aplicativo en el que mi madre pueda hacer los cálculos de cuanta energía están consumiendo los inquilinos en la casa tomando como base los precios que llegan en el recibo de energía y el numero de los contadores que muestran cuanto han consumido.

Existirá una sección en el que el usuario pueda ingresar los datos necesarios de cada contador para calcular el resultado final de cada consumo (número de cada contador), y como datos generales se tomara en cuenta el recibo de la luz (Pecio total de energía, precio total de aseo, kw consumidos en el mes )
En el aplicativo se necesita que se pueda acceder a los números de los contadores que se han ingresado anterior mente para observar cuanto ha aumentado el número y  que se haga el calculo de los kw consumidos por contador, el precio por consumidor de la energía consumida, el precio del aseo por consumidor y el precio del kw 

1.1 ¿Cómo funcionará el cálculo?
Cuando llega el recibo de la luz se toman en cuenta los siguientes datos: 

•	Precio total de la energía
•	Precio total del aseo
•	KW consumidos 
                Una vez con estos datos se toman los datos de la casa: 
•	El número del contador actual de cada apartamento
•	El número del contador anterior de cada apartamento
•	El numero de la cantidad de apartamentos que están rentados.
 
Ahora se debe calcular el precio del KW dividiendo el precio total de la energía por KW consumidos

Precio total de la energía / KW consumidos = Precio del KW
Después se calcula los KW consumidos por cada contador restando el numero actual del contador con el numero anterior

Número actual – Numero anterior = KW consumidos por contador

Una vez ya con los KW de cada contador o apartamento rentado se calcula el precio multiplicando el precio del KW por KW consumido de cada apartamento.

Precio del KW * KW consumido = Precio de consumo de cada apartamento. 

Lo ultimo por hacer es calcular el aseo por apartamento que solamente se divide el precio total de aseo por la cantidad de apartamentos.

Precio total de aseo / Cantidad de apartamentos = Precio de aseo por apartamento
Si llega a presentarse como en mi caso que en el apartamento donde vivo yo no tiene contador entonces restamos los KW consumidos con la suma de todos los KW de cada apartamento.

KW consumidos – Suma de KW de cada apartamento = consumo de apartamento sin contador.

2.	Herramientas necesarias

•	Xampp
•	Visual studio
•	Mysql workbench
•	Node JS
•	Git
•	Github
•	Chrome
 

3.	Tecnologías utilizadas:
•	Windows 11
•	React
•	MySQL 
•	Node JS
