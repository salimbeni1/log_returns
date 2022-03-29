import styles from '../styles/Home.module.scss'

import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';

import {useEffect, useRef} from 'react'

import label_0 from '../dataG/label_0.json'
import label_1000 from '../dataG/label_1000.json'
import label_2000 from '../dataG/label_2000.json'
import label_3000 from '../dataG/label_3000.json'
import label_4000 from '../dataG/label_4000.json'
import label_5000 from '../dataG/label_5000.json'
import label_6000 from '../dataG/label_6000.json'
import label_7000 from '../dataG/label_7000.json'


cytoscape.use( d3Force );
cytoscape.use( cola );



const getRandomElement = (N) => {

  var elements = []

    for (let i = 1; i < N; i++) {
      elements.push({  id: 'a'+i  ,data: { id: 'a'+i  , label: 'Node '+i } })
    }
    for (let i = 1; i < N; i++) {
      for (let j = 1; j < N; j++) {
        if(Math.floor((Math.random() * 50)**2) === 1) 
          elements.push({ id: ''+i+''+j,data: { id: ''+i+''+j,  source: 'a'+i, target: 'a'+j , value: i} })
      }
    }

    return elements

}




export default function Home() {

  const cy = useRef(null)
  const ly = useRef(null)

  const cnt_arr_el = useRef(0)

  const arr_elements = [ label_0,label_1000,label_2000,label_3000,label_4000,label_5000,label_6000,label_7000 ]


  var myInterval = null

  const cola_layout = {
    name: 'cola',
    infinite: true,
    fit: false,
    centerGraph: true,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return edge.data("value")*1000; },

  }



  useEffect(() => {

    const elements= arr_elements[cnt_arr_el.current]

    cy.current = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style: [
        {
          selector: 'edge',
          style: {
            'opacity' : (e)=>{ 
            let max = 2.0
            let min = 1.3
            return Math.min(1, Math.max(0, (e.data("value")-min)/(max-min)))
            }
          }
        }
      ],
      layout: cola_layout

    });

    cy.current.on('tap','edge', function(e){
      console.log(e.target.data())
    })
    cy.current.on('tap','node', function(e){
      console.log(e.target.data())
    })

    return () => {}
  }, [])


  const updateRandomGraph = () =>{
    cy.current.json({elements:arr_elements[ cnt_arr_el.current % 8 ]})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()

    cnt_arr_el.current += 1;
  }

 



  return (
    <div>

      <header className={styles.title}>
         <h1>LOG RETURNS Analysis</h1> 
      </header>



      <button onClick={ e => {updateRandomGraph()}}>new Graph</button>

      <button onClick={ e => {
        console.log("label_0");
        cy.current.json({elements:label_0})
        ly.current = cy.current.layout(cola_layout)
        ly.current.run()
      }}>label_0</button>

      <button onClick={ e => {
          console.log("label_0");
          cy.current.json({elements:label_1000})
          ly.current = cy.current.layout(cola_layout)
          ly.current.run()
      }}>label_1000</button>

      <button onClick={ e => {
        myInterval = setInterval(updateRandomGraph, 1000)}
      }> play </button>

      <button onClick={ e => {
        console.log("clear interval");
        clearInterval(myInterval)
        
      }}> stop </button>


      <div id="cy" style={{width:"1000px",height:"1000px",border:"1px solid black"}}></div>

      



    </div>
  )
}
