class Classification extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
       <section id="intro_classification" class="mt-3">
            <p>
               Classification is the task of predicting pre-defined labels for pieces of data, using a model trained with previous labeled data for each class of the domain application. 
            </p>

            <p>
               In this part of the app you can explore and use your own image data to test the models in two context of datasets: (i) Model to classify if image has a dog or a cat; (ii) Model to classify if handwritten digit is in the range 0 to 9. The original data for the problem (i) was derived from <a href='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_5340.zip' target='_blank' > here </a>, and the data for the digits was downloaded <a href='https://drive.google.com/file/d/11ZiNnV3YtpZ7d9afHZg0rtDRrmhha-1E/view' target='_blank' > here </a>.
            </p>

            <h5>Choose the dataset: </h5>
            <div class="row g-2 align-items-center">
              <div class="col-auto">
                  <label class="form-label" > Dataset:</label>
                  <select id="dataset" class="form-control " onChange="init_case_classification()"  >
                      <option value="catDogs" > Cats x Dogs </option>
                      <option value="digits" > Numbers (0-9) </option>
                      <!--<option value="custom" > Custom Dataset </option>-->
                  </select>
              </div>
              
              <p id='notice' >   </p>
            </div>

            <!--
            Panel to show the data loaded
            -->

        </section>

        <section id="usage_classification" class="mt-3" style="margin-bottom: 20px;" >

            <div class="accordion" id="accordionClassify">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Applying pre-trained model
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionClassify">
                        <div class="accordion-body">
                            <p>
                              In this section, you can choose any image and check the classification according to the model you chose previously. Keep in mind that the models only know how to recognize similar objects of those that were presented to it during the training. It will be hard for the model of cats x dogs to deal with images out of this context (a picture of a number), so hard as presenting a picture of a dog to predict for the model that classify handwritten digits. The trained model for the problem cats x dogs was derived from <a href='https://github.com/dkreider/tensorflowjs-cat-vs-dog' target='_blank' > here </a> while th emodel for digits recognition was retrieved from was derived from <a href='https://gogulilango.com/software/digit-recognizer-tf-js' target='_blank' > here </a>
                            </p>
                            
                            <div class="row" >
                                <div class="col-md-12"  >
                                    <button type="button" class="btn btn-primary " style="margin-top: 32px;" onClick="init_case_classification()" > Initialize and Load Model </button>
                                </div>
                            </div>    
                            
                            <div class="row g-2 align-items-start mt-3">
                                
                                <div class="col-auto" id='fromImage' >
                                    <label class="form-label" >Choose an image file:</label>
                                    <input class="form-control" type="file" onchange="onLoadPreview(event)" accept="image/*" id="field_cls_predict" />

                                    <div id="container_predict" style=" margin-top: 10; display: none; " >
                                        <img id='img_predict' src="" width="224" height="224" alt="preview" />
                                    </div>

                                </div>
                                
                                
                                <div class="col-auto"  id='fromCanvas' style='display: none;' >
                                    <label class="form-label" > Try to draw a number (Digits from 0 to 9 in the black area using the mouse):</label>

                                    <div id="canvas_box_wrapper" class="canvas-box-wrapper">
                                      <div id="canvas_box" class="canvas-box"></div>
                                       <button id="clear_canvas" class="btn btn-secondary mt-2" onclick="clearCanvas(this.id)">Clear</button>
                                       
                                      <img src="" id='canvas_image' style='display: none; background-color: blue; margin-top:10px;'/>
                                    </div>

                                </div>
                                

                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary disab" style="margin-top: 32px;" onClick="predictFromPretrained()" > Predict </button>
                                    <div id="area_result" style="display: none;" >
                                        <h4 class="mt-4"> Result: </h4>

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
                            Building a model
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionClassify">
                        <div class="accordion-body">
                            <p>
                              Usually, the models may learn better when we use balanced number of examples of each class we want to be able to  predict.
                              However, you can train a model using distinct proportions. In some applications, there may be few examples of one class and a lot from the other classes.<br />
                              
                              In this exercise example, a subset of the two datasets available in the app (cats x dogs, and the numbers) was prepared with 200 examples of each class of data, to illustrate some useful concepts about data organization and model evaluation. The architecture of the model is fixed for a neural network with two hidden layers of convolution 2D. The data processing steps and procedure to equalize the examples across classes can be found in the features_transform.py script in this repository.
                              
                              <!--To overcome this issue, there are techniques that generate synthetic data from the underrepresented class to increase the number of examples and help to build a better model.-->
                            </p>

                            <!--
                            <h5>Choose the dataset: </h5>
                            <div class="row g-2 align-items-center">
                              <div class="col-auto">
                                  <label class="form-label" > Dataset:</label>
                                  <select id="dataset_tr" class="form-control " onChange="treat"  >
                                      <option value="catDogs" > Cats x Dogs </option>
                                      <option value="digits" > Numbes (0-9) </option>
                                      <option value="custom" > Custom Dataset </option>
                                  </select>
                              </div>
                            </div>
                            -->

                            <h5 class="mt-3" >Choose the proportion of each class to feed in the model: </h5>
                            <div class="row g-2 align-items-center" id="classes_proportion" >
                              <div class="col-auto">
                                  <label class="form-label" > Proportion class 1 (dogs):</label>
                                  <select id="perc_cls1" class="form-control " onChange = "treatProportion()"  >
                                      <option value="20" > 20% </option>
                                      <option value="40" > 40% </option>
                                      <option value="50" > 50% </option>
                                      <option value="60" > 60% </option>
                                      <option value="80" > 80% </option>
                                      <option value="100" selected > 100% (All available examples) </option>
                                  </select>
                              </div>
                              <div class="col-auto">
                                  <label class="form-label" > Proportion class 2 (cats):</label>
                                  <select id="perc_cls2" class="form-control "  disabled >
                                      <option value="20" > 20% </option>
                                      <option value="40" > 40% </option>
                                      <option value="50" selected > 50% </option>
                                      <option value="60" > 60% </option>
                                      <option value="80" > 80% </option>
                                      <option value="100" selected > 100% (All available examples) </option>
                                  </select>
                              </div>
                            </div>

                            <h5 class="mt-3" >Choose the portion of examples to use in the training step: </h5>
                            <div class="row g-2 align-items-center">
                              <div class="col-auto">
                                  <label class="form-label" > Portion of sample data to use:</label>
                                  <select id="perc_n" class="form-control "  >
                                      <option value="40" > 40% </option>
                                      <option value="50" > 50% </option>
                                      <option value="60" > 60% </option>
                                      <option value="80" > 80% </option>
                                      <option value="100" selected > 100% (All examples available) </option>
                                  </select>
                              </div>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-primary disab" onClick="buildCustomModelEvaluate()" > Build model  </button>
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
customElements.define('classification-component', Classification);

