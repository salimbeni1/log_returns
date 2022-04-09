
import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';
import popper from "cytoscape-popper";

import styles from './ConnectedGraphApp.module.scss'

import {useEffect, useRef , useState} from 'react'

import axios from 'axios';



///* 
import label_1 from '../../data/MST/idx=4100.json'
import label_2 from '../../data/MST/idx=5000.json'
import label_3 from '../../data/MST/idx=6000.json'
import label_4 from '../../data/MST/idx=7000.json'
import label_5 from '../../data/MST/idx=8000.json'
import label_6 from '../../data/MST/idx=9000.json'
import label_7 from '../../data/MST/idx=10000.json'
//*/
/* 
import label_1 from '../../data/PHY/idx=4100.json'
import label_2 from '../../data/PHY/idx=5000.json'
import label_3 from '../../data/PHY/idx=6000.json'
import label_4 from '../../data/PHY/idx=7000.json'
import label_5 from '../../data/PHY/idx=8000.json'
import label_6 from '../../data/PHY/idx=9000.json'
import label_7 from '../../data/PHY/idx=10000.json'
*/
import { FaPlay , FaStop , FaSortAmountUp ,FaSortAmountDownAlt , FaIndustry} from 'react-icons/fa';
import DensityPlot from '../DensityPlot';


cytoscape.use( d3Force );
cytoscape.use( cola );
cytoscape.use(popper);



export default function ConnectedGraphApp() {

  const cy = useRef(null)
  const ly = useRef(null)

  const cnt_arr_el = useRef(0)

  const [playButton, setPlayButton] = useState(true)
  const myInterval = useRef(null)

  const [serverUrl, setServerUrl] = useState("http://127.0.0.1:8000")
  const [jsonsData, setJsonsData] = useState( { } )

  /* data window variables */
  const [dataFrom, setDataFrom] = useState( 1 )
  const [dataTo, setDataTo] = useState( 2000 )

  /* LOAD DATA FROM SERVER */
  function load_data_from_server() { 
    axios.get(serverUrl + `/correlation/${dataFrom}:${dataTo}/0.5`).then(jsons => {
      console.log(" FETCH COMPLETED ")
      setJsonsData(jsons.data)
      jsons.data
    }).catch(err => {
      console.log(" NETWORK ERROR ")
      console.log(err)
    })
  }  

  const arr_elements = [ jsonsData ]

  console.log(arr_elements)

  const [selected_node, setSelected_node] = useState({
    id : "XXX",
    label: "SELECT A NODE",
    edges: [ ]
  });

  const [selected_node_values_oder, setSelected_node_values_oder] = useState("default") 


  const cola_layout = {
    name: 'cola',
    infinite: true,
    fit: false,
    centerGraph: true,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return edge.data("value")*1000 },

  }

  // update selected node state and fetch node edge values
  const update_selected_node = (id , oder) => {
    if(id === "XXX") return;
    setSelected_node_values_oder(oder)
    const map_values_id = (node_) => (el) => {
      const n_id =  el.data("target") === node_.data("id") ? el.data("source") : el.data("target")
      return {
        value :  el.data("value"),
        node : {
          id: n_id,
          label: cy.current.$('#'+n_id).data("label"),
        } 
      }
    }
    const oder_selected_node_values = ( edges , order ) => {
      switch (order) {      
          case "UP":
            return edges.sort(function(a, b){return b.value - a.value});
            break;
  
          case "DOWN":
            return edges.sort(function(b, a){return b.value - a.value});
            break;
  
          case "SECTOR":
            return edges
            break;
  
          default:
            return edges
      } 
    }
    const clicked_node = cy.current.$('#'+id)
    setSelected_node({
      id : clicked_node.data("id"),
      label: clicked_node.data("label"),
      edges: oder_selected_node_values(
        clicked_node.connectedEdges().map( map_values_id(clicked_node) ),
        oder
        )
    })

  }

  // load next graph layout and update related states
  const next_graph_iteration = () =>{
    cy.current.json({elements:arr_elements[ cnt_arr_el.current % 8 ]})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()
    cnt_arr_el.current += 1;
    update_selected_node(selected_node.id , selected_node_values_oder)
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
            return 0.5-(Math.min(1, Math.max(0, (e.data("value")-min)/(max-min))))*1000
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
      
      zoom: 0.18,
      pan: { x: 300, y: 240 },

    });

    

    cy.current.on('tap','edge', function(e){
      // tap edge event : console.log(e.target.data())
    })
    cy.current.on('tap','node', function(e){
      // tap node event : console.log(e.target.data())
      update_selected_node(e.target.data("id"))
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

    console.log(cy.current.edges("[value]").map(e => e.data("value")));


    return () => {}
  }, [])


  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>
      
    <div id="serverUrl" className={styles.serverUrl}>
        <h3>Enter server url</h3> 
        <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}></input>
        <text> . </text>  
        <text> Select the data interval below: </text>
        <input type="number" value={dataFrom} onChange={(dF) => setDataFrom(dF.target.value)}></input> 
        <input type="number" value={dataTo} onChange={(dT) => setDataTo(dT.target.value)}></input>   
        <button onClick={(e) => {
          document.getElementById('serverUrl').style.display = "none"
          load_data_from_server()
          }}>OK</button> 
    </div>

      <div className={styles.navbar}>

          {playButton ? 
          <FaPlay onClick={ e => {myInterval.current = setInterval(next_graph_iteration, 2000);setPlayButton(false)}}/>:
          <FaStop onClick={ e => {clearInterval(myInterval.current) ; setPlayButton(true)}}/>
          }
          
          <div className={styles.bar} ></div>
           
      </div>

      <div id="cy" style={{width:"70%",height:"100%",border:"10px solid black",cursor:"pointer"}}>
      </div>
      
      <div style={{width:"30%",height:"100%", border:"10px solid black" , padding:"10px"}}>

      {selected_node.label !== "SELECT A NODE" ?<>

        <h1>
          Asset : {selected_node.label}
        </h1>

        <h3>values per asset</h3>
        <div className={styles.nodeEdgeValues} >
        
          <div className={styles.orderBar}>
            order by : 

            <FaSortAmountUp style={ selected_node_values_oder === "UP" ?  { color:"white", backgroundColor:"black"} :  {color:"black" , backgroundColor:"transparent"} }
             onClick={ (e) => {
                update_selected_node(selected_node.id , "UP")
            }}/>
            
            <FaSortAmountDownAlt style={ selected_node_values_oder === "DOWN" ?  { color:"white", backgroundColor:"black"} :  {color:"black" , backgroundColor:"transparent"} }
            onClick={ (e) => {
              update_selected_node(selected_node.id , "DOWN")
            }}/>
            <FaIndustry style={ selected_node_values_oder === "SECTOR" ?  { color:"white", backgroundColor:"black"} :  {color:"black" , backgroundColor:"transparent"} }
            onClick={ (e) => {
              update_selected_node(selected_node.id , "SECTOR")
            }}/>
          </div>

          <div className={styles.edgeTable}>
            {selected_node.edges.map( (e,idx) => <p key={idx}> {e.node.label} {e.value}</p>)}
          </div>
        </div>

        <h3>values distribution</h3>
        <DensityPlot 
          data={selected_node.edges.map(e => e.value)}
          dataGlobal={cy.current.edges("[value]").map(e => e.data("value"))}
         />
        

        </> : <h1>Click on a Node to get more information</h1>
      }
        

      </div>

    </div>
  )
}
