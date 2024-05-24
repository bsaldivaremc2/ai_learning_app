class Clasificacion extends HTMLElement {
constructor() {
    super();
}

connectedCallback() {
    this.innerHTML = `
        <section id="intro_clasificacion" class="mt-3">
            <p>
                La classificació és la tasca de predir etiquetes predefinides per a peces de dades, utilitzant un model entrenat amb dades etiquetades prèvies per a cada classe de l'aplicació del domini.
            </p>

            <p>
                En aquesta part de l'aplicació pots explorar i utilitzar les teves pròpies dades d'imatge per provar els models en dos contextos de conjunts de dades: (i) Model per classificar si la imatge té un gos o un gat; (ii) Model per classificar si una xifra escrita a mà està en el rang de 0 a 9. Les dades originals per al problema (i) es van obtenir de <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > aquí </a>, i les dades per a les xifres es van descarregar <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > aquí </a>.
            </p>

            <h5>Tria el conjunt de dades: </h5>
            <div class="row g-2 align-items-center">
                <div class="col-auto">
                    <label class="form-label" > Conjunt de dades:</label>
                    <select id="dataset" class="form-control " onChange="init_case_clasificacion()"  >
                        <option value="catDogs" > Gats x Gossos </option>
                        <option value="digits" > Xifres (0-9) </option>
                        <!--<option value="custom" > Conjunt de dades personalitzat </option>-->
                    </select>
                </div>
                
                <p id='notice' >   </p>
            </div>

            <!--
            Panell per mostrar les dades carregades
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
                            En aquesta secció, pots triar qualsevol imatge i verificar la classificació segons el model que vas triar prèviament. Tingues en compte que els models només saben reconèixer objectes similars als que se'ls van presentar durant l'entrenament. Serà difícil per al model de gats x gossos manejar imatges fora d'aquest context (una imatge d'un número), tan difícil com presentar una imatge d'un gos per predir amb el model que classifica xifres escrites a mà. El model entrenat per al problema de gats x gossos es va obtenir de <a href='https://github.com/dkreider/tensorflowjs-cat-vs-dog' target='_blank' > aquí </a> mentre que el model per al reconeixement de xifres es va obtenir de <a href='https://gogulilango.com/software/digit-recognizer-tf-js' target='_blank' > aquí </a>.

                            </p>

                            <div class="row" >
                                <div class="col-md-12"  >
                                    <button type="button" class="btn btn-primary " style="margin-top: 32px;" onClick="init_case_clasificacion()" > Inicialitzar i Carregar el Model </button>
                                </div>
                            </div>    
                            
                            <div class="row g-2 align-items-start mt-3">
                                <div class="col-auto" id='fromImage' >
                                    <label class="form-label" >Tria un fitxer d'imatge:</label>
                                    <input class="form-control" type="file" onchange="onLoadPreview(event)" accept="image/*" id="field_cls_predict" />

                                    <div id="container_predict" style=" margin-top: 10; display: none; " >
                                        <img id='img_predict' src="" width="224" height="224" alt="preview" />
                                    </div>

                                </div>
                                
                                
                                <div class="col-auto"  id='fromCanvas' style='display: none;' >
                                    <label class="form-label" > Intenta dibuixar un número (Xifres del 0 al 9 a l'àrea negra utilitzant el ratolí):</label>

                                    <div id="canvas_box_wrapper" class="canvas-box-wrapper">
                                    <div id="canvas_box" class="canvas-box"></div>
                                        <button id="clear_canvas" class="btn btn-secondary mt-2" onclick="clearCanvas(this.id)">Borrar</button>
                                        
                                    <img src="" id='canvas_image' style='display: none; background-color: blue; margin-top:10px;'/>
                                    </div>

                                </div>
                                

                                <div class="col-auto">
                                    <button type="button" id='action' class="btn btn-primary disab" style="margin-top: 32px;" onClick="predictFromPretrained()" > Predir </button>
                                    <div id="area_result" style="display: none;" >
                                        <h4 class="mt-4"> Resultat: </h4>

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
                            Construint un model
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionClasificar">
                        <div class="accordion-body">
                            <p>
                                Normalment, els models poden aprendre millor quan fem servir un nombre equilibrat d'exemples de cada classe que volem poder predir.
                                Tanmateix, pots entrenar un model utilitzant proporcions diferents. En algunes aplicacions, pot haver-hi pocs exemples d'una classe i molts de les altres classes.<br />
                                
                                En aquest exemple d'exercici, es va preparar un subconjunt dels dos conjunts de dades disponibles a l'app (gats x gossos, i els números) amb 200 exemples de cada classe de dades, per il·lustrar alguns conceptes útils sobre l'organització de dades i l'avaluació del model. L'arquitectura del model és fixa per a una xarxa neuronal amb dues capes ocultes de convolució 2D. Els passos de processament de dades i el procediment per igualar els exemples entre classes es poden trobar en l'script features_transform.py en aquest repositori.
                                
                                <!--Per superar aquest problema, hi ha tècniques que generen dades sintètiques de la classe subrepresentada per augmentar el nombre d'exemples i ajudar a construir un millor model.-->
                            </p>


                            <!--
                            <h5>Tria el conjunt de dades: </h5>
                            <div class="row g-2 align-items-center">
                                <div class="col-auto">
                                    <label class="form-label" > Conjunt de dades:</label>
                                    <select id="dataset_tr" class="form-control " onChange="treat"  >
                                        <option value="catDogs" > Gats x Gossos </option>
                                        <option value="digits" > Xifres (0-9) </option>
                                        <option value="custom" > Conjunt de dades personalitzat </option>
                                    </select>
                                </div>
                            </div>
                            -->

                            <h5 class="mt-3" >Tria la proporció de cada classe per alimentar el model: </h5>
                            <div class="row g-2 align-items-center" id="proporcion_clases" >
                                <div class="col-auto">
                                    <label class="form-label" > Proporció classe 1 (gossos):</label>
                                    <select id="perc_cls1" class="form-control " onChange="treatProportion()"  >
                                        <option value="20" > 20% </option>
                                        <option value="40" > 40% </option>
                                        <option value="50" > 50% </option>
                                        <option value="60" > 60% </option>
                                        <option value="80" > 80% </option>
                                        <option value="100" selected > 100% (Tots els exemples disponibles) </option>
                                    </select>
                                </div>
                                <div class="col-auto">
                                    <label class="form-label" > Proporció classe 2 (gats):</label>
                                    <select id="perc_cls2" class="form-control " disabled >
                                        <option value="20" > 20% </option>
                                        <option value="40" > 40% </option>
                                        <option value="50" selected > 50% </option>
                                        <option value="60" > 60% </option>
                                        <option value="80" > 80% </option>
                                        <option value="100" selected > 100% (Tots els exemples disponibles) </option>
                                    </select>
                                </div>
                            </div>


                            <h5 class="mt-3" >Tria la porció d'exemples a utilitzar en el pas d'entrenament: </h5>
                            <div class="row g-2 align-items-center">
                                <div class="col-auto">
                                    <label class="form-label" > Porció de dades de mostra a utilitzar:</label>
                                    <select id="perc_n" class="form-control "  >
                                        <option value="40" > 40% </option>
                                        <option value="50" > 50% </option>
                                        <option value="60" > 60% </option>
                                        <option value="80" > 80% </option>
                                        <option value="100" selected > 100% (Tots els exemples disponibles) </option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-primary disab" onClick="buildCustomModelEvaluate()" > Construir model </button>
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
customElements.define('classification-component', Clasificacion);

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
    document.querySelectorAll('.disab').forEach( e => e.disabled=true );
    area_result.style.display='none';
    action.innerHTML = 'Predint ...';
    
    tf.engine().startScope();
    
    setTimeout( function() {
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
        document.querySelectorAll('.disab').forEach( e => e.disabled=false );
        action.innerHTML = 'Predit';
    }, 2000);
}
else{
    alert('No hi ha cap imatge seleccionada');
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
            <label class="form-label" > Proporció classe ${ i } ( ${ c } ):</label>
            <select id="perc_cls${ i }" class="form-control "   >
                <option value="20" > 20% </option>
                <option value="40" > 40% </option>
                <option value="50" > 50% </option>
                <option value="60" > 60% </option>
                <option value="80" > 80% </option>
                <option value="100" selected > 100% (Tots els exemples disponibles) </option>
            </select>
        </div>
        `;
        i += 1;
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
    notice.innerHTML = 'Espera... Carregant el model...';
    
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
        notice.innerHTML = 'Model carregat';
    })
    .catch((err) => {
    console.log( err );
    })

}
//init_case_clasificacion()
