class Clustering extends HTMLElement {
constructor() {
    super();
}

connectedCallback() {
    this.innerHTML = `
        <section id="intro_clustering" class="mt-3">
            <p>
                La clasificación es la tarea de agrupar piezas de datos en k clusters predefinidos sin necesidad de entrenar modelos previamente. Según un cierto número de pasos, los puntos de datos se reorganizan midiendo las distancias en relación con el punto de centroide más cercano. Este centroide representa la guía representativa de cada cluster, con la cual las distancias desde otros puntos en el mismo cluster se minimizan y las distancias a otros centroides de clusters se maximizan.
            </p>

            <p>
                En esta parte de la app puedes explorar cómo se comporta un método de clustering para agrupar elementos de conjuntos de datos que están diseñados originalmente para tareas de clasificación, en los mismos dos contextos de conjuntos de datos que la pestaña de clasificación de esta app: (i) Modelo para clasificar si la imagen tiene un perro o un gato; (ii) Modelo para clasificar si un dígito escrito a mano está en el rango de 0 a 9. Los datos originales para el problema (i) se obtuvieron de <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > aquí </a>, y los datos para los dígitos se descargaron <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > aquí </a>.
            </p>

            <h5>Elige el conjunto de datos: </h5>
            <div class="row g-2 align-items-center">
            <div class="col-auto">
                <label class="form-label" > Conjunto de datos:</label>
                <select id="dataset_clu" class="form-control " onChange="init_case_clustering()"  >
                    <option value="catDogs" > Gatos x Perros </option>
                    <option value="digits" > Números (0-9) </option>
                    <!--<option value="custom" > Conjunto de datos personalizado </option>-->
                </select>
            </div>
            
            <p id='notice_clu' >   </p>
            
            <p> En esta tarea aplicaremos un método llamado <a href='https://www.mdpi.com/2079-9292/9/8/1295' target='_blank' > K-Means </a> que toma un vector (una lista de números) que representa cada imagen del conjunto de datos elegido. Sin embargo, mientras que en la tarea de clasificación podíamos usar la matriz tridimensional (ancho * alto * 3 (código de color rgb)), en este caso transformaremos estas dimensiones en un solo vector grande y luego aplicaremos el método <a href='https://link.springer.com/chapter/10.1007/978-3-030-51935-3_34' target='_blank' > UMAP </a> para reducir sus dimensiones y reducir el tiempo para converger la asignación de puntos de datos. Esta técnica genera un vector reducido representativo (llamado embedding) para cada imagen y podemos elegir la longitud del nuevo vector.</p>
            
            <h5 class="mt-3" >Elige la longitud del embedding: </h5>
            <div class="row g-2 align-items-center">
            <div class="col-auto">
                <label class="form-label" > Tamaño del embedding:</label>
                <select id="emb_size" class="form-control "  >
                    <option value="128" selected > 128 </option>
                    <option value="256" > 256 </option>
                    <option value="512" > 512 </option>
                    <option value="1024" > 1024 </option>
                </select>
            </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary disab_clu" onClick="executeClustering()" > Realizar clustering </button>
                </div>
                
                <div class="col-md-12 mt-2" id="area_result_clu" >
                    <h4 class="mt-4"> Resultado: </h4>
                    <p id='info_clu' >  </p>
                    
                    <div class="row g-4 align-items-start mt-2">
                        <div class="col-md-6">
                            <div id="result_clu_plot1" style="padding: 15px: border: 2px solid blue;" > </div>
                        </div>
                        <div class="col-md-6">
                            <div id="result_clu_plot2" style="padding: 15px: border: 2px solid blue;" > </div>
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
customElements.define('clustering-component', Clustering);

let _makeComplementaryPiePlot = (clusterId, info) => {
    let rs = {};
    let i = 0;
    for( let p of info ){
        let nc = `${p}`;
        if( ! Object.keys(rs).includes(nc) ){
            rs[ nc ] = 0;
        }
        rs[ nc ] += 1;
        i+=1;
    }
    
    const xArray = Object.keys(rs);
    const yArray = Object.values(rs);

    const data = [{
    labels: xArray,
    values: yArray,
    type: "pie",
    }];

    const layout = { title: `Proporciones de clases verdaderas en ${clusterId}` };

    Plotly.newPlot("result_clu_plot2", data, layout);

    let plot2_container = document.getElementById('result_clu_plot2');
}

let _makeMainPiePlot = (preds, real, classes) => {
    result_clu_plot2.innerHTML = '';
    
    let rs = {};
    let i = 0;
    for( let p of preds ){
        let nc = `Grupo ${p}`;
        if( ! Object.keys(rs).includes(nc) ){
            rs[ nc ] = [];
        }
        rs[ nc ].push( classes[i] );
        i+=1;
    }
    const xArray = Object.keys(rs);
    const yArray = Object.values(rs).map( e => e.length );
    
    const data = [{
    labels: xArray,
    values: yArray,
    type: "pie",
    }];

    const layout = { title: "Distribución de datos en los grupos" };

    Plotly.newPlot("result_clu_plot1", data, layout);

    let plot1_container = document.getElementById('result_clu_plot1');
    plot1_container.on('plotly_click', function(data){
        let clusterId = data.points[0].label;
        let info = rs[ clusterId ];
        _makeComplementaryPiePlot( clusterId, info );
    });
}

async function executeClustering(){
    notice_clu.innerHTML = 'Realizando clustering ...';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=true );
    
    let iclas = obj_clu.classes.join(', ');
    let nclasses = obj_clu.classes.length;
    info_clu.innerHTML = `
        El conjunto de datos ${ dataset_clu.value } contiene ${ nclasses } clases. <br />
        Calculando clustering para ${ nclasses } grupos objetivo.
    `;
    
    let embs = modProcess.embedReduceFeaturesUmap( obj_clu );
    let [preds, real, labels] = await modProcess.doClustering( obj_clu, embs );
    _makeMainPiePlot(preds, real, labels);
    info_clu.innerHTML += `<br /><b>Haz clic en una de las porciones del grupo para ver el número de ejemplos de cada clase verdadera que contiene</b>`;
    
    area_result_clu.style.display='';
    notice_clu.innerHTML = '';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=false );
}

let obj_clu = null;
let init_case_clustering = () => {
    area_result_clu.style.display='none';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=true );
    notice_clu.innerHTML = 'Espera... Cargando el modelo...';
    
    let modelId = document.getElementById('dataset_clu').value;
    obj_clu = new AIExp( modelId, 100 );
    
    obj_clu.loadModel()
    .then( async ( models ) => {
        obj_clu.embedding_size = parseInt( emb_size.value );
        
        console.log(obj_clu);
        await executeClustering();
            
        document.querySelectorAll('.disab_clu').forEach( e => e.disabled=false );
        notice_clu.innerHTML = 'Modelo cargado.';
    })
    .catch((err) => {
    console.log( err );
    })

}
init_case_clustering()
