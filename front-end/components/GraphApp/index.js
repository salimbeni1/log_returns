import cytoscape from 'cytoscape';
import d3Force from 'cytoscape-d3-force';
import cola from 'cytoscape-cola';


import styles from './GraphApp.module.scss'
import {useCallback, useLayoutEffect , useRef , useState} from 'react'
import { FaAngleRight,FaStopwatch ,  FaExpandArrowsAlt, FaCompressArrowsAlt , FaRegCalendarAlt , FaAngleLeft, FaAngleDoubleRight, FaAngleDoubleLeft, FaPlay , FaStop , FaHubspot, FaTree, FaTablets, FaFirstOrderAlt , FaSortAmountUp ,FaSortAmountDownAlt , FaIndustry, FaList} from 'react-icons/fa';
import { BiReset } from 'react-icons/bi';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';

import DensityPlot from '../DensityPlot';
import SectorPlot from '../SectorPlot';
import useInterval from '../../utils/useInterval';
import handler from '../../pages/api/ftx'


cytoscape.use( d3Force );
cytoscape.use( cola );

export default function GraphApp( props ) {

  const graph_layout = props.layout
  const data_type = props.data_type

  const cy = useRef(null)
  const ly = useRef(null)

  const [ctn_arr, setCtn_arr] = useState(0)

  const [playButton, setPlayButton] = useState(true)
  const myInterval = useRef(null)

  const [delay, setDelay] = useState(1)
  const [update, setUpdate] = useState(false) 

  const [sideBarIsHidden, setSideBarIsHidden] = useState(false)

  const [arr_elements, setArr_elements] = useState(props.json_data['all'])

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
  const YEAR_INTERVAL = 260

  const update_new_slider_pos = (step) =>{
    
    switch (step) {

      case "m_DAY": 
        setCtn_arr(parseInt(ctn_arr - DAY_INTERVAL))
        break
      case "p_DAY": 
        setCtn_arr(parseInt(ctn_arr + DAY_INTERVAL))
        break

      case "m_WEEK":
        setCtn_arr(parseInt(ctn_arr - WEEK_INTERVAL))
        break
      case "p_WEEK":
          setCtn_arr(parseInt(ctn_arr + WEEK_INTERVAL))
          break

      case "m_MONTH":
        setCtn_arr(parseInt(ctn_arr - MONTH_INTERVAL))
        break
      case "p_MONTH":
        setCtn_arr(parseInt(ctn_arr + MONTH_INTERVAL))
        break

      case "m_YEAR":
        setCtn_arr(parseInt(ctn_arr - YEAR_INTERVAL))
        break
      case "p_YEAR":
          setCtn_arr(parseInt(ctn_arr + YEAR_INTERVAL))
          break

      default :
        setCtn_arr(parseInt(ctn_arr))
    }



    const a = arr_elements[ ctn_arr % arr_elements.length]
    cy.current.json({elements:a})
    ly.current = cy.current.layout(layout_map[graph_layout])
    ly.current.run()
      
    update_selected_node(selected_node.id , selected_node_values_oder)

  }

  const getDateForm = () => {
    return <>
    
    <div className={styles.flex}>
      <h4> DATES </h4>
      <BiReset onClick={ () => {
        props.change_layout(graph_layout)
        props.reload_data(data_type)
      }}/>
    </div>
    

    <div className={styles.grid}>
      <h5 > DAY</h5>
      <FaAngleLeft onClick={ () => update_new_slider_pos("m_DAY")}/>
      <FaAngleRight onClick={ () => update_new_slider_pos("p_DAY")}/>
      
      <h5> WEEK </h5> 
      <FaAngleLeft onClick={ () => update_new_slider_pos("m_WEEK")}/>
      <FaAngleRight onClick={ () => update_new_slider_pos("p_WEEK")}/>

      <h5> MONTH </h5>
      <FaAngleDoubleLeft onClick={ () => update_new_slider_pos("m_MONTH")}/>
      <FaAngleDoubleRight  onClick={ () => update_new_slider_pos("p_MONTH")}/>

      <h5 > YEAR </h5>
      <FaAngleDoubleLeft onClick={ () => update_new_slider_pos("m_YEAR")}/>
      <FaAngleDoubleRight onClick={ () => update_new_slider_pos("p_YEAR")}/>
    </div>

    </>
  }

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
      industry:  clicked_node.data("industry"),
      fullTimeEmp:  clicked_node.data("fullTimeEmp"),
      
      edges: oder_selected_node_values(
        clicked_node.connectedEdges().map( map_values_id(clicked_node) ),
        oder
        )
    })




  }

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
    handler()

    const elements= arr_elements[ctn_arr]

    
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
            'width' : '2000px',
            'height' : '2000px',
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
            'width' : '4000px',
            'height' : '4000px',
            "font-weight" : "800",
            "font-size" : "1200px",
          }
        },
        {
          selector: ".hover",
          css: {
            'width' : '4600px',
            'height' : '4600px',
            "font-weight" : "800",
            "font-size" : "1200px"
          }
        }
        
      ],
      layout: layout_map[graph_layout],
      
      zoom: 0.005,
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

        
        const prev_a = arr_elements[ (ctn_arr-1) % arr_elements.length ]
        const a = arr_elements[ ctn_arr % arr_elements.length ]

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
        setCtn_arr( x => x +1 )
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

    clean_dropdown(event, document.getElementsByClassName(styles.dropdown)[0],styles.layouts)
    clean_dropdown(event, document.getElementsByClassName(styles.dropdown)[1],styles.orderBar)
    clean_dropdown(event, document.getElementsByClassName(styles.dateForm)[0] ,styles.dateform_window) 

  }
  

  const cola_layout = {
    name: 'cola',
    infinite: false,
    randomize: false,
    fit: false,
    padding: 30,
    avoidOverlap: false,
    animate:true,
    centerGraph: true,
    nodeSpacing: function( node ){ return 1; }, // space around node
    edgeLength:  function( edge ){ return 4000./edge.data("value")},
    stop: function(){
      setUpdate(true)
    } , 
     
    maxSimulationTime: 50000, 
    convergenceThreshold:1000,
    refresh:1
  }

  
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const concentric_layout = {
    name: 'concentric',
    fit: false,
    clockwise: true,
    minNodeSpacing: 3,
    centerGraph: false,
    spacingFactor: 2,
    animate:true,

    concentric: function( node ){
      return node.degree()
    },
    levelWidth: function( nodes ){
      return nodes.maxDegree() / 8; // TODO change with FCT data
    },
    stop: async function(){
      await sleep(1500)
      setUpdate(true)
    } ,
  }

  const layout_map = {
    'cola_layout' : cola_layout,
    'concentric_layout' : concentric_layout 
  } 


  return (
    <div style={{width:"100%",height:"100%" , display:'flex'}}>
    


      <div className={styles.cyContainer}>
        <div id="cy" className={styles.cyDiv}>

          <div className={styles.dropdown}>

            <h2> 16/07/1998</h2>

            <FaList onClick={() => {
                for ( const e of document.getElementsByClassName(styles.layouts) ) { e.style['display'] = "block" }
              }}/>

            { !sideBarIsHidden && <FaExpandArrowsAlt onClick={ () => {
                    document.getElementsByClassName(styles.wrapper)[0].style['display'] = "none"
                    document.getElementsByClassName(styles.cyContainer)[0].style['width'] = "100%"
                    setSideBarIsHidden(true) }}/> }
            { sideBarIsHidden && <FaCompressArrowsAlt onClick={ () => {
                    document.getElementsByClassName(styles.wrapper)[0].style['display'] = "unset"
                    document.getElementsByClassName(styles.cyContainer)[0].style['width'] = "70%"
                    setSideBarIsHidden(false) }}/> }
                
            
      
            <div className={styles.layouts}>
              <h4> LAYOUT </h4>
              <div className={styles.btn} onClick={ () => {
                props.change_layout('cola_layout')
                props.reload_data("MST_123")
              }}>
                <FaHubspot/>
                  <p>COLA</p>
              </div>
              
              <div className={styles.btn} onClick={ () => { {
                props.change_layout('concentric_layout')    
                props.reload_data("FCT_0p7")
              } }}>
                <FaFirstOrderAlt/>
                  <p>CONCENTRIC</p>
              </div>
              
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

          <div className={styles.dateForm}>
            <FaStopwatch onClick={() => { 
              for ( const e of document.getElementsByClassName(styles.dateform_window) ) { e.style['display'] = "grid" }
              }} />
            <div className={styles.dateform_window}>
              {getDateForm()}
            </div>
          </div>

          {playButton ? 
          <FaPlay onClick={ e => setPlayButton(false)}/>:
          <FaStop onClick={ e => setPlayButton(true)}/>
          }

          <div className={styles.bar} >
            <input type="range" min="0" max={arr_elements.length} value={ctn_arr % arr_elements.length} step="1" className={styles.slider}/>
            <div className={styles.date} style={{left:"0%"}} >2007</div>
            
            <div className={styles.dateCriseMarker} style={{left:"9%"}} >
              <div className={styles.dateCrise1}  >Financial Crisis</div>
            </div>
            <div className={styles.date} style={{left:"45%"}}>2015</div>
            
            <div className={styles.dateCriseMarker} style={{left:"84%"}} >
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
            <div className={styles.cntInfo2}>
              <div className={styles.cntInfo}>
                <p>Sector </p>
                <p>{selected_node.sector} </p>
              </div>
              <div className={styles.cntInfo}>
                <p>Industry </p>
                <p>{selected_node.industry} </p>
              </div>
              <div className={styles.cntInfo}>
                <p>Full Time Employees </p>
                <p>{selected_node.fullTimeEmp} </p>
              </div>
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

            <div className={styles.ctnInfo2} style={{backgroundColor: rgb_opacity_to_rgba( [255,255,255] , 0.4)}}>
              <div className={styles.content2}>

                <h3>Values distribution</h3>
                <DensityPlot 
                  data={selected_node.edges.map(e => e.value)}
                  dataGlobal={cy.current.edges("[value]").map(e => e.data("value"))}
                  color={sector_opacity_to_rgba(selected_node.sector , 0.8)}
                />
              </div>
            </div>

            <div className={styles.ctnInfo2} style={{backgroundColor: rgb_opacity_to_rgba( [255,255,255] , 0.4)}}>
              <div className={styles.content2}>

                <h3>Sector distribution</h3>
                <SectorPlot 
                  data={cy.current.$('#'+selected_node.id).neighborhood().nodes("[sector]").map(e => e.data("sector"))}
                  map_sect_col={map_sector_to_color}
                  
                />
              </div>
            </div>

            </div>
            
            </> : 
            <>

            <h1>Clustering Financial Time Series</h1>
            
            <p>Click on a node for more information of their correlations alongside interaction networks.</p>

            {graph_layout === 'concentric_layout' && 
              <>
              <div className={styles.layout_info} >
             
              <h4> CONCENTRIC LAYOUT </h4>

              <div className={styles.scroll_zone}>
              <p> The concentric layout graph model assigns each node to a circular level around the centre according to its degree. High-degree nodes are positioned in the middle, while low degree nodes are positioned in the outer circles. Namely, the number of edges attached to a node determines where the node is positioned.  </p>
              <h4> INSIGHT </h4>
              <p> When loading data for a given time window, all edges with low correlation are discarded, 
                the threshold with which these edges are discarded can be selected here-under in terms of 
                maximum distance (high correlation implies low distance). Thus in the periods where the stock 
                market is generally highly correlated, all nodes tend to concentrate in the inner circles.
                In contrast, when the market is generally less correlated, nodes are mainly positioned 
                in the outer circles of the concentric layout.  </p>
                <h4> ADJUST DISTANCE PARAMETER </h4>
                <button onClick={ () => {
                      props.change_layout('concentric_layout')    
                      props.reload_data("FCT_0p5") 
                    }}>
                    0.5
                </button>
                <button onClick={ () => {
                      props.change_layout('concentric_layout')    
                      props.reload_data("FCT_0p6") 
                    }}>
                    0.6
                </button>
                <button onClick={ () => {
                      props.change_layout('concentric_layout')    
                      props.reload_data("FCT_0p7") 
                    }}>
                    0.7
                </button>
                <button onClick={ () => {
                      props.change_layout('concentric_layout')    
                      props.reload_data("FCT_0p8")
                    }}>
                    0.8
                </button>
                <button onClick={ () => {
                      props.change_layout('concentric_layout')    
                      props.reload_data("FCT_0p9")
                    }}>
                    0.9
                </button>
                </div>
              </div>
              </>}

              {graph_layout === 'cola_layout' && 
              <div className={styles.layout_info} >
              
                <h2> MST Layout </h2>

                <div className={styles.scroll_zone}>
                <p> Compute the minimum MST with log return values , render in a physic based animation. </p>
                <p> the more the graph is dense the more the assets are correlated , ex during a crisis. </p>
                
                <p> You can change the edge value rounding (number of bins) for create the mst.</p>
                
                <div className={styles.options_1} >
                   <h3>options : </h3>
                   
                   <button onClick={ () => {
                          props.change_layout('cola_layout')
                          props.reload_data("MST_123")
                        }}>
                        standard
                    </button>

                    <button onClick={ () => {
                          props.change_layout('cola_layout')
                          props.reload_data("MST_p1")
                        }}>
                        5
                    </button>
                    
                    <button onClick={ () => {
                            props.change_layout('cola_layout')
                            props.reload_data("MST_p2")
                          }}>
                          10
                    </button>

                    <button onClick={ () => {
                            props.change_layout('cola_layout')
                            props.reload_data("MST_p3")
                          }}>
                          15
                    </button>
                
                </div>
               

                
                

                </div>
               
              </div>}


            </>
          }
          

        </div>
      </div>
    </div>
  )
}

const propTypes = {
  layout: String,
  data_type: String,
  json_data: { },
  reload_data: Function,
  change_layout: Function
}; 

GraphApp.propTypes = propTypes;

GraphApp.defaultProps = {
  layout: 'cola_layout',
  json_data: { "all" : { } },
  data_type: 'MST',
  reload_data: () => console.log("NOT IMPLEMENTED: assign props to GraphApp"),
  change_layout: () => console.log("NOT IMPLEMENTED: assign props to GraphApp")
};
