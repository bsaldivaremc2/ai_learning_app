
/* Loading data */

class AIExp {
  constructor(idModel, totalData=100, proportionsPerClass=null, train_size_perc=70, test_size_perc=30 ){
    this.idModel = idModel;
    this.dimension = [];
    this.maxDim = 0;
    this.model = null;
    this.fitted_model = null;
    this.pretrained = null;
    this.batch_size = 64;
    this.train_size_perc = train_size_perc;
    this.test_size_perc = test_size_perc;
    this.totalData = totalData;
    this.proportionsPerClass = proportionsPerClass;
    this.embedding_size = 256;
  }

  async loadModel() {
    let obj = this;
    let id = this.idModel;
    let inModel = {};
    if( Object.keys( modLoad.pretrained ).includes( id ) ){
        inModel =  modLoad.pretrained[id] ;
        
        if( Object.keys(inModel).includes('dimensionVec') ){
            this.dimension = inModel.dimensionVec;
            this.maxDim = Math.max.apply( null, obj.dimension );
            this.classes = inModel.classNames;
            this.modelType = inModel.modelType;
        }
    }
    else{
        inModel = { url: this.idModel, layer: null };
    }
    
    let modelData = null;
    if( inModel.url != 'custom' ){
        modelData = await modLoad.loadModel( inModel );
        this.model = modelData[0];
        this.pretrained = modelData[1];
        this.train_data = modelData[2];
    }
    
    /*
    if( inModel.useMobileNet ){
        console.log('here')
        //this.pretrained = await modLoad.loaModel( modLoad.pretrained['mobileNet'] );
        //console.log(this)
        //models[1] = this.pretrained;
    }
    */
    
    return modelData;
  }


}

/* modLoad - Handle data transformation and loading */
const pretrainedModel = {
  url: "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json",
  layer: "conv_pw_13_relu",
};

const catDogs = {
  //url: "models/catxdogs/ml-classifier-dogs-cats.json",
  url: "https://raw.githubusercontent.com/dkreider/tensorflowjs-cat-vs-dog/master/trained-model/model.json",
  url_data: "/ai_learning_app/100_features_catsxdogs.json",
  layer: null,
  dimensionVec: [150, 150, 3],
  classNames: ["Cat", "Dog"]
};

const digits = {
  //url: "models/mnist/model.json",
  //url: 'https://gogulilango.com/models/digitrecognizercnn/model.json', 
  // options: digitrecognizercnn or digitrecognizermlp
  url: 'https://gogulilango.com/models/<template>/model.json',
  modelType: 'digitrecognizercnn',
  url_data: "/ai_learning_app/100_features_digits.json",
  layer: null,
  dimensionVec: [28, 28, 1],
  classNames: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
};

let modLoad = { 'pretrained' : { 'mobileNet': pretrainedModel, 'catDogs': catDogs, 'digits': digits } }

modLoad.loadModel = async function ( inModel ) {
  let dataTrain = null;
  dataTrain = await modLoad.loadData( inModel.url_data );
  
  let durl = inModel.url;
  if( inModel.modelType != null ){
    durl = durl.replaceAll('<template>', inModel.modelType );
  }
  let model = await tf.loadLayersModel( durl );
  let pretrained = null;
  
  /*
  if( inModel.layer ){
    const layer = model.getLayer( inModel.layer );
    pretrained = await tf.model({
      inputs: model.inputs,
      outputs: layer.output,
    });
  }
  */

  return [model, pretrained, dataTrain];
}

modLoad.loadData = async function ( url ) {
    let req = await fetch(url);
    let data = req.json();
    return data;
}

/* modProcess - Handle training and prediction */
let modProcess = { 'epochs':  20 };

modProcess.getVectorFromCanvas = () => {
	let image = boundingBox();
	let  pixels = tf.browser.fromPixels( image );
    return pixels;
}

modProcess.predictMulti = (pixels, obj, model, dimension) => {
	/*
	let tensor = tf.tensor(r, dimension, 'float32');
	tensor = tf.expandDims(tensor, 0);
	*/
	
	let maxd = Math.max.apply(null, dimension);
    let image = pixels.resizeNearestNeighbor( [maxd, maxd] );
    //image = image.mean(2).expandDims().toFloat().div(255.0);
    
    // cnn
    if( obj.modelType.includes('cnn') ){
        image = image.mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat()
        .div(255.0);
    }
    
    // mlp
    if( obj.modelType.includes('mlp') ){
        image = image.mean(2)
        .toFloat()
        .reshape([1 , 784])
        .div(255.0);
    }
        
	let modelPrediction = null;
    modelPrediction = model.predict( image );
    
    let results = Array.from( modelPrediction.dataSync() );
    let index = tf.tensor1d( results ).argMax(-1).dataSync()[0];
    console.log(results, index)
    results = obj.classes[index];
    
    return results;
};

