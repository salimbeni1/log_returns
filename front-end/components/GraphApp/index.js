
import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';
import popper from "cytoscape-popper";

import styles from './GraphApp.module.scss'

import {useCallback, useEffect, useRef , useState} from 'react'

import label_mst from '../../data/MST/MST_100.json'

/* 
import label_1 from '../../data/MST/idx=4100.json'
import label_2 from '../../data/MST/idx=5000.json'
import label_3 from '../../data/MST/idx=6000.json'
import label_4 from '../../data/MST/idx=7000.json'
import label_5 from '../../data/MST/idx=8000.json'
import label_6 from '../../data/MST/idx=9000.json'
import label_7 from '../../data/MST/idx=10000.json'


import label0_1 from '../../data/PHY/idx=4100.json'
import label0_2 from '../../data/PHY/idx=5000.json'
import label0_3 from '../../data/PHY/idx=6000.json'
import label0_4 from '../../data/PHY/idx=7000.json'
import label0_5 from '../../data/PHY/idx=8000.json'
import label0_6 from '../../data/PHY/idx=9000.json'
import label0_7 from '../../data/PHY/idx=10000.json'
*/

import { FaPlay , FaStop , FaTablets , FaTree , FaSortAmountUp ,FaSortAmountDownAlt , FaIndustry} from 'react-icons/fa';
import DensityPlot from '../DensityPlot';
import useInterval from '../../utils/useInterval';


cytoscape.use( d3Force );
cytoscape.use( cola );
cytoscape.use(popper);

