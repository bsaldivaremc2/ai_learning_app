class BuildDataset extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
       <section id="intro_buildds" class="mt-3">
            <p>
               Classification is the task of predicting pre-defined labels for pieces of data, using a model trained with previous labeled data for each class of the domain application. In this tab, you may build your own sample datasets in two groups and test how the model behave according to your selection of images. According to your selection you will train a model (teaching the machine how to separate the grouped images) and try to predict the group for a new image.
            </p>
            
        </section>

        <section id="usage_classification" class="mt-3" style="margin-bottom: 20px;" >

            <div class="accordion" id="accordionBuildDs">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Mount the groups of images and train a model
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionBuildDs">
                        <div class="accordion-body">                
                            <!-- Show and build dataset -->
                            <div class="row" >
                                <div class="col-md-12" >
                                    <h3> Available images: </h3>
                                    
                                    <div class="row g-4 align-items-start" id="available_examples" > </div>
                                </div>
                                
                                <div class="col-md-12 mt-3" >
                                    <h3> Drag images from the animal types shown above and move them into the two below group areas. Then, name these groups as you want.</h3>
                                    
                                    <div class="row g-4 align-items-start" id="datasets_area" >
                                    
                                        <div class="col-md-6"  >
                                            <h5> Group 1: </h5>
                                            <div class="col-md-12 mt-1 text-center">
                                                <input type="text" class="form-control" id="class_1" placeholder="Name group 1" />
                                            </div>
                                            
                                            <div class="area_group col-md-12 mt-1 g-2" id="elements_class_1" ondrop="drop(event)" ondragover="allowDrop(event)"  >
                                            
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-6 "  >
                                            <h5> Group 2: </h5>
                                            <div class="col-md-12 mt-1 text-center">
                                                <input type="text" class="form-control" id="class_2" placeholder="Name group 2" />
                                            </div>
                                            
                                            <div class="area_group col-md-12 mt-1 g-2" id="elements_class_2" ondrop="drop(event)" ondragover="allowDrop(event)"  >
                                            
                                            </div>
                                        </div>
                                    
                                    </div>
                                </div>
                                
                                <div class="col-md-12 mt-3 g-2" >
                                    <div class="col-md-3">
                                        <label class="form-label" > Choose a Model: </label>
                                        <select id="model_ds" class="form-control " >
                                            <option value="small" > Low Complexity </option>
                                            <option value="medium" > Medium Performance </option>
                                            <option value="large" selected > Refined </option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-3">
                                         <button type="button" class="btn btn-primary" style="margin-top: 32px;" onClick="trainBuilDs()" > Train </button>
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            Use your model to classify new images
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionClassify">
                        <div class="accordion-body">

                            <div class="row g-2 align-items-start"  >
                                <div class="col-auto" id='fromImageDs' >
                                    <label class="form-label" >Choose an image file:</label>
                                    <input class="form-control" type="file" onchange="onLoadPreview(event)" accept="image/*" id="field_cls_predict_bds" />

                                    <div id="container_predict_bds" style=" margin-top: 10; display: none; " >
                                        <img id='img_predict_bds' src="" width="200" height="200" alt="preview" />
                                    </div>

                                </div>
                                

                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary" style="margin-top: 32px;" onClick="predictFromPretrained()" > Predict </button>
                                    
                                    <div id="area_result_ds" >
                                        <h4 class="mt-4"> Result: </h4>

                                        <div id="result_cls_ds" style="font-size: 50; padding: 15px: border: 2px solid blue;" > </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

            </div>

        </section>

        <style >
            .area_group{
                border-radius: 15px;
                padding: 10px;
                border: 1px;
                min-width: 300px;
                min-height: 300px;
                border: 1px solid #ccc;
            }
          
            ._img {
                display: inline-block;
                position: relative;
                cursor: -webkit-grab; cursor: grab;
            } 

            ._img > i {
                display: none;
                color: #f00;
             }
             
            #datasets_area {
                ._img {
                    cursor: pointer;
                    font-color: #f00;
                }
                ._img:hover > i {
                    display: block !important;
                    top: 50%;
                    left: 50%;
                    position: absolute;
                    transform: translate(-50%, -50%);
                }
            }
        </style>
    `;
  }
}
customElements.define('buildds-component', BuildDataset);

/* Building datasets area */
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("identifier", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("identifier");
  ev.target.appendChild( document.getElementById( "container_"+data ) );
}

const _capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const _shuffle = ( array ) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

function loadExamplesClasses(){
    let available_classes = { "bird": 18, "lion": 18, "cat": 18, "dog": 18 };
    
    let htmls = "";
    for( let c of Object.keys(available_classes) ){
        let path = `examples/expSelfBuildData/${c}`;
        let prefix = c[0];
        let setList = [];
        for ( let i=1; i <= available_classes[c]; i++ ){
            setList.push( prefix+i )
        }
        let chosen = _shuffle(setList).slice(0, 10);
        let innerImgs = "";
        for( let nimg of chosen ){
            innerImgs += `
                <div id='container_img_group_${ nimg }' class="_img" style=" padding: 5px;" draggable="true" ondragstart="drag(event)" onclick="remove(this)" >
                    <i class="fa-solid fa-circle-xmark fa-2x" ></i>
                    
                    <img id='img_group_${ nimg }' src="${ path }/${ nimg }.png" width="100" height="100"  />
                </div>
            `;
        }
        
        // <div class="col-auto" id="cls_${c}" >
        htmls += `
            <div class="col-md-6" id="cls_${c}" >
                <h5> ${ _capitalize(c) } </h5>
                <div class="col-md-12" id="content_${c}" >
                    ${innerImgs}
                </div>
                
            </div>
        `;
    }
    
    document.getElementById('available_examples').innerHTML = htmls;
}

function remove( obj ){
    let parent = obj.parentNode.id;
    if( parent.indexOf('elements_class') == 0 ){
        let map = { 'b': 'bird', 'c': 'cat', 'd': 'dog', 'l': 'lion' };
        let prefix = parent.split('_').slice(-1)[0][0];
        eval( `contents_${ map[prefix] }` ).appendChild( obj );
        obj.parentNode.removeChild( obj );
    }
}

/* Transformation and training functions */
function getTrainData( classes_info ){
    let dat = { 'x': [], 'y': [], 'class': [] };
    
    let index = 0;
    for( let clf of classes_info  ){
        for( let el of clf.elements ){
            dat.y.push( index );
            dat.class.push( clf.name );
            
            let img = new Image();
            img.src = el.src;
            img.onload = () => {
              dat.x.push( tf.browser.fromPixels( img ) );
            }
        }
        index += 1;
    }
}

async function trainBuildDs(){
    let name_cl1 = class_1.value ?? "group 1";
    let name_cl2 = class_2.value ?? "group 2";
    class_1.value = name_cl1;
    class_2.value = name_cl2;
    
    if( name_cl1 == name_cl2 ){
        alert('Choose distinct names for the groups!');
        return;
    }
    
    let elements_cl1 = document.querySelectorAll("#elements_class_1 img");
    let elements_cl2 = document.querySelectorAll("#elements_class_2 img");
    if( elements_cl1.length < 4 || elements_cl2.length < 4  ){
        alert('The two groups must contain at least 2 animal images!');
        return;
    }
    
    let classes_info = [ 
        { 'name': name_cl1, 'elements': elements_cl1 }, 
        { 'name': name_cl2, 'elements': elements_cl2 }
    ];
    
    tf.engine().startScope();
    
    obj_ds.classes = [name_cl1, name_cl2];
    obj_ds.train_data = getTrainData( classes_info );
    
    let model = null;
    let idModel = model_ds.value;
    if( inModel == 'large' ){
        modProcess.getModelImage( obj_ds );
    }
    
    tfvis.visor().open();
    obj_ds.model = await modProcess.train( obj_ds, model );
    await modViz.showAccuracy(obj_ds, obj_ds.model, );
    await modViz.showConfusion();
    
    tf.engine().endScope();
}

/* Prediction */
let previewUrlDs = "";
function onLoadPreview(e) {
    const image = e.target.files[0];
    if (!image) {
        document.getElementById("container_predict_bds").style.display='none';
        return
    }
    if (previewUrlDs) URL.revokeObjectURL(previewUrlDs);
    previewUrlDs = URL.createObjectURL(image);
    document.getElementById("img_predict_bds").src = previewUrlDs;
    document.getElementById("container_predict_bds").style.display='';
}

function predictFromCustomModel(){
    let input = document.getElementById('field_cls_predict_bds');
    if( input.files.length > 0 ){
        if( obj_ds.model != null ){
            tf.engine().startScope();
        
            let inn = modProcess.getVectorFromImgTag( img_predict_bds );
            let outcome = modProcess.predictBinary( inn, obj_ds, obj_ds.model, obj_cls.dimension );
            
            tf.engine().endScope();
            
            tfvis.visor().close();
            document.getElementById('result_cls_ds').innerHTML = `<span> ${outcome} </span>`;
            area_result_ds.style.display='';
        }
        else{
            alert('You must train the model before applying it');
        }
    }
    else{
        alert('There is no image in selection');
    }
}



let obj_ds = {};
let init_case_buildds = () => {
    // Loading available images in containers
    loadExamplesClasses();
    
    area_result_ds.style.display='none';
    
    let proportions = { 'cls1': 100, 'cls2': 100 };
    obj_ds = new AIExp( 'custom', 100, proportions, 80, 20 );
    obj_ds.dimension = [60, 60, 3];
    obj_ds.maxDim = 60;
    
    /*
    area_result_ds.style.display='none';
    document.querySelectorAll('button').forEach( e => e.disabled=true );
    notice.innerHTML = 'Wait... Model is loading...';
    
    let modelId = document.getElementById('dataset').value;
    let totalData = parseInt(perc_n.value);
    
    obj_cls = new AIExp( modelId, totalData );
    
    if( dataset.value == 'catDogs' ){
        fromImageDs.style.display = '';
        fromCanvas.style.display = 'none';
    }
    else{
        fromImageDs.style.display = 'none';
        fromCanvas.style.display = '';
    }
    
    obj_cls.loadModel()
    .then( ( models ) => {
        let dimImage = obj_cls.maxDim;
        
        prepareFieldsProportionClasses();
        let proportions = getProportionClasses();
        obj_cls.proportionsPerClass = proportions;
        console.log(obj_cls)
            
        document.querySelectorAll('button').forEach( e => e.disabled=false );
        notice.innerHTML = 'Model loaded';
    })
    .catch((err) => {
      console.log( err?.response );
    })
    */

}
init_case_buildds()

