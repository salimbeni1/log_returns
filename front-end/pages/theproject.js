
import styles from '../styles/TheProject.module.scss'


export default function Home() {

  return <>

  <div className={styles.grid}>
  
    <div className={styles.ctn}>

    Correlation between stock prices gives powerful insights into the
    evolution of financial systems in interesting periods: during a financial
    crisis, political instability, or significant economic development of a country.
    Correlation tells us a lot about how stocks are linked, such as how industries are
    dependent on or independent of crisis or development in specific economic sectors. 
    The notion of stock independence has numerous applications: an instrumental one is
    portfolio differentiation for risk minimization.
    The goal of this visualization is to represent the evolution in time of correlation,
    hierarchies and clustering of various financial stocks.
    Visualization is done through graphs and basic graph theory principles,
    focusing on per-sector analysis. In our visualization,
    we represent stocks as nodes of a graph and their corresponding correlation as the weight
    of the edges connecting them.
    
    </div>

    <h1> <center>LOG RETURN</center></h1>


    <div className={styles.quote}> 
      
      <h1>  
        What shakes the FX tree?
        Understanding currency dominance,
        dependence, and dynamics  </h1>  
      <p> 
        Johnson, Neil, McDonald, Mark, Suleman, Omer, Williams,
        Stacy, Howison, Sam </p>
      
    </div>

    <div className={styles.ctn}>

      One area of particular interest in FX trading is to identify which, if any, 
      of the currencies are in play during a given period of time. More precisely,
      we are interested in understanding whether particular currencies appear to be assuming
      a dominant or dependent role within the network, and how this changes over time. Since
      exchange rates are always quoted in terms of the price of one currency compared to another, 
      this is a highly non-trivial task. Since the MST contains only a subset of the information from the
      correlation matrix, it cannot tell us anything which we could not, in principle, obtain by analyzing the matrix 
      itself. However, as with all statistical tools, the hope is that it can provide an insight 
      into the system overall behavior which would not be so readily obtained from the large correlation 
      matrix itself.
    </div>



    <div className={styles.ctn}>
    Other than the general visualisation of the graph, each stock (node) has a variety of specific information
    which are interesting to view while looking at the evolving animation. For example: sector, industry, number of full-time employees,
    correlation value of selected stock with adjacent ones and neighbouring nodes sector-distribution.
    Our visualisation enables the user to gain all of these insights by simply clicking on the desired node 
    on the graph. 
    
    </div>

    <h1> <center>Visualisation of stock information</center></h1>


    <h1><center>Data processing </center></h1>

    <div className={styles.ctn}>

    In order to obtain the correlation values of each pair of stocks,
    we select two stocks and a window of size n on the data set (where n is the number of days which the window will represent)
    and compute the Pearson correlation in log returns between the two selected stocks in the window time-frame.
    If we repeat this process for each pair of stocks in our data set, we can structure our correlation matrix.
    However, one time window is not that insightful. In order to represent the correlation evolving with time we must compute k
    of these matrices and thus have k windows on the data-set. More correlation matrices will enable us to visualize the evolution of correlation between stocks in desired periods
    (e.g. during a financial crisis, political instability or economic development). The final graph however will not directly represent
    the notion of correlation but it’s proportional inverse: distance. The notion of distance is straightforward when visualizing data on a graph.
    Data-processing in the distance-matrix step transforms the correlation matrix into a distance matrix using distance co-variance. 
    In order to easily visualize this graph, we compute the minimum spanning tree (MST). An MST always exists since the graph is fully-connected.
    The graph will thus be constructed by nodes represented by stocks and edges with weights representing the distance co-variance between each pair of stocks.
    </div>



      </div>

  </>

     
}