modProcess.getVectorFromImgTag = function ( inputFile ){ // document.querySelector("img")
  let  pixels = tf.browser.fromPixels( inputFile );
  return pixels;
}

modProcess.predictBinary = function ( pixels, obj, model, dimension ) {
  /*
  const image = tf.reshape( pixels, dimension ).toFloat().div(tf.scalar(127)).sub(
    tf.scalar(1),
  );
  */
  let maxd = Math.max.apply(null, dimension);
  const image = pixels.resizeNearestNeighbor( [maxd, maxd] ).toFloat().expandDims();
  
  let modelPrediction = null;
  modelPrediction = model.predict( image );
  
  let results = Array.from( modelPrediction.dataSync() );
  let index = tf.tensor1d( results ).argMax(-1).dataSync()[0];
  results = obj.classes[index];
  
  return results;
}

modProcess.getModelImage = function(obj) {
  const model = tf.sequential();

  // Parameters to adjust according to dataset
  const IMAGE_WIDTH = obj.maxDim;
  const IMAGE_HEIGHT = obj.maxDim;
  const IMAGE_CHANNELS = obj.dimension.slice(-1)[0];
  const NUM_OUTPUT_CLASSES = obj.classes.length;
  let loss_function = "binaryCrossentropy";
  if( NUM_OUTPUT_CLASSES > 2){
    loss_function = 'categoricalCrossentropy';
  }
  
  // In the first layer of our convolutional neural network we have
  // to specify the input shape. Then we specify some parameters for
  // the convolution operation that takes place in this layer.
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

  // Repeat another conv2d + maxPooling stack.
  // Note that we have more filters in the convolution.
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten());

  // Our last layer is a dense layer which has 10 output units, one for each

  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: loss_function,
    metrics: ['accuracy'],
  });

  return model;
}

modProcess.transformLabels = function( obj, data ){
  let mask_y = [];
  for (let i=0; i < obj.classes.length; i++ ){
    mask_y.push(0);
  } 
  
  let temp = [];
  let trf = [];
  for( let y of data.y_train.dataSync() ){
    trf = mask_y.slice();
    trf[y] = 1;
    temp.push(trf);
  }
  data.y_train = tf.tensor( temp );
  
  temp = [];
  for( let y of data.y_test.dataSync() ){
    trf = mask_y.slice();
    trf[y] = 1;
    temp.push(trf);
  }
  data.y_test = tf.tensor( temp );   
  
  return data;
}

modProcess.filterData = function( obj ){
  let x = {};
  let y = {};
  let i = 0;
  for ( let elx of obj.train_data.x ){
    let ely = obj.train_data.y[i];
    let clas = `cls${ ely }`;
    if( ! Object.keys(x).includes(clas) ){
      x[clas] = [];
      y[clas] = [];
    }
    x[clas].push( elx );
    y[clas].push( ely );
    
    i+=1;
  }
  
  let allx_train = [];
  let ally_train = [];
  let allx_test = [];
  let ally_test = [];
  for ( let k of Object.keys(x) ){
    let length = obj.totalData ? ( x[k].length * (obj.totalData / 100) ) : x[k].length;
    length = ( length * (obj.proportionsPerClass[k] / 100) );
    
    let TRAIN_DATA_SIZE = parseInt( length * (obj.train_size_perc / 100) );
    let TEST_DATA_SIZE = parseInt( length * (obj.test_size_perc / 100) );
    
    allx_train = allx_train.concat( x[k].slice( 0, TRAIN_DATA_SIZE ).map( d => d.arraySync() ) );
    ally_train = ally_train.concat( y[k].slice( 0, TRAIN_DATA_SIZE ) );
    allx_test = allx_test.concat( x[k].slice( TRAIN_DATA_SIZE, length ).map( d => d.arraySync() ) );
    ally_test = ally_test.concat( y[k].slice( TRAIN_DATA_SIZE, length ) ); 
    
  }
  
  let data = { };
  data['x_train'] = tf.tensor( allx_train );
  data['y_train'] = tf.tensor( ally_train );
  data['x_test'] = tf.tensor( allx_test );
  data['y_test'] = tf.tensor( ally_test );
  
  return data;
}

modProcess.transformXdata = function ( obj, x, dims = null ) {
  if(obj.idModel == 'custom' ){
    let maxd = obj.maxDim;
    x = x.resizeNearestNeighbor( [maxd, maxd] ).toFloat();
  }
  else{
    x = x.reshape( dims );
  }
  
  return x;
}

