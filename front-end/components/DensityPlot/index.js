

import {useEffect, useRef , useState} from 'react'

import * as d3 from 'd3';


export default function DensityPlot (props) {

    function kernelDensityEstimator(kernel, X) {
        return function(V) {
          return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
          });
        };
      }
      
    function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
    }

    const ref = useRef()
    useEffect(() => {
    
        const svgElement = d3.select(ref.current)
        svgElement.selectAll("*").remove()

        const margin = {top: 0, right: 0, bottom: 0, left: 0}
        const width = 350 - margin.left - margin.right
        const height = 100 - margin.top - margin.bottom

        svgElement
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        
        var x = d3.scaleLinear()
            .domain([0.6, 1.5])
            .range([margin.left, width - margin.right]);
        
        var y = d3.scaleLinear()
            .domain([0, 25.0])
            .range([height - margin.bottom, margin.top]);
        
       
        const density = kernelDensityEstimator(kernelEpanechnikov(0.01), x.ticks(100))(
            props.data
        );
        
        svgElement.append("path")
            .datum(density)
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); }));


    }, [props])


    return (
      <svg
        ref={ref}
      />
    )

  }