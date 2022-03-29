
import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';
import popper from "cytoscape-popper";

import styles from './ConnectedGraphApp.module.scss'

import {useEffect, useRef , useState} from 'react'

import label_0 from '../../dataG/label_0.json'
import label_1000 from '../../dataG/label_1000.json'
import label_2000 from '../../dataG/label_2000.json'
import label_3000 from '../../dataG/label_3000.json'
import label_4000 from '../../dataG/label_4000.json'
import label_5000 from '../../dataG/label_5000.json'
import label_6000 from '../../dataG/label_6000.json'
import label_7000 from '../../dataG/label_7000.json'

import { FaPlay , FaStop } from 'react-icons/fa';


cytoscape.use( d3Force );
cytoscape.use( cola );
cytoscape.use(popper);

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


export default function ConnectedGraphApp() {

  const cy = useRef(null)
  const ly = useRef(null)

  const cnt_arr_el = useRef(0)

  const [serverUrl, setServerUrl] = useState("http://localhost:8080")


  const [selected_node, setSelected_node] = useState({
    id : "XXX",
    label: "SELECT A NODE",
    edges: [ 
      {node: {id:"XXX" , label: "fake_node_1"} , value: 0.14} ,
      {node: {id:"XXX" , label: "fake_node_2"} , value: 9.83} ]
  });

  const arr_elements = [ label_0,label_1000,label_2000,label_3000,label_4000,label_5000,label_6000,label_7000 ]


  var myInterval = null

  const cola_layout = {
    name: 'cola',
    infinite: true,
    fit: false,
    centerGraph: true,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return edge.data("value")*1000 },

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
        },
        {
          selector: 'node',
          style: {
            'width' : '100px',
            'height' : '100px'
          }
        }
        
      ],
      layout: cola_layout,
      
      zoom: 0.24,
      pan: { x: 300, y: 240 },

    });

    

    cy.current.on('tap','edge', function(e){
      console.log(e.target.data())
    })
    cy.current.on('tap','node', function(e){
      console.log(e.target.data())

      const map_values_id = (el) => {

        console.log( el.data() );

        const n_id =  el.data("target") === e.target.data("id") ? el.data("source") : el.data("target")
        
        return {
          value :  el.data("value"),
          node : {
            id: n_id,
            label: cy.current.$('#'+n_id).data("label"),
          } 
        }
      }

      const id_values = e.target.connectedEdges().map( map_values_id )

      setSelected_node({
        id : e.target.data("id"),
        label: e.target.data("label"),
        edges: id_values
      })
    })

    cy.current.on('mouseover','node', function(event){
      event.target.popperRefObj = event.target.popper({
        content: () => {
          let content = document.createElement("div");
          content.classList.add(styles.popperDiv);
          content.innerHTML = event.target.data("label");
          document.body.appendChild(content);
          return content;
        },
      });

    });

    cy.current.on('mouseout','node', function(event){
      if (event.target.popper) {
        event.target.popperRefObj.state.elements.popper.remove();
        event.target.popperRefObj.destroy();
      }
      });

    


    return () => {}
  }, [])


  const updateRandomGraph = () =>{
    cy.current.json({elements:arr_elements[ cnt_arr_el.current % 8 ]})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()

    cnt_arr_el.current += 1;
  }
 



  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>


      <div id="serverUrl" className={styles.serverUrl}>
        <h3>Enter server url</h3> 
        <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}></input>  
        <button onClick={(e) => {document.getElementById('serverUrl').style.display = "none"}}>OK</button> 
      </div>

      <div className={styles.navbar}>
            
          <FaPlay onClick={ e => {
              myInterval = setInterval(updateRandomGraph, 2000)}
          }/>

          <FaStop onClick={ e => {
                console.log("clear interval");
                clearInterval(myInterval)
          }}/>

          <div className={styles.bar} ></div>
           
      </div>

      <div id="cy" style={{width:"70%",height:"100%",border:"10px solid black",cursor:"pointer"}}>
      </div>
      
      <div style={{width:"30%",height:"100%", border:"10px solid black" , padding:"10px"}}>

      {selected_node.label !== "SELECT A NODE" ?<>

        <h1>
          Node : {selected_node.label}
        </h1>
        <h2>
          Id : {selected_node.id}
        </h2>

        <div style={{overflow:"scroll" , height:"400px"}}>
          {selected_node.edges.map( (e,idx) => <p key={idx}> {e.node.label} {e.value}</p>)}
        </div>
        </> : <h1>Click on a Node to get more information</h1>
      }
        

      </div>

    </div>
  )
}