export default function GraphApp() {

  const cy = useRef(null)
  const ly = useRef(null)

  const [ctn_arr, setCtn_arr] = useState(0)

  const [playButton, setPlayButton] = useState(true)
  const myInterval = useRef(null)
  const [delay, setDelay] = useState(1)
  const [update, setUpdate] = useState(false)

  const arr_elements_MST = label_mst['all']
  
  //const arr_elements_PHY = 

  const [arr_elements, setArr_elements] = useState(arr_elements_MST)

  const [selected_node, setSelected_node] = useState({
    id : "XXX",
    label: "SELECT A NODE",
    edges: [ ]
  });

  const [selected_node_values_oder, setSelected_node_values_oder] = useState("default") 


  const cola_layout = {
    name: 'cola',
    infinite: false,
    fit: false,
    
    centerGraph: false,
    nodeSpacing: function( node ){ return 10; }, // space around node
    edgeLength:  function( edge ){ return edge.data("value")*2000 },
    stop: function(){

      setUpdate(true)

    
}, 
     
    maxSimulationTime: 50000, 
    convergenceThreshold:10000,
    refresh:1
  }

  

  // update selected node state and fetch node edge values
  const update_selected_node = (id , oder) => {
    if(id === "XXX") return;
    setSelected_node_values_oder(oder)
    const map_values_id = (node_) => (el) => {
      const n_id =  el.data("target") === node_.data("id") ? el.data("source") : el.data("target")
      const curr_n = cy.current.$('#'+n_id)
      return {
        value :  el.data("value"),
        node : {
          id: n_id,
          label: curr_n.data("label"),
          sector : curr_n.data("sector"),
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
            return edges.sort(function(a, b){
              var nameA = a.node.sector.toLowerCase(), nameB = b.node.sector.toLowerCase();
              if (nameA < nameB) //sort string ascending
               return -1;
              if (nameA > nameB)
               return 1;
              return 0; //default return value (no sorting)
            });
            break;
  
          default:
            return edges
      } 
    }
    const clicked_node = cy.current.$('#'+id)
    setSelected_node({
      id : clicked_node.data("id"),
      label: clicked_node.data("label"),
      sector:  clicked_node.data("sector"),
      edges: oder_selected_node_values(
        clicked_node.connectedEdges().map( map_values_id(clicked_node) ),
        oder
        )
    })

  }

  // load next graph layout and update related states
  const next_graph_iteration = useCallback(() =>{
    const a = arr_elements[ ctn_arr % 100 ]
  
    cy.current.json({elements:a})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()
    setCtn_arr( a => a +1 )
    update_selected_node(selected_node.id , selected_node_values_oder)
  },[cy.current,ctn_arr, selected_node,arr_elements,selected_node_values_oder])

  const re_render_graph = useCallback((g) =>{
    cy.current.json({elements:g[ 0 ]})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()
    setCtn_arr( 0 )
    update_selected_node(selected_node.id , selected_node_values_oder)
  },[selected_node, selected_node_values_oder])

  const map_sector_to_color = {
    "Industrials" : "green", 
    "Technology" : "black",
    "Communication Services" : "red",
    "Basic Materials" : "blue",
    "Consumer Defensive" : "violet",
    "Energy" : "yellow",
    "Healthcare" : "pink",
    "Consumer Cyclical" : "grey",
    "Utilities" : "cyan",
    "Financial Services" : "magenta",
    "others" : "orange",
  }


  useEffect(() => {


    const elements= arr_elements[ctn_arr]

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
            'width' : '220px',
            'height' : '220px',
            'label': (e) => e.data("label"),
            "text-valign" : "center",
            "text-halign" : "center",
            "color" : "white",
            "font-weight" : "800",
            "font-size" : "50px",
            "background-color" : (e) => map_sector_to_color[e.data("sector")] ? map_sector_to_color[e.data("sector")] : map_sector_to_color["others"]

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

    return () => {}
  }, [])

  
  useInterval(function(){

        if (update) {

        const a = arr_elements[ ctn_arr % 100 ]

        cy.current.json({elements:a})
        ly.current = cy.current.layout(cola_layout)
        ly.current.run()
        
        setCtn_arr( a => a +1 )
        update_selected_node(selected_node.id , selected_node_values_oder)
        setUpdate(false)
    
      } else {
        setDelay(x => x++)
      }
      
  }, playButton ? null:  delay)

  
  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>
    

      <div id="cy" className={styles.cyDiv}>


        <div className={styles.navbar}>
          {playButton ? 
          <FaPlay onClick={() => setPlayButton(false)}/>:
          <FaStop onClick={ e => setPlayButton(true)}/>
          }
          <div className={styles.bar} >

            <div className={styles.pointer } style={{left: ((ctn_arr % 100)/100)*100 +"%"}} > </div>
            <div className={styles.date} style={{left:"0%"}} >1950</div>
            <div className={styles.date} style={{left:"50%"}}>2000</div>
            <div className={styles.date} style={{left:"100%"}}>2020</div>
          </div>
        </div>

        <div className={styles.legend}>
          {Object.keys(map_sector_to_color).map( (el , idx) => {
          return <div key={idx} className={styles.lgditm}>
             <div className={styles.color} style={{backgroundColor:map_sector_to_color[el]}}></div> 
             {el}
            </div> })}
          </div>

        <div className={styles.layouts}>

          <div className={styles.btn} onClick={ (e) => {
            setArr_elements(arr_elements_MST)
            re_render_graph(arr_elements_MST)
          }}>
             <FaTree/>
              <p>MST</p>
          </div>
          
          <div className={styles.btn} onClick={ (e) => {
            setArr_elements(arr_elements_PHY)
            re_render_graph(arr_elements_PHY)
          }} >
              <FaTablets/>
              <p>PHY</p>
          </div>
          
        </div>

      </div>
      
      <div style={{width:"30%",height:"100%", border:"10px solid black" , padding:"10px"}}>

      {selected_node.label !== "SELECT A NODE" ?<>

        <h1>
          Asset : {selected_node.label}
        </h1>

        <p>Sector : {selected_node.sector} </p>

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
            {selected_node.edges.map( (e,idx) => <p key={idx} style={{backgroundColor: map_sector_to_color[e.node.sector], color:"white"}}> {e.node.label} {e.value}</p>)}
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
