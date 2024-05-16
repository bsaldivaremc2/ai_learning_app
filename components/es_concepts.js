class Concepts extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
         <section id="intro_doc" class="mt-3" style="margin-bottom: 20px;" >
              <h3> Conceptos Fundamentales </h3>
              <p>
                 El aprendizaje automático (ML) es una rama de la computación que permite a las máquinas aprender de los datos y hacer predicciones sin estar explícitamente programadas para ello. Se utiliza en tareas cotidianas como la predicción del clima, detectores de metales en bancos y el reconocimiento facial.

                 Hay dos tipos principales de aprendizaje automático:

                 1.  Aprendizaje supervisado: Aquí, el modelo se entrena con datos que ya están etiquetados con la respuesta correcta. Por ejemplo, para diferenciar entre imágenes de perros y gatos, se usa un conjunto de imágenes de perros y gatos etiquetadas. El modelo aprende a identificar las imágenes basándose en estas etiquetas.

                 2.  Aprendizaje no supervisado: En este caso, el modelo no necesita datos etiquetados. En lugar de eso, agrupa los datos por similitudes. Por ejemplo, en un conjunto de imágenes de números escritos a mano, el modelo agrupa los números similares sin saber previamente qué número es cada uno.

                 En ambos casos, el proceso involucra tres pasos: recopilar datos, usar un algoritmo para encontrar patrones en esos datos, y crear un modelo que pueda hacer predicciones sobre nuevos datos basándose en esos patrones.
              </p>
              
              <h4> Métricas de evaluación </h4>
              <p>
               Cuando estudiamos en la escuela, el maestro evalúa nuestras respuestas en los exámenes comparándolas con las respuestas correctas y luego nos da una calificación basada en cuántas respuestas acertamos. Evaluar si un modelo está aprendiendo correctamente funciona de manera similar. Tenemos una lista de respuestas correctas, como un conjunto de etiquetas para imágenes de perros y gatos.
              
               Los algoritmos de aprendizaje automático utilizan fórmulas matemáticas, llamadas métricas, para medir qué tan bien está aprendiendo el modelo. Hay tres métricas de evaluación principales: precisión, exactitud y recuperación. La precisión nos da una idea general del rendimiento del modelo, pero a veces necesitamos analizar más a fondo usando exactitud y recuperación, dependiendo del caso.
              
               Todas estas métricas se derivan de una tabla que organiza todas las respuestas correctas e incorrectas del modelo, llamada matriz de confusión:
              </p>
              
              
              <div class="row" >
                  Vamos a centrarnos en el problema de clasificar imágenes de gatos y perros. Tenemos muchas imágenes en las que sabemos qué animal aparece. Construimos un modelo y evaluamos sus respuestas correctas e incorrectas con esta tabla. De 180 imágenes, el modelo acertó en 150.
                
                  En la tabla, cada celda tiene un nombre basado en la etiqueta, en este caso, "gato". Los gatos son los ejemplos positivos y los perros son los ejemplos negativos. Los "verdaderos positivos" (VP) son imágenes etiquetadas y predichas como gatos, y los "verdaderos negativos" (VN) son imágenes etiquetadas y predichas como perros. Los "falsos positivos" (FP) son imágenes etiquetadas como perros pero predichas como gatos, y los "falsos negativos" (FN) son imágenes etiquetadas como gatos pero predichas como perros.
              
                  <div class="col-md-12 text-center" >
                      <img src='imgs/confusion_matrix.png'  />
                  </div>
                  
                  <ul> Basándonos en estas cuatro variables (VP, VN, FP, FN), podemos calcular tres métricas diferentes:
                    <li> <b>Exactitud: </b> Esta métrica mide la proporción de predicciones correctas sobre el total de predicciones. Fórmula: (VP + VN) / (VP + VN + FP + FN). Por ejemplo, sería (90 + 60) / (60 + 90 + 20 + 10) = 0.833, lo que se representa como un 83.3%.</li>
                    <li> <b>Precisión: </b> Esta métrica se enfoca en la precisión de las predicciones positivas. Es decir, cuántas de las predicciones positivas son realmente correctas. Fórmula: (VP) / (VP + FP). Por ejemplo, sería (60) / (60 + 20) = 0.75, lo que representa un 75%. De todas las imágenes que el modelo identificó como gatos, solo el 75% realmente eran gatos.</li>
                    <li> <b>Recuperación: </b> Esta métrica mide la capacidad del modelo para identificar correctamente todas las instancias positivas. Fórmula: (VP) / (VP + FN). Por ejemplo, sería (60) / (60 + 10) = 0.8571, lo que representa un 85.71%. De todas las imágenes que realmente eran de gatos, el modelo identificó correctamente el 85.71%.</li>
                  </ul>
              </div>
  
          </section>
  
          <style >
            .tag_edam{
              font-weight: 400;
              color: #050514;
            }
          </style>
      `;
    }
  }
  customElements.define('concepts-component', Concepts);
  