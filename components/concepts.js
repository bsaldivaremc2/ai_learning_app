class Concepts extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
       <section id="intro_doc" class="mt-3" style="margin-bottom: 20px;" >
            <h3> Fundamental Concepts </h3>
            <p>
               Machine learning (ML) is the computation area that provides methods to infer patterns based on data collected from real world applications and uses these patterns to predict behavior of new pieces of data withput being explicitly programmed. <br />
               There are many tasks that can be done using machine learning as well as diverse applications that you already use without perceiving such as weather forecasting, metal detector in bank revolving doors, face recognition, etc. <br />
               Most of these tasks may be grouped in mainly two categories: supervised learning or unsupervised learning. In both categories, three elements are needed: (i) previous prepared data about the domain (images, tables, spreadsheets); (ii) the algorithm that will be used to infer the patterns in this data based on probabilities, weights and and mathematical functions; (iii) an abstract model that is saved upon processing and estimating weights that minimize the errors concerning the true answer and the predicted answer. Once having this model, we can predict behavior for new pieces of data. <br />
               The first category, supervised learning, contains those methods that need to be fed with pieces of data concerning the domain of prediction, and this data needs to be labeled with the correct answer. In the example of the cats X dogs problem, the model was built using as training data pictures of dogs and cats, these pictures received a corresponding answer (label): cat or dog. However the algorithm does not see the pictures as we humans see, the image is transformed into a list of numbers. These numbers are extracted from the pixels that form each image, there are n pixels (width) X m pixels (height) and in each pixel there is a color represented in a number for the red, blue and green primary colors. Higher the image resolution is, higher is the number of elements in the list designed for each image (n x m x 3). <br />
               The second category, unsupervised learning, comprises the methods that do not need previous data neither a training phase, they try to derive patterns and group th epieces of data according to th eminimization of the distances among the data examples. The answer of the algorithm is the identifier of the cluster in which the model thinks that the data belong to, and we can still save a model. Although we do not need to provide the labels, we can still evaluate the model clustering labels with gold standard labels. In most of the clustering methods, we need to provide a hint about the number of possible groups that the data form. In the digits case, we want the algorithm to form 10 groups of data and in the cat x dogs problem it should be able to separate the data into 2 groups.
            </p>
            
            <h4> Evaluation metrics </h4>
            <p>
               When we are studying in school, the teacher evaluates our answers in exams and provides grades by comparing the reference answers (the teacher answers - gold standard) with the answers provided by the students, and then gives an overall score based on the count of correct answers. The rationale to evaluate whther the machine is learning correctly or not is almost the same. We have a list of true answers, for instance a set of labels for dogs and cats images. <br />
               The same way that the teacher uses a math formula, that we may name as metric, to get the overall score: number acertos divided by total number of questions, the ML algorithms use a similar formula to measure how great the "student" model trained is in learning the application domain. There are three main evaluation metrics: accuracy, precision and recall. The accuracy already gives a hint about the performance of the model in a summarised manner, however sometimes, depending on the application domain, we need to investigate the performance focusing on the target class, this is the main usage of the precision and recall metrics.<br />
               All of them derive from a table that organises all the wrong and right answers of the model, that we name as confusion matrix:
               
            </p>
            
            <div class="row" >
                Let's focus and apply to the cats x dogs classification problem. We have a lot of images that we know which animal is in them. Then we built a model and we evaluate the right and correct answers we got this table below. From 180 pictures, it said that that they belong to the correct animal in 150 of them. When we do this matrix, each cell has a name based on a target class, in this case the target class was cat, this is what we call the positive, so the dogs are the negative examples of the target cat. This is the reason why the green ones correspond to true positives (TP) (labeled and predicted as cats) and true negatives (TN) (labeled and predicted as dogs). False positive (FP) are those that are labeled as dogs but the model predicted as cats, the same manner the false negatives (FN) are those predicted as dogs but indeed the picture was a cat.
                <div class="col-md-12 text-center" >
                    <img src='imgs/confusion_matrix.png'  />
                </div>
                
                <ul> Based on these four variables (TP, TN, FP, FN), we can calculate the three distinct metrics:
                    <li> <b>Accuracy: </b> This is the same metric that the teacher applies to calculate the overall score of a studen in an exam, formed by the ration between the right answers and the total of answers. Formula: (TP + TN)/(TP + TN + FP + FN). In the example, it would be (90 + 60)/(60 + 90 + 20 + 10) = 0.833. In general, we multiply by 100 to represent it as percentage (83.3%).</li>
                    <li> <b>Precision: </b> This metric takes into consideration the correct predictions for the target class (TP) in relation all the pieces of data that were predicted as positive (TP + FP). Formula: (TP)/(TP + FP). In the example, it would be (60)/(60 + 20) = 0.75 (or 75%). In the example, from all images that the model said that were cats, only 75% of them indeed were cats. </li>
                    <li> <b>Recall: </b> This metric also focus on the correct positive class identification but in relation to all the positive examples in the data of the target class (TP + FN). Formula: (TP)/(TP + FN). In the example, it would be (60)/(60 + 10) = 0.8571 (or 85.71%). In the example, from all images that pictures belonging to cats, in 85.7% of them the model answered correctly.</li>
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
