import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';


import styles from './GraphApp.module.scss'
import {useCallback,useLayoutEffect ,  useEffect, useRef , useState} from 'react'
import { FaPlay , FaStop , FaTablets , FaTree , FaSortAmountUp ,FaSortAmountDownAlt , FaIndustry, FaList} from 'react-icons/fa';

import DensityPlot from '../DensityPlot';
import useInterval from '../../utils/useInterval';


cytoscape.use( d3Force );
cytoscape.use( cola );

export default function GraphApp( props ) {

  const cy = useRef(null)
  const ly = useRef(null)

  const [ctn_arr, setCtn_arr] = useState(0)

  const [playButton, setPlayButton] = useState(true)
  const myInterval = useRef(null)

  const [delay, setDelay] = useState(1)
  const [update, setUpdate] = useState(false) 

  const [arr_elements, setArr_elements] = useState(props.json_data['all'])

  const [selected_node, setSelected_node] = useState({
    id : "XXX",
    label: "SELECT A NODE",
    sector:"none",
    edges: [ ]
  });

  const [selected_node_values_oder, setSelected_node_values_oder] = useState("default") 


  const cola_layout = {
    name: 'cola',
    infinite: false,
    fit: false,
    
    centerGraph: false,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return edge.data("value")*4000 },
    stop: function(){
      setUpdate(true)
    } , 
     
    maxSimulationTime: 5000, 
    convergenceThreshold:1000,
    refresh:1
  }

  const update_new_slider_pos = (event) =>{
    
    setCtn_arr(event.target.value)
    const a = arr_elements[ ctn_arr % arr_elements.length]
    cy.current.json({elements:a})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()
      
    update_selected_node(selected_node.id , selected_node_values_oder)

  }

  // update selected node state and fetch node edge values
  const update_selected_node = (id , oder) => {

    cy.current.$('#'+selected_node.id).unlock();
    cy.current.$('#'+id).lock();

    if(id === "XXX") {
      setSelected_node({
        id : "XXX",
        label: "SELECT A NODE",
        sector:"none",
        edges: [ ]
      })
      return;
    }
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
    const a = arr_elements[ ctn_arr % arr_elements.length ]
  
    cy.current.json({elements:a})
    ly.current = cy.current.layout(cola_layout)
    ly.current.run()
    setCtn_arr( a => a + 1 )
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
    "Industrials"            : [255, 102, 153], 
    "Technology"             : [146, 86 , 86 ],
    "Communication Services" : [86 , 86 , 146],
    "Basic Materials"        : [204, 102, 255],
    "Consumer Defensive"     : [102, 153, 255],
    "Energy"                 : [102, 255, 204],
    "Healthcare"             : [255, 204, 102],
    "Consumer Cyclical"      : [255, 0  , 102],
    "Utilities"              : [0  , 204, 0  ],
    "Financial Services"     : [204, 153, 0  ],
    "Real Estate"            : [204, 204, 255]
    /*"others"                 : [128,128,128] */
  }

  const rgb_opacity_to_rgba  = (rgb_arr , opacity ) => {
    return "rgba("+rgb_arr.join()+" , "+opacity+")"
  }

  const sector_opacity_to_rgba  = (sector , opacity ) => {
    if (sector === "none"){
      return "white"
    }
    
    const rgb_arr =  map_sector_to_color[sector] ? map_sector_to_color[sector] : map_sector_to_color["others"]
    return rgb_opacity_to_rgba(rgb_arr , opacity)
  }


  useLayoutEffect(() => {

    const elements= arr_elements[ctn_arr]

    
    cy.current = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style: [
        {
          selector: 'edge',
          style: {
            'width' : '100px',
            'height' : '100px',
            
          }
        },
        {
          selector: 'node',
          style: {
            'width' : '1000px',
            'height' : '1000px',
            'label': (e) => e.data("label"),
            "text-valign" : "center",
            "text-halign" : "center",
            "color" : "white", 
            "font-weight" : "800",
            "font-size" : "300px",
            "background-color" : (e) => sector_opacity_to_rgba(e.data("sector") , 1.0),
            "transition-property": "height, width",
            "transition-duration": "0.3s",

          }
          
        },
        {
          selector: 'node:selected',
          style: {
            'width' : '2600px',
            'height' : '2600px',
            "font-weight" : "800",
            "font-size" : "800px",
          }
        },
        {
          selector: ".hover",
          css: {
            'width' : '2600px',
            'height' : '2600px',
            "font-weight" : "800",
            "font-size" : "800px"
          }
        }
        
      ],
      layout: cola_layout,
      
      zoom: 0.008,
      pan: { x: 450, y: 260 },

    });

   

    cy.current.on('tap', function(event){
      // target holds a reference to the originator
      // of the event (core or element)
      if( event.target === cy.current ){
        // bg event click
        update_selected_node('XXX')
      }
    });
    

    cy.current.on('tap','edge', function(e){
      // tap edge event : console.log(e.target.data())
    })
    cy.current.on('tap','node', function(e){
      // tap node event : console.log(e.target.data())
      update_selected_node(e.target.data("id"))
    })

    cy.current.on('mouseover','node', function(e){
      var node = e.target[0];
      node.addClass("hover")
      
    })
    cy.current.on('mouseout','node', function(e){
      var node = e.target[0];
      node.removeClass('hover')
      
    })
    
    return () => {}
  }, [])

  
  useInterval(function(){

        if (update) {

        const a = arr_elements[ ctn_arr % arr_elements.length ]

        cy.current.json({elements:a})
        ly.current = cy.current.layout(cola_layout)
        ly.current.run()
        
        setCtn_arr( a => a +1 )
        update_selected_node(selected_node.id , selected_node_values_oder)
        setUpdate(false)
    
      } else {
        setDelay(x => x)
      }
      
  }, playButton ? null:  delay)

  const clean_dropdown = (event, elem, style) => {

    if (typeof elem != 'undefined'){
    
      if (!elem.contains(event.target)) {
        var list = document.getElementsByClassName(style)
        for (var i = 0; i < list.length; i++) {
          list[i].style['display'] = "none"
        } 
      }
    }
  }
  const clean_dropdown_simple = (style) => {
    var list = document.getElementsByClassName(style)
    for (var i = 0; i < list.length; i++) {
        list[i].style['display'] = "none"
    } 
  }

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {

    clean_dropdown(event,document.getElementsByClassName(styles.dropdown)[0],styles.layouts)
    clean_dropdown(event, document.getElementsByClassName(styles.dropdown)[1],styles.orderBar)

  }
  
  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>
    
      <div className={styles.cyContainer}>
      <div id="cy" className={styles.cyDiv}>

      <div className={styles.dropdown}>
        <FaList onClick={() => {
       
          var list = document.getElementsByClassName(styles.layouts)
          for (var i = 0; i < list.length; i++) {
            list[i].style['display'] = "block"
          } 
        }
        }/>
  
        <div className={styles.layouts}>

          <div className={styles.btn} onClick={ () => props.reload_data('MST')}>
             <FaTree/>
              <p>MST</p>
          </div>
          
          {/**
           <div className={styles.btn} onClick={ e => props.reload_data('PHY')} >
              <FaTablets/>
              <p>PHY</p>
          </div>
           */}
          
          
        </div>
      </div>


      
        <div className={styles.legend}>
          {Object.keys(map_sector_to_color).map( (el , idx) => {
          return <div key={idx} className={styles.lgditm}>
             <div className={styles.color} style={{backgroundColor:sector_opacity_to_rgba(el , 1.0)}}></div> 
             {el}
            </div> })}
          </div>

        

      </div>
      <div className={styles.navbar}>
          {playButton ? 
          <FaPlay onClick={() => setPlayButton(false)}/>:
          <FaStop onClick={ e => setPlayButton(true)}/>
          }
          <div className={styles.bar} >
            <input type="range" min="0" max="745" value={ctn_arr} onChange={update_new_slider_pos} step="1" className={styles.slider}/>
            <div className={styles.date} style={{left:"0%"}} >2007</div>
            
            <div className={styles.dateCriseMarker} style={{left:"11%"}} >
              <div className={styles.dateCrise1}  >Financial Crisis</div>
            </div>
            <div className={styles.date} style={{left:"45%"}}>2015</div>
            
            <div className={styles.dateCriseMarker} style={{left:"88%"}} >
            <div className={styles.dateCrise2}  >COVID-19 pandemic</div>
            </div>
            <div className={styles.date} style={{left:"95%"}}>2022</div>
          </div>
      </div>
      </div>

      <div className={styles.wrapper} style={{backgroundColor: sector_opacity_to_rgba(selected_node.sector , .3),}}>

        <div className={styles.content} >

          {selected_node.label !== "SELECT A NODE" ?<>

            <div className={styles.cntInfo}>

              <h1 > Asset  </h1>
              <h1 > {selected_node.label}</h1>

            </div>
            <div className={styles.cntInfo}>
              <p>Sector </p>
              <p>{selected_node.sector} </p>
            </div>

            <div className={styles.scrollable}>
            <div className={styles.ctnInfo2} style={{backgroundColor: rgb_opacity_to_rgba( [255,255,255] , 0.4)}}>
              <div className={styles.content2} >
                <h3>values per asset</h3>
                <div className={styles.nodeEdgeValues} >

                <div className={styles.dropdown}>
                  <FaList onClick={() => {
       
                    var list = document.getElementsByClassName(styles.orderBar)
                    for (var i = 0; i < list.length; i++) {
                      list[i].style['display'] = "block"
                    } 
                  }
                  }/>
                
                  <div className={styles.orderBar}>
                     

                    <FaSortAmountUp className={styles.btn}
                    onClick={ (e) => {
                        update_selected_node(selected_node.id , "UP")
                        clean_dropdown_simple(styles.orderBar)
                    }}/>
                    
                    <FaSortAmountDownAlt className={styles.btn}
                    onClick={ (e) => {
                      update_selected_node(selected_node.id , "DOWN")
                      clean_dropdown_simple(styles.orderBar)
                    }}/>
                    <FaIndustry className={styles.btn}
                    onClick={ (e) => {
                      update_selected_node(selected_node.id , "SECTOR")
                      clean_dropdown_simple(styles.orderBar)
                    }}/>
                  </div>
                  </div>

                  <div className={styles.edgeTable}>
                    {selected_node.edges.map( (e,idx) => <p key={idx} style={{backgroundColor: sector_opacity_to_rgba(e.node.sector , 0.5), color:"white"}}> {e.node.label} {e.value}</p>)}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ctnInfo2} style={{backgroundColor: rgb_opacity_to_rgba( [255,255,255] , 0.4)}}>
              <div className={styles.content2}>

                <h3>values distribution</h3>
                <DensityPlot 
                  data={selected_node.edges.map(e => e.value)}
                  dataGlobal={cy.current.edges("[value]").map(e => e.data("value"))}
                  color={sector_opacity_to_rgba(selected_node.sector , 0.8)}
                />
              </div>
            </div>

            </div>
            
            </> : 
            <>
            <h1>Clustering Financial Time Series</h1>
            
            <p>Click on a node for more information of their correlations alongside interaction networks.</p>
            </>
          }
          

        </div>
      </div>
    </div>
  )
}


const propTypes = {
  json_data: { },
  reload_data: Function
}; 

GraphApp.propTypes = propTypes;

GraphApp.defaultProps = {
  json_data: { "all" : { } },
  reload_data: () => console.log("NOT IMPLEMENTED: assign props to GraphApp")
};