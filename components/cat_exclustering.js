class Clustering extends HTMLElement {
constructor() {
    super();
}

connectedCallback() {
    this.innerHTML = `
        <section id="intro_clustering" class="mt-3">
            <p>
                La classificació és la tasca d'agrupament de peces de dades en k clústers predefinits sense necessitat d'entrenar models prèviament. Segons un cert nombre de passos, els punts de dades es reorganitzen mesurant les distàncies en relació amb el punt de centreide més proper. Aquest centreide representa la guia representativa de cada clúster, amb la qual les distàncies des d'altres punts en el mateix clúster es minimitzen i les distàncies a altres centreides de clústers es maximitzen.
            </p>

            <p>
                En aquesta part de l'aplicació pots explorar com es comporta un mètode de clustering per agrupar elements de conjunts de dades que estan dissenyats originalment per a tasques de classificació, en els mateixos dos contextos de conjunts de dades que la pestanya de classificació d'aquesta aplicació: (i) Model per classificar si la imatge té un gos o un gat; (ii) Model per classificar si una xifra escrita a mà està en el rang de 0 a 9. Les dades originals per al problema (i) es van obtenir de <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > aquí </a>, i les dades per a les xifres es van descarregar <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > aquí </a>.
            </p>

            <div class="row" >
                <div class="col-md-12"  >
                    <button type="button" class="btn btn-primary " style="margin-top: 32px;" onClick="init_case_clustering()" > Inicialitzar i Carregar el Model </button>
                </div>
            </div>

            
            <h5  class='mt-3' >Tria el conjunt de dades: </h5>
            <div class="row g-2 align-items-center">
                <div class="col-auto">
                    <label class="form-label" > Conjunt de dades:</label>
                    <select id="dataset_clu" class="form-control " onChange="init_case_clustering()"  >
                        <option value="catDogs" > Gats x Gossos </option>
                        <option value="digits" > Xifres (0-9) </option>
                        <!--<option value="custom" > Conjunt de dades personalitzat </option>-->
                    </select>
                </div>
            </div>

            
            <p id='notice_clu' >   </p>
            
            <p> En aquesta tasca aplicarem un mètode anomenat <a href='https://www.mdpi.com/2079-9292/9/8/1295' target='_blank' > K-Means </a> que pren un vector (una llista de números) que representa cada imatge del conjunt de dades triat. Tanmateix, mentre que en la tasca de classificació podíem utilitzar la matriu tridimensional (ample * alt * 3 (codi de color rgb)), en aquest cas transformarem aquestes dimensions en un sol vector gran i després aplicarem el mètode <a href='https://link.springer.com/chapter/10.1007/978-3-030-51935-3_34' target='_blank' > UMAP </a> per reduir les seves dimensions i reduir el temps per convergir l'assignació de punts de dades. Aquesta tècnica genera un vector reduït representatiu (anomenat embedding) per a cada imatge i podem triar la longitud del nou vector.</p>

            <h5 class="mt-3" >Tria la longitud de l'embedding: </h5>
            <div class="row g-2 align-items-center">
                <div class="col-auto">
                    <label class="form-label" > Mida de l'embedding:</label>
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
                    <button type="button" class="btn btn-primary disab_clu" onClick="executeClustering()" > Realitzar clustering </button>
                </div>
                
                <div class="col-md-12 mt-2" id="area_result_clu" >
                    <h4 class="mt-4"> Resultat: </h4>
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

    const layout = { title: `Proporcions de classes verdaderes a ${clusterId}` };

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

    const layout = { title: "Distribució de dades en els grups" };

    Plotly.newPlot("result_clu_plot1", data, layout);

    let plot1_container = document.getElementById('result_clu_plot1');
    plot1_container.on('plotly_click', function(data){
        let clusterId = data.points[0].label;
        let info = rs[ clusterId ];
        _makeComplementaryPiePlot( clusterId, info );
    });
}

async function executeClustering(){
    notice_clu.innerHTML = 'Realitzant clustering ...';
    document.querySelectorAll('.disab_clu').forEach(e => e.disabled = true);
    
    let iclas = obj_clu.classes.join(', ');
    let nclasses = obj_clu.classes.length;
    info_clu.innerHTML = `
        El conjunt de dades ${ dataset_clu.value } conté ${ nclasses } classes. <br />
        Calculant clustering per a ${ nclasses } grups objectiu.
    `;
    
    let embs = modProcess.embedReduceFeaturesUmap(obj_clu);
    let [preds, real, labels] = await modProcess.doClustering(obj_clu, embs);
    _makeMainPiePlot(preds, real, labels);
    info_clu.innerHTML += `<br /><b>Fes clic en una de les porcions del grup per veure el nombre d'exemples de cada classe veritable que conté</b>`;
    
    area_result_clu.style.display = '';
    notice_clu.innerHTML = '';
    document.querySelectorAll('.disab_clu').forEach(e => e.disabled = false);
}


let obj_clu = null;
let init_case_clustering = () => {
    area_result_clu.style.display = 'none';
    document.querySelectorAll('.disab_clu').forEach(e => e.disabled = true);
    notice_clu.innerHTML = 'Espera... Carregant el model...';
    
    let modelId = document.getElementById('dataset_clu').value;
    obj_clu = new AIExp(modelId, 100);
    
    obj_clu.loadModel()
    .then(async (models) => {
        obj_clu.embedding_size = parseInt(emb_size.value);
        
        console.log(obj_clu);
        await executeClustering();
        
        document.querySelectorAll('.disab_clu').forEach(e => e.disabled = false);
        notice_clu.innerHTML = 'Model carregat.';
    })
    .catch((err) => {
        console.log(err);
    });
}

//init_case_clustering()
