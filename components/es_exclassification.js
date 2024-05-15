class Clasificacion extends HTMLElement {
constructor() {
    super();
}

connectedCallback() {
    this.innerHTML = `
        <section id="intro_clasificacion" class="mt-3">
            <p>
                La clasificación es la tarea de predecir etiquetas predefinidas para piezas de datos, usando un modelo entrenado con datos etiquetados previos para cada clase de la aplicación del dominio.
            </p>

            <p>
                En esta parte de la app puedes explorar y usar tus propios datos de imagen para probar los modelos en dos contextos de conjuntos de datos: (i) Modelo para clasificar si la imagen tiene un perro o un gato; (ii) Modelo para clasificar si un dígito escrito a mano está en el rango de 0 a 9. Los datos originales para el problema (i) se obtuvieron de <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > aquí </a>, y los datos para los dígitos se descargaron <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > aquí </a>.
            </p>

            <h5>Elige el conjunto de datos: </h5>
            <div class="row g-2 align-items-center">
            <div class="col-auto">
                <label class="form-label" > Conjunto de datos:</label>
                <select id="dataset" class="form-control " onChange="init_case_clasificacion()"  >
                    <option value="catDogs" > Gatos x Perros </option>
                    <option value="digits" > Números (0-9) </option>
                    <!--<option value="custom" > Conjunto de datos personalizado </option>-->
                </select>
            </div>
            
            <p id='notice' >   </p>
            </div>

            <!--
            Panel para mostrar los datos cargados
            -->

        </section>

        <section id="uso_clasificacion" class="mt-3" style="margin-bottom: 20px;" >

            <div class="accordion" id="accordionClasificar">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Aplicando modelo pre-entrenado
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionClasificar">
                        <div class="accordion-body">
                            <p>
                            En esta sección, puedes elegir cualquier imagen y verificar la clasificación según el modelo que elegiste previamente. Ten en cuenta que los modelos solo saben reconocer objetos similares a los que se les presentaron durante el entrenamiento. Será difícil para el modelo de gatos x perros manejar imágenes fuera de este contexto (una imagen de un número), tan difícil como presentar una imagen de un perro para predecir con el modelo que clasifica dígitos escritos a mano. El modelo entrenado para el problema de gatos x perros se obtuvo de <a href='https://github.com/dkreider/tensorflowjs-cat-vs-dog' target='_blank' > aquí </a> mientras que el modelo para reconocimiento de dígitos se obtuvo de <a href='https://gogulilango.com/software/digit-recognizer-tf-js' target='_blank' > aquí </a>
                            </p>

                            <div class="row g-2 align-items-start">
                                <div class="col-auto" id='fromImage' >
                                    <label class="form-label" >Elige un archivo de imagen:</label>
                                    <input class="form-control" type="file" onchange="onLoadPreview(event)" accept="image/*" id="field_cls_predict" />

                                    <div id="container_predict" style=" margin-top: 10; display: none; " >
                                        <img id='img_predict' src="" width="224" height="224" alt="preview" />
                                    </div>

                                </div>
                                
                                
                                <div class="col-auto"  id='fromCanvas' style='display: none;' >
                                    <label class="form-label" > Intenta dibujar un número (Dígitos del 0 al 9 en el área negra usando el mouse):</label>

                                    <div id="canvas_box_wrapper" class="canvas-box-wrapper">
                                    <div id="canvas_box" class="canvas-box"></div>
                                        <button id="clear_canvas" class="btn btn-secondary mt-2" onclick="clearCanvas(this.id)">Borrar</button>
                                        
                                    <img src="" id='canvas_image' style='display: none; background-color: blue; margin-top:10px;'/>
                                    </div>

                                </div>
                                

                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary disab" style="margin-top: 32px;" onClick="predictFromPretrained()" > Predecir </button>
                                    <div id="area_result" >
                                        <h4 class="mt-4"> Resultado: </h4>

                                        <div id="result_cls" style="font-size: 50; padding: 15px: border: 2px solid blue;" > </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            Construyendo un modelo
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionClasificar">
                        <div class="accordion-body">
                            <p>
                            Normalmente, los modelos pueden aprender mejor cuando usamos un número equilibrado de ejemplos de cada clase que queremos poder predecir.
                            Sin embargo, puedes entrenar un modelo usando proporciones distintas. En algunas aplicaciones, puede haber pocos ejemplos de una clase y muchos de las otras clases.<br />
                            
                            En este ejemplo de ejercicio, se preparó un subconjunto de los dos conjuntos de datos disponibles en la app (gatos x perros, y los números) con 200 ejemplos de cada clase de datos, para ilustrar algunos conceptos útiles sobre la organización de datos y la evaluación del modelo. La arquitectura del modelo es fija para una red neuronal con dos capas ocultas de convolución 2D. Los pasos de procesamiento de datos y el procedimiento para igualar los ejemplos entre clases se pueden encontrar en el script features_transform.py en este repositorio.
                            
                            <!--Para superar este problema, existen técnicas que generan datos sintéticos de la clase subrepresentada para aumentar el número de ejemplos y ayudar a construir un mejor modelo.-->
                            </p>

                            <!--
                            <h5>Elige el conjunto de datos: </h5>
                            <div class="row g-2 align-items-center">
                            <div class="col-auto">
                                <label class="form-label" > Conjunto de datos:</label>
                                <select id="dataset_tr" class="form-control " onChange="treat"  >
                                    <option value="catDogs" > Gatos x Perros </option>
                                    <option value="digits" > Números (0-9) </option>
                                    <option value="custom" > Conjunto de datos personalizado </option>
                                </select>
                            </div>
                            </div>
                            -->

                            <h5 class="mt-3" >Elige la proporción de cada clase para alimentar el modelo: </h5>
                            <div class="row g-2 align-items-center" id="proporcion_clases" >
                            <div class="col-auto">
                                <label class="form-label" > Proporción clase 1 (perros):</label>
                                <select id="perc_cls1" class="form-control " onChange = "treatProportion()"  >
                                    <option value="20" > 20% </option>
                                    <option value="40" > 40% </option>
                                    <option value="50" > 50% </option>
                                    <option value="60" > 60% </option>
                                    <option value="80" > 80% </option>
                                    <option value="100" selected > 100% (Todos los ejemplos disponibles) </option>
                                </select>
                            </div>
                            <div class="col-auto">
                                <label class="form-label" > Proporción clase 2 (gatos):</label>
                                <select id="perc_cls2" class="form-control "  disabled >
                                    <option value="20" > 20% </option>
                                    <option value="40" > 40% </option>
                                    <option value="50" selected > 50% </option>
                                    <option value="60" > 60% </option>
                                    <option value="80" > 80% </option>
                                    <option value="100" selected > 100% (Todos los ejemplos disponibles) </option>
                                </select>
                            </div>
                            </div>

                            <h5 class="mt-3" >Elige la porción de ejemplos a usar en el paso de entrenamiento: </h5>
                            <div class="row g-2 align-items-center">
                            <div class="col-auto">
                                <label class="form-label" > Porción de datos de muestra a usar:</label>
                                <select id="perc_n" class="form-control "  >
                                    <option value="40" > 40% </option>
                                    <option value="50" > 50% </option>
                                    <option value="60" > 60% </option>
                                    <option value="80" > 80% </option>
                                    <option value="100" selected > 100% (Todos los ejemplos disponibles) </option>
                                </select>
                            </div>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-primary disab" onClick="buildCustomModelEvaluate()" > Construir modelo  </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

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
customElements.define('clasificacion-componente', Clasificacion);

function treatProportion(){
let cdog = parseInt( document.getElementById('perc_dog').value );
let ccat = 100 - cdog;
document.getElementById('perc_cat').value = ccat;
}

let previewUrl = "";
function onLoadPreview(e) {
    const imagen = e.target.files[0];
    if (!imagen) {
        document.getElementById("container_predict").style.display='none';
        return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(imagen);
    document.getElementById("img_predict").src = previewUrl;
    document.getElementById("container_predict").style.display='';
}

function predictFromPretrained() {
let input = document.getElementById('field_cls_predict');
if( input.files.length > 0 || dataset.value == 'digits' ){
    tf.engine().startScope();
    
    let inn = null;
    
    let resultado = '';
    if( obj_cls.classes.length == 2 ){
        inn = modProcess.getVectorFromImgTag( img_predict );
        resultado = modProcess.predictBinary( inn, obj_cls, obj_cls.model, obj_cls.dimension );
    }
    else {
        inn = modProcess.getVectorFromCanvas();
        resultado = modProcess.predictMulti( inn, obj_cls, obj_cls.model, obj_cls.dimension );
    }
    tf.engine().endScope();
    
    if( dataset.value == 'catDogs' ){
        resultado = ( resultado == 'Dog') ? '🐶' : '😸' ;
    }
    
    document.getElementById('result_cls').innerHTML = `<span> ${resultado} </span>`;
    area_result.style.display='';
}
else{
    alert('No hay ninguna imagen seleccionada');
}
}

async function buildCustomModelEvaluate(){
    tf.engine().startScope();
    
    let modelo = modProcess.getModelImage( obj_cls );
    let modelo_entrenado = await modProcess.train( obj_cls, modelo );
    await modViz.showAccuracy( obj_cls, modelo_entrenado );
    await modViz.showConfusion( obj_cls, modelo_entrenado );
    
    tf.engine().endScope();
}

function prepareFieldsProportionClasses(){
    let htmls = "";
    let i = 1
    for ( let c of obj_cls.classes ){
        htmls += `
        <div class="col-auto">
            <label class="form-label" > Proporción clase ${ i } ( ${ c } ):</label>
            <select id="perc_cls${ i }" class="form-control "   >
                <option value="20" > 20% </option>
                <option value="40" > 40% </option>
                <option value="50" > 50% </option>
                <option value="60" > 60% </option>
                <option value="80" > 80% </option>
                <option value="100" selected > 100% (Todos los ejemplos disponibles) </option>
            </select>
        </div>
        `;
        i+=1
    }
    
    proporcion_clases.innerHTML = htmls;
}

function getProportionClasses(){
    let prop = {}
    
    let i = 1
    for ( let c of obj_cls.classes ){
        prop[`cls${i}`] = parseInt( eval(`perc_cls${i}`).value );
        i += 1;
    }
    
    return prop
}

let obj_cls = null;
let init_case_clasificacion = () => {
    area_result.style.display='none';
    document.querySelectorAll('.disab').forEach( e => e.disabled=true );
    notice.innerHTML = 'Espera... Cargando el modelo...';
    
    let modelId = document.getElementById('dataset').value;
    let totalData = parseInt(perc_n.value);
    
    obj_cls = new AIExp( modelId, totalData );
    
    if( dataset.value == 'catDogs' ){
        fromImage.style.display = '';
        fromCanvas.style.display = 'none';
    }
    else{
        fromImage.style.display = 'none';
        fromCanvas.style.display = '';
    }
    
    obj_cls.loadModel()
    .then( ( modelos ) => {
        let dimImage = obj_cls.maxDim;
        
        prepareFieldsProportionClasses();
        let proportions = getProportionClasses();
        obj_cls.proportionsPerClass = proportions;
        console.log(obj_cls)
            
        document.querySelectorAll('.disab').forEach( e => e.disabled=false );
        notice.innerHTML = 'Modelo cargado';
    })
    .catch((err) => {
    console.log( err );
    })

}
init_case_clasificacion()
