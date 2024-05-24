class Concepts extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
         <section id="intro_doc" class="mt-3" style="margin-bottom: 20px;" >
              <h3> Conceptes Fonamentals </h3>
              <p>
                 L'aprenentatge automàtic (ML) és una branca de la computació que permet a les màquines aprendre de les dades i fer prediccions sense estar explícitament programades per a això. S'utilitza en tasques quotidianes com la predicció del temps, els detectors de metalls en bancs i el reconeixement facial.

                Hi ha dos tipus principals d'aprenentatge automàtic:

                    Aprenentatge supervisat: En aquest cas, el model s'entrena amb dades que ja estan etiquetades amb la resposta correcta. Per exemple, per diferenciar entre imatges de gossos i gats, s'utilitza un conjunt d'imatges de gossos i gats etiquetades com a tal. El model aprèn a identificar les imatges basant-se en aquestes etiquetes.

                    Aprenentatge no supervisat: En aquest cas, el model no necessita dades etiquetades. En lloc d'això, agrupa les dades per similituds. Per exemple, en un conjunt d'imatges de números escrits a mà, el model agrupa els números similars sense saber prèviament quin número és cadascun.

                En ambdós casos, el procés involucra tres passos: recopilar dades, utilitzar un algorisme per trobar patrons en aquestes dades, i crear un model que pugui fer prediccions sobre noves dades basant-se en aquests patrons.
              </p>
              
              <h4> Mètriques d'avaluació </h4>
              <p>
               Quan estudiem a l'escola, el mestre avalua les nostres respostes als exàmens comparant-les amb les respostes correctes i després ens dona una qualificació basada en quantes respostes encertem. Avaluar si un model està aprenent correctament funciona de manera similar. Tenim una llista de respostes correctes, com un conjunt d'etiquetes per a imatges de gossos i gats.

              Els algoritmes d'aprenentatge automàtic utilitzen fórmules matemàtiques, anomenades mètriques, per mesurar com de bé està aprenent el model. Hi ha tres mètriques d'avaluació principals: precisió, exactitud i recuperació. La precisió ens dona una idea general del rendiment del model, però a vegades necessitem realitzar un anàlisi més precis usant l'exactitud i la recuperació, en funció del cas.

              Totes aquestes mètriques es deriven d'una taula que organitza totes les respostes correctes i incorrectes del model, anomenada matriu de confusió:
              </p>
              
              
              <div class="row" >
                  Ens centrarem en el problema de classificar imatges de gats i gossos. Tenim moltes imatges en què sabem quin animal apareix. Construïm un model i avaluem les seves respostes correctes i incorrectes amb aquesta taula. De 180 imatges, el model en va encertar 150.

                  A la taula, cada cel·la té un nom basat en l'etiqueta, en aquest cas, "gat". Els gats són els exemples positius i els gossos són els exemples negatius. Els "veritables positius" (VP) són imatges etiquetades i predites com a gats, i els "veritables negatius" (VN) són imatges etiquetades i predites com a gossos. Els "falsos positius" (FP) són imatges etiquetades com a gossos però predites com a gats, i els "falsos negatius" (FN) són imatges etiquetades com a gats però predites com a gossos.
              
                  <div class="col-md-12 text-center" >
                      <img src='/ai_learning_app/imgs/confusion_matrix.png'  />
                  </div>
                  
                  <ul> Basant-nos en aquestes quatre variables (VP, VN, FP, FN), podem calcular tres mètriques diferents:
                     <li> <b>Exactitud:</b> Aquesta mètrica mesura la proporció de prediccions correctes sobre el total de prediccions. Fórmula: (VP + VN) / (VP + VN + FP + FN). Per exemple, seria (90 + 60) / (60 + 90 + 20 + 10) = 0.833, el que es representa com un 83.3%.</li>
                    <li> <b>Precisió:</b> Aquesta mètrica se centra en la precisió de les prediccions positives. És a dir, quantes de les prediccions positives són realment correctes. Fórmula: (VP) / (VP + FP). Per exemple, seria (60) / (60 + 20) = 0.75, el que representa un 75%. De totes les imatges que el model va identificar com a gats, només el 75% realment eren gats.</li>
                    <li> <b>Recuperació:</b> Aquesta mètrica mesura la capacitat del model per identificar correctament totes les instàncies positives. Fórmula: (VP) / (VP + FN). Per exemple, seria (60) / (60 + 10) = 0.8571, el que representa un 85.71%. De totes les imatges que realment eren de gats, el model va identificar correctament el 85.71%.</li>
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
  
