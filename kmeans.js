class KMeans {
    k = 2;
    maxIter = 200;
    distanceFunction;
    centroids;

    constructor( k = 2, maxIter = 10, distanceFunction = null ) {
        this.k = k;
        this.maxIter = maxIter;
        this.distanceFunction = distanceFunction;
    }

    EuclideanDistance(values , centroids ) {
        return tf.tidy(() => values.squaredDifference(centroids).sum(1).sqrt());
    }
    
    GenerateIndices(rows) {
        const indices = [];
        indices.length = rows;
        for (let i = 0; i < indices.length; ++i)
            indices[i] = i;
        return indices;
    }
    
    NewCentroidSingle(values , assignments, cluster, rows ) {
        return tf.tidy(() => {
            // Make All Values Of Array to be of Same Size as Our Cluster
            let selectedIndices = [];
            selectedIndices.length = rows;
            selectedIndices = selectedIndices.fill(cluster);
            const selectedIndicesT = tf.tensor(selectedIndices);

            let where = tf.equal(assignments, selectedIndicesT).asType("int32");
            where = where.reshape([where.shape[0], 1]);
            const count = where.sum();

            const newCentroid = values.mul(where).sum(0).div(count)
            return newCentroid;
        })
    }
    
    NewCentroids(values, assignments) {
        return tf.tidy(() => {
            const rows = values.shape[0];
            const centroids= [];
            for (let cluster = 0; cluster < this.k; ++cluster) {
                centroids.push(this.NewCentroidSingle(values, assignments, cluster, rows));
            }
            return tf.stack(centroids);
        });
    }
    
    AssignCluster(value, centroids ) {
        let res = this.EuclideanDistance(value, centroids);
        if( this.distanceFunction != null ){
            res = this.distanceFunction(value, centroids);
        }
        
        return tf.tidy( () => res.argMin(0) );
    }
    
    AssignClusters(values, centroids ) {
        return tf.tidy(() => {
            const rows = values.shape[0];
            const minIndexes = [];
            for (const index of this.GenerateIndices(rows)) {
                const value = values.gather(index);
                minIndexes.push(this.AssignCluster(value, centroids));
                value.dispose();
            }
            return tf.stack(minIndexes);
        });
    }
    
    RandomSample(vals ) {
        return tf.tidy(() => {
            const rows = vals.shape[0];
            if (rows < this.k)
                throw new Error("Rows are Less than K");

            const indicesRaw = tf.util.createShuffledIndices(rows).slice(0, this.k);
            const indices = [];
            indicesRaw.forEach( (index) => indices.push(index))
            // Extract Random Indices
            return tf.gatherND(vals, tf.tensor(indices, [this.k, 1], "int32"))
        })
    }
    
    CheckCentroidSimmilarity(newCentroids, centroids, vals) {
        return tf.tidy(() => newCentroids
            .equal(centroids)
            .asType("int32")
            .sum(1)
            .div( vals.shape[1] )
            .sum()
            .equal(this.k)
            .dataSync()[0]
        );
    }
    
    TrainSingleStep(values) {
        return tf.tidy(() => {
            const predictions = this.Predict(values);
            const newCentroids = this.NewCentroids(values, predictions);
            return [newCentroids, predictions];
        });
    }
    
    Train(values, callback = (_centroid, _predictions) => { } ) {
        this.centroids = this.RandomSample(values);
        let iter = 0;
        while (true) {
            let [newCentroids, predictions] = this.TrainSingleStep(values);
            const same = this.CheckCentroidSimmilarity(newCentroids, this.centroids, values);
            if (same || iter >= this.maxIter) {
                newCentroids.dispose();
                return predictions;
            }
            this.centroids.dispose();
            this.centroids = newCentroids;
            ++iter;
            callback(this.centroids, predictions);
        }
    }
    
    async TrainAsync(values, callback = async (_iter, _centroid, _predictions ) => { } ) {
        this.centroids = this.RandomSample(values);
        let iter = 0;
        while (true) {
            let [newCentroids, predictions] = this.TrainSingleStep(values);
            const same = this.CheckCentroidSimmilarity(newCentroids, this.centroids, values);
            if (same || iter >= this.maxIter) {
                newCentroids.dispose();
                return predictions;
            }
            this.centroids.dispose();
            this.centroids = newCentroids;
            await callback(iter, this.centroids, predictions);
            ++iter;
        }
    }
    
    Predict(y) {
        return tf.tidy(() => {
            if (y.shape[1] == null)
                y = y.reshape([1, y.shape[0]]);
            return this.AssignClusters(y, this.centroids);
        });
    }
    
    Centroids() {
        return this.centroids;
    }
    
    Dispose() {
        this.centroids.dispose();
    }
}

/*
----------- Testing -------
dataset = tf.tensor([[2, 2, 2], [5, 5, 5], [3, 3, 3], [4, 4, 4], [7, 8, 7]]);

kmeans = new KMeans( 3, 30 );

predictions = await kmeans.TrainAsync(
		dataset,
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