function treatProportion(){
  let cdog = parseInt( document.getElementById('perc_dog').value );
  let ccat = 100 - cdog;
  document.getElementById('perc_cat').value = ccat;
}

let previewUrl = "";
function onLoadPreview(e) {
    const image = e.target.files[0];
    if (!image) {
        document.getElementById("container_predict").style.display='none';
        return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(image);
    document.getElementById("img_predict").src = previewUrl;
    document.getElementById("container_predict").style.display='';
}

function predictFromPretrained() {
  let input = document.getElementById('field_cls_predict');
  if( input.files.length > 0 || dataset.value == 'digits' ){
    document.querySelectorAll('.disab').forEach( e => e.disabled=true );
    area_result.style.display='none';
    
    tf.engine().startScope();
    
    let inn = null;
    
    let outcome = '';
    if( obj_cls.classes.length == 2 ){
        inn = modProcess.getVectorFromImgTag( img_predict );
        outcome = modProcess.predictBinary( inn, obj_cls, obj_cls.model, obj_cls.dimension );
    }
    else {
        inn = modProcess.getVectorFromCanvas();
        outcome = modProcess.predictMulti( inn, obj_cls, obj_cls.model, obj_cls.dimension );
    }
    tf.engine().endScope();
    
    if( dataset.value == 'catDogs' ){
        outcome = ( outcome == 'Dog') ? '🐶' : '😸' ;
    }
    
    document.getElementById('result_cls').innerHTML = `<span> ${outcome} </span>`;
    area_result.style.display='';
    document.querySelectorAll('.disab').forEach( e => e.disabled=false );
  }
  else{
    alert('There is no image in selection');
  }
}

async function buildCustomModelEvaluate(){
    tf.engine().startScope();
    
    let model = modProcess.getModelImage( obj_cls );
    let fitted_model = await modProcess.train( obj_cls, model );
    await modViz.showAccuracy( obj_cls, fitted_model );
    await modViz.showConfusion( obj_cls, fitted_model );
    
    tf.engine().endScope();
}

function prepareFieldsProportionClasses(){
    let htmls = "";
    let i = 1
    for ( let c of obj_cls.classes ){
        htmls += `
        <div class="col-auto">
              <label class="form-label" > Proportion class ${ i } ( ${ c } ):</label>
              <select id="perc_cls${ i }" class="form-control "   >
                  <option value="20" > 20% </option>
                  <option value="40" > 40% </option>
                  <option value="50" > 50% </option>
                  <option value="60" > 60% </option>
                  <option value="80" > 80% </option>
                  <option value="100" selected > 100% (All available examples) </option>
              </select>
          </div>
        `;
        i+=1
    }
    
    classes_proportion.innerHTML = htmls;
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
let init_case_classification = () => {
    area_result.style.display='none';
    document.querySelectorAll('.disab').forEach( e => e.disabled=true );
    notice.innerHTML = 'Wait... Model is loading...';
    
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
    .then( ( models ) => {
        let dimImage = obj_cls.maxDim;
        
        prepareFieldsProportionClasses();
        let proportions = getProportionClasses();
        obj_cls.proportionsPerClass = proportions;
        console.log(obj_cls)
            
        document.querySelectorAll('.disab').forEach( e => e.disabled=false );
        notice.innerHTML = 'Model loaded';
    })
    .catch((err) => {
      console.log( err );
    })

}
//init_case_classification()

