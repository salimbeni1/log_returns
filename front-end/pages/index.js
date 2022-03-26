
import styles from '../styles/Home.module.scss'

import cytoscape from 'cytoscape';
import {useEffect} from 'react'




const getRandomElement = (N) => {

  var elements = [];

    for (let i = 1; i < N; i++) {
      elements.push({ data: { id: ''+i  , label: 'Node '+i } })
    }
    for (let i = 1; i < N; i++) {
      for (let j = 1; j < N; j++) {
        if(Math.floor((Math.random() * 50)**2) === 1) 
          elements.push({ data: { id: ''+i+''+j,  source: ''+i, target: ''+j , value: i} })
      }
    }

    return elements

}




export default function Home() {

  var cy = null
  var ly = null

  var myInterval = null

  let layout = {
    name: 'cose',
  
    // Called on `layoutready`
    ready: function(){},
  
    // Called on `layoutstop`
    stop: function(){},
  
    // Whether to animate while running the layout
    // true : Animate continuously as the layout is running
    // false : Just show the end result
    // 'end' : Animate with the end result, from the initial positions to the end positions
    animate: false,
  
    // Easing of the animation for animate:'end'
    animationEasing: undefined,
  
    // The duration of the animation for animate:'end'
    animationDuration: undefined,
  
    // A function that determines whether the node should be animated
    // All nodes animated by default on animate enabled
    // Non-animated nodes are positioned immediately when the layout starts
    animateFilter: function ( node, i ){ return true; },
  
  
    // The layout animates only after this many milliseconds for animate:true
    // (prevents flashing on fast runs)
    animationThreshold: 250,
  
    // Number of iterations between consecutive screen positions update
    refresh: 50,
  
    // Whether to fit the network view after when done
    fit: true,
  
    // Padding on fit
    padding: 30,
  
    // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    boundingBox: undefined,
  
    // Excludes the label when calculating node bounding boxes for the layout algorithm
    nodeDimensionsIncludeLabels: false,
  
    // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: false,
  
    // Extra spacing between components in non-compound graphs
    componentSpacing: 40,
  
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: function( node ){ return 2048; },
  
    // Node repulsion (overlapping) multiplier
    nodeOverlap: 4,
  
    // Ideal edge (non nested) length
    idealEdgeLength: function( edge ){ return edge._private.data.value; },
  
    // Divisor to compute edge forces
    edgeElasticity: function( edge ){ return edge._private.data.value; },
  
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 1.2,
  
    // Gravity force (constant)
    gravity: 1,
  
    // Maximum number of iterations to perform
    numIter: 1000,
  
    // Initial temperature (maximum node displacement)
    initialTemp: 1000,
  
    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor: 0.99,
  
    // Lower temperature threshold (below this point the layout will end)
    minTemp: 1.0
  }

  let layout2 = {
    name: 'cose',
  
    // Called on `layoutready`
    ready: function(){},
  
    // Called on `layoutstop`
    stop: function(){},
  
    // Whether to animate while running the layout
    // true : Animate continuously as the layout is running
    // false : Just show the end result
    // 'end' : Animate with the end result, from the initial positions to the end positions
    animate: 'end',
  
    // Easing of the animation for animate:'end'
    animationEasing: undefined,
  
    // The duration of the animation for animate:'end'
    animationDuration: undefined,
  
    // A function that determines whether the node should be animated
    // All nodes animated by default on animate enabled
    // Non-animated nodes are positioned immediately when the layout starts
    animateFilter: function ( node, i ){ return true; },
  
  
    // The layout animates only after this many milliseconds for animate:true
    // (prevents flashing on fast runs)
    animationThreshold: 250,
  
    // Number of iterations between consecutive screen positions update
    refresh: 10,
  
    // Whether to fit the network view after when done
    fit: true,
  
    // Padding on fit
    padding: 30,
  
    // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    boundingBox: undefined,
  
    // Excludes the label when calculating node bounding boxes for the layout algorithm
    nodeDimensionsIncludeLabels: false,
  
    // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: false,
  
    // Extra spacing between components in non-compound graphs
    componentSpacing: 40,
  
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: function( node ){ return 2048; },
  
    // Node repulsion (overlapping) multiplier
    nodeOverlap: 4,
  
    // Ideal edge (non nested) length
    idealEdgeLength: function( edge ){ return edge._private.data.value; },
  
    // Divisor to compute edge forces
    edgeElasticity: function( edge ){ return edge._private.data.value; },
  
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 1.2,
  
    // Gravity force (constant)
    gravity: 1,
  
    // Maximum number of iterations to perform
    numIter: 1000,
  
    // Initial temperature (maximum node displacement)
    initialTemp: 1000,
  
    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor: 0.99,
  
    // Lower temperature threshold (below this point the layout will end)
    minTemp: 1.0
  }

  useEffect(() => {

    
    

    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: getRandomElement(100),
    });

    ly = cy.layout(layout);
    ly.run()
  
    return () => {}
  }, [])


  const updateRandomGraph = () =>{
    console.log("updateRandomGraph");
    cy.json({elements:getRandomElement(100)})
    ly = cy.layout(layout2)
    ly.run()
  }

 



  return (
    <div>

      <header className={styles.title}>
         <h1>LOG RETURNS Analysis</h1> 
      </header>


      <button onClick={ e => {updateRandomGraph()}}>new Graph</button>

      <button onClick={ e => {
        myInterval = setInterval(updateRandomGraph, 1500)}
        }> play </button>

      <button onClick={ e => {
        console.log("clear interval");
        clearInterval(myInterval)
        
        } }> stop </button>


      <div id="cy" style={{width:"300px",height:"300px",border:"1px solid black"}}></div>

      



    </div>
  )
}