modProcess.treatData = function( obj ) {
  const img_dim = obj.maxDim;
  
  let data = modProcess.filterData( obj );
  data = modProcess.transformLabels( obj, data );
  
  let TRAIN_DATA_SIZE = data.x_train.dataSync().length;
  let TEST_DATA_SIZE = data.x_test.dataSync().length;
  
  let dims_train = [TRAIN_DATA_SIZE].concat( obj.dimension );
  let dims_test = [TEST_DATA_SIZE].concat( obj.dimension );
  
  const [trainXs, trainYs] = tf.tidy(() => {
    return [
      modProcess.transformXdata( obj, data.x_train, dims_train),
      //data.x_train.reshape( dims_train ),
      //data.x_train.resizeNearestNeighbor( [maxd, maxd] ).toFloat(),
      data.y_train
    ];
  });
  

  const [testXs, testYs] = tf.tidy(() => {
    return [
      modProcess.transformXdata( obj, data.x_test, dims_test),
      //data.x_test.reshape( dims_test ),
      //data.x_test.resizeNearestNeighbor( [maxd, maxd] ).toFloat(),
      data.y_test
    ];
  });
  
  return [trainXs, trainYs, testXs, testYs]
}

modProcess.train = async function(obj, model) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = {
    name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

  const BATCH_SIZE = obj.batch_size;
  
  let [trainXs, trainYs, testXs, testYs] = modProcess.treatData( obj );
  console.log( trainXs, trainYs, testXs, testYs )
  
  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: modProcess.epochs,
    shuffle: true,
    callbacks: fitCallbacks
  });
}

modProcess.embedReduceFeaturesUmap = function ( obj ) {
  let dim = obj.embedding_size;
  let neighbors = 20;
  
  //dat = obj_cls.train_data.x.slice(0,10).map( e => e.flat(Infinity) )
  let dat = obj.train_data.x.map( e => e.flat(Infinity) )
  let u = new UMAP({ nComponents: dim, nEpochs: 100, nNeighbors: neighbors })
  let embedding = u.fit(dat);
  
  return embedding;
}

modProcess.doClustering = async function (obj, embedding) {
  let real = obj.train_data.y;
  let classLabels = obj.train_data.class;
  let emb = tf.tensor( embedding );
  
  let epochs = 30;
  let k = obj.classes.length;
  
  let kmeans = new KMeans( k, epochs ); // binary
  let predictions = await kmeans.TrainAsync(
		emb,
		// Called At End of Every Iteration
		// This function is Asynchronous
		async(iter, centroid, preds) => {
			console.log("===");
			console.log("Iteration Count", iter);
			console.log("Centroid ", await centroid.array());
			console.log("Prediction ", await preds.array());
			console.log("===");
			// You could instead use TFVIS for Plotting Here
		}
	);
	
	return [ predictions.dataSync(), real, classLabels ];
}

let modViz = {}

modViz.doPrediction = function (obj, model) {
  let [trainXs, trainYs, testXs, testYs] = modProcess.treatData( obj );
  
  const IMAGE_WIDTH = obj.maxDim;
  const IMAGE_HEIGHT = obj.maxDim;
  
  //const testData = data.nextTestBatch(testDataSize);
  //const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
  
  const labels = testYs.argMax(-1);
  const preds = model.predict(testXs).argMax(-1);

  return [preds, labels];
}

modViz.showAccuracy = async function (obj, model) {
  const [preds, labels] = modViz.doPrediction( obj, model );
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = {name: 'Accuracy', tab: 'Evaluation'};
  tfvis.show.perClassAccuracy(container, classAccuracy, obj.classes);

  labels.dispose();
}

modViz.showConfusion = async function (obj, model) {
  const [preds, labels] = modViz.doPrediction( obj, model );
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
  tfvis.render.confusionMatrix(container, {values: confusionMatrix, tickLabels: obj.classes});

  labels.dispose();
}


/* -------- Testing clustering */
/*
i='http://127.0.0.7/ai_learning_app/imgs/confusion_matrix.png'

let img = new Image();
img.src = i;
img.onload = () => {
  var output = tf.browser.fromPixels(img);
  console.log( output );
}

*/

/* -------- Testing clustering */
/*

https://github.com/PAIR-code/umap-js/tree/main
https://plotly.com/javascript/line-and-scatter/#grouped-scatter-plot

// Reducing dimensions
dat = obj_cls.train_data.x.slice(0,20).map( e => e.flat(Infinity) )
u = new UMAP({ nComponents: 128, nEpochs: 100, nNeighbors: 15})
embedding = u.fit(dat);

// Entering kmeans
kmeans = new KMeans( 2, 30 ); // binary
predictions = await kmeans.TrainAsync(
		embedding,
		// Called At End of Every Iteration
		// This function is Asynchronous
		async(iter, centroid, preds)=>{
			console.log("===");
			console.log("Iteration Count", iter);
			console.log("Centroid ", await centroid.array());
			console.log("Prediction ", await preds.array());
			console.log("===");
			// You could instead use TFVIS for Plotting Here
		}
	);
	

*/


