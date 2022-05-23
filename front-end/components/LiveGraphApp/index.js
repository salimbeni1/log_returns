import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';
import { getServerPath } from '../../utils/utils';


import styles from './LiveGraphApp.module.scss'
import {useCallback, useLayoutEffect , useRef , useState} from 'react'
import { FaAngleRight,FaStopwatch ,  FaExpandArrowsAlt, FaCompressArrowsAlt , FaRegCalendarAlt , FaAngleLeft, FaAngleDoubleRight, FaAngleDoubleLeft, FaPlay , FaStop , FaHubspot, FaTree, FaTablets, FaFirstOrderAlt , FaSortAmountUp ,FaSortAmountDownAlt , FaIndustry, FaList} from 'react-icons/fa';
import { BiReset } from 'react-icons/bi';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';

import DensityPlot from '../DensityPlot';
import SectorPlot from '../SectorPlot';
import useInterval from '../../utils/useInterval';

import NumberPicker from "react-widgets/NumberPicker";



cytoscape.use( d3Force );
cytoscape.use( cola );

export default function LiveGraphApp( ) {

  const jsonsData = useRef({})

  const fetchData = async () => {
    const response = await fetch(getServerPath() + 'api/all_opt')
    const data = await response.json();
    jsonsData.current = data;
  }

  const graph_layout = 'cola_layout'

  const cy = useRef(null)
  const ly = useRef(null)

  const [currentDate, setCurrentDate] = useState('now')

  const [sideBarIsHidden, setSideBarIsHidden] = useState(false)

  const [selected_node, setSelected_node] = useState({
    id : "XXX",
    label: "SELECT A NODE",
    sector:"none",
    edges: [ ]
  });

  const [selected_node_values_oder, setSelected_node_values_oder] = useState("default") 

  const DAY_INTERVAL = 1
  const WEEK_INTERVAL = 5
  const MONTH_INTERVAL = 22
  const YEAR_INTERVAL = 252


  // update selected node state and fetch node edge values
  const update_selected_node = (id , oder) => {

    cy.current.nodes().unlock();
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

  const map_sector_to_color = {
    "Blockchain"             : [46,139,87]
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

    (async () => {
      
    
    
    await fetchData()
    const elements= jsonsData.current['all'][0]
    setCurrentDate(jsonsData.current['all'][0]['date'])
    
    cy.current = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style: [
        {
          selector: 'edge',
          style: (graph_layout === 'concentric_layout') ? 
          {'width' : '20px',
           "line-color" : e => {
            const factor = e.data('timelife')?e.data('timelife'):0
            return factor >= 1 ? 'black' : 'red'}
            }:
          {'width' : '500px',
           "line-color" : e => {

             const max_color_gradient_steps = 10.0
             const factor = e.data('timelife')? Math.min(e.data('timelife')/max_color_gradient_steps , 1.0) :0
             const color_2 = [0, 0, 0]       // old edge
             const color_1 = [200, 200, 200] // new edge

             function lerpRGB(color1, color2, t) {
              let color = [0,0,0];
              color[0] = color1[0] + ((color2[0] - color1[0]) * t);
              color[1] = color1[1] + ((color2[1] - color1[1]) * t);
              color[2] = color1[2] + ((color2[2] - color1[2]) * t);
              return color;
          }

             return rgb_opacity_to_rgba( lerpRGB(color_1 , color_2 , factor) , 1.0 )} // opacity doesnt effect line-color
             }
        },
        {
          selector: 'node',
          style: {
            'width' : '4000px',
            'height' : '4000px',
            'label': (e) => e.data("label"),
            "text-valign" : "center",
            "text-halign" : "center",
            "color" : "white", 
            "font-weight" : "800",
            "font-size" : "500px",
            "background-color" : (e) => sector_opacity_to_rgba(e.data("sector") , 1.0),
            "transition-property": "height, width",
            "transition-duration": "0.3s",

          }
          
        },
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': '0',
            "background-color" : 'black',


          }
        },
        {
          selector: 'node:selected',
          style: {
            'width' : '6000px',
            'height' : '6000px',
            "font-weight" : "800",
            "font-size" : "1000px",
          }
        },
        {
          selector: ".hover",
          css: {
            'width' : '6600px',
            'height' : '6600px',
            "font-weight" : "800",
            "font-size" : "1000px"
          }
        }
        
      ],
      layout: layout_map[graph_layout],
      
      zoom: 0.009,
      pan: { x: 450, y: 260 },

      minZoom: 0.0015,
      maxZoom: 0.052,

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
      
    })
    cy.current.on('tap','node', function(e){
      
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

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {

      clean_dropdown(event, document.getElementsByClassName(styles.dropdown)[1],styles.orderBar)
    
    }
  })();
    
    return () => {}
  }, [])


  useInterval(function(){


      fetchData()
      
      setCurrentDate(jsonsData.current['all'][0]['date'])
      
      const a = jsonsData.current['all'][0]

      // keep track of new edges
      for ( const e of a.edges){
          const previous_e_1 = cy.current.$('edge[source = "'+e.data['source']+'"][target = "'+e.data['target']+'"]')
          const previous_e_2 = cy.current.$('edge[source = "'+e.data['target']+'"][target = "'+e.data['source']+'"]')
          
          const is_still_alive =  previous_e_1.size() === 1 || previous_e_2.size() === 1

          let previous_e
          if(previous_e_1.size() === 1){
            previous_e = previous_e_1
          } else if (previous_e_2.size() === 1) {
            previous_e = previous_e_2
          }
          
          if( is_still_alive && isNaN( previous_e.data('timelife') ) ) {
            e.data['timelife'] = 1
          }
          else {
            e.data['timelife'] = is_still_alive? previous_e.data('timelife') + 1 : 0
          }
      }

      cy.current.json({elements:a})
      ly.current = cy.current.layout(layout_map[graph_layout])
      ly.current.run()
        
      update_selected_node(selected_node.id , selected_node_values_oder)
      
  }, 10000)



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

  

  const cola_layout = {
    name: 'cola',
    infinite: true,
    randomize: false,
    fit: false,
    padding: 30,
    avoidOverlap: false,
    animate:true,
    centerGraph: true,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return 10000*(edge.data("value")**0.5)},
    stop: async function(){} , 
     
    maxSimulationTime: 150000, 
    convergenceThreshold:0.002,
    refresh:1
  }






  const layout_map = {
    'cola_layout' : cola_layout,
    
  } 


  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>
    


      <div className={styles.cyContainer}>
        <div id="cy" className={styles.cyDiv}>

          <div className={styles.dropdown}>

          <h2> { currentDate } </h2>


            { !sideBarIsHidden && <FaExpandArrowsAlt onClick={ () => {
                    document.getElementsByClassName(styles.wrapper)[0].style['display'] = "none"
                    document.getElementsByClassName(styles.cyContainer)[0].style['width'] = "100%"
                    setSideBarIsHidden(true) }}/> }
            { sideBarIsHidden && <FaCompressArrowsAlt onClick={ () => {
                    document.getElementsByClassName(styles.wrapper)[0].style['display'] = "unset"
                    document.getElementsByClassName(styles.cyContainer)[0].style['width'] = "70%"
                    setSideBarIsHidden(false) }}/> }
                
          </div>

          { /*
          <div className={styles.legend}>
            {Object.keys(map_sector_to_color).map( (el , idx) => {
            return <div key={idx} className={styles.lgditm}>
                <div className={styles.color} style={{backgroundColor:sector_opacity_to_rgba(el , 1.0)}}></div> 
                {el}
              </div> })}
          </div>
            */}

        </div>
      </div>







      <div className={styles.wrapper} style={{backgroundColor: sector_opacity_to_rgba(selected_node.sector , .3),}}>
        <div className={styles.content} >

          {selected_node.label !== "SELECT A NODE" ?<>

            <div className={styles.cntInfo}>

              <h1 >Asset: </h1>
              <h1 > {selected_node.label}</h1>

            </div>
            

            <div className={styles.scrollable}>
            <div className={styles.ctnInfo2} style={{backgroundColor: rgb_opacity_to_rgba( [255,255,255] , 0.4)}}>
              <div className={styles.content2} >
                <h3>Values per asset</h3>
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


            </div>
            
            </> : 
            <>

            <h1>Real-time cryptocurencies correlations</h1>
            
            <p>Click on a node for more information of their correlations alongside interaction networks.</p>

            

            </>
          }
          

        </div>
      </div>
    </div>
  )
}
