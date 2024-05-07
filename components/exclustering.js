class Clustering extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
       <section id="intro_clustering" class="mt-3">
            <p>
               Classification is the task of group pieces of data into k predefined clusters without need of training models previously. According to a certain number of steps the data points are reorganized measuring the distances in relation to the closest centroid point. This centroid represents the representative guide of each cluster, with which the distances from other points in the same cluster are minimized and distances to other clusters centroids are maximized.
            </p>

            <p>
               In this part of the app you can explore how a clustering method behaves to group items from datasets that are originally designed for classification tasks, in the same two context of datasets as the classification tab of this app: (i) Model to classify if image has a dog or a cat; (ii) Model to classify if handwritten digit is in the range 0 to 9. The original data for the problem (i) was derived from <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > here </a>, and the data for the digits was downloaded <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > here </a>.
            </p>

            <h5>Choose the dataset: </h5>
            <div class="row g-2 align-items-center">
              <div class="col-auto">
                  <label class="form-label" > Dataset:</label>
                  <select id="dataset_clu" class="form-control " onChange="init_case_clustering()"  >
                      <option value="catDogs" > Cats x Dogs </option>
                      <option value="digits" > Numbes (0-9) </option>
                      <!--<option value="custom" > Custom Dataset </option>-->
                  </select>
              </div>
              
              <p id='notice_clu' >   </p>
            
            <p> In this task we will apply a method named <a href='https://www.mdpi.com/2079-9292/9/8/1295' target='_blank' > K-Means </a> that takes a vector (a list of numbers) representing each image of the chosen dataset. However, while in the classification task we could use the three dimensional array (width * height * 3 (rgb color code)), in this case we will transform these dimensions into one single large vector and then apply the <a href='https://link.springer.com/chapter/10.1007/978-3-030-51935-3_34' target='_blank' > UMAP </a> method to reduce its dimensions and reduce time to converge the data points assignment. This technique generates a representative reduced vector (named as embedding) for each image and we may choose the length of the new vector.</p>
            
            <h5 class="mt-3" >Choose the length of the embedding: </h5>
            <div class="row g-2 align-items-center">
              <div class="col-auto">
                  <label class="form-label" > Size of the embedding:</label>
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
                    <button type="button" class="btn btn-primary disab_clu" onClick="executeClustering()" > Do clustering </button>
                </div>
                
                <div class="col-md-12 mt-2" id="area_result_clu" >
                    <h4 class="mt-4"> Result: </h4>
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

    const layout = { title: `Proportions of true classes in ${clusterId}` };

    Plotly.newPlot("result_clu_plot2", data, layout);

    let plot2_container = document.getElementById('result_clu_plot2');
}

let _makeMainPiePlot = (preds, real, classes) => {
    result_clu_plot2.innerHTML = '';
    
    let rs = {};
    let i = 0;
    for( let p of preds ){
        let nc = `Group ${p}`;
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

    const layout = { title: "Distribution of data in the groups" };

    Plotly.newPlot("result_clu_plot1", data, layout);

    let plot1_container = document.getElementById('result_clu_plot1');
    plot1_container.on('plotly_click', function(data){
        let clusterId = data.points[0].label;
        let info = rs[ clusterId ];
        _makeComplementaryPiePlot( clusterId, info );
    });
}

async function executeClustering(){
    notice_clu.innerHTML = 'Doing clustering ...';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=true );
    
    let iclas = obj_clu.classes.join(', ');
    let nclasses = obj_clu.classes.length;
    info_clu.innerHTML = `
        Dataset ${ dataset_clu.value } contains ${ nclasses }. <br />
        Calculating clustering for ${ nclasses } target groups.
    `;
    
    let embs = modProcess.embedReduceFeaturesUmap( obj_clu );
    let [preds, real, labels] = await modProcess.doClustering( obj_clu, embs );
    _makeMainPiePlot(preds, real, labels);
    info_clu.innerHTML += `<br /><b>Click in one of the group portions to see the number of examples of each true class it contains</b>`;
    
    area_result_clu.style.display='';
    notice_clu.innerHTML = '';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=false );
}

let obj_clu = null;
let init_case_clustering = () => {
    area_result_clu.style.display='none';
    document.querySelectorAll('.disab_clu').forEach( e => e.disabled=true );
    notice_clu.innerHTML = 'Wait... Model is loading...';
    
    let modelId = document.getElementById('dataset_clu').value;
    obj_clu = new AIExp( modelId, 100 );
    
    obj_clu.loadModel()
    .then( async ( models ) => {
        obj_clu.embedding_size = parseInt( emb_size.value );
        
        console.log(obj_clu);
        await executeClustering();
            
        document.querySelectorAll('.disab_clu').forEach( e => e.disabled=false );
        notice_clu.innerHTML = 'Model loaded.';
    })
    .catch((err) => {
      console.log( err );
    })

}
init_case_clustering()

