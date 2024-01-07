import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const MapChart = () => {
  const mapContainerRef = useRef();
  let selectedState;  // Variable to store the selected state

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    const svg = d3.create("svg")
      .attr("viewBox", [-100, -100, width, height])
      .attr("style", "transform: scaleY(-1);")
      .on("click", reset);

    const path = d3.geoPath();

    const g = svg.append("g");

    const loadAndRenderMap = async () => {
      try {
        const us = await d3.json('/indonesia.json');

        const states = g.append("g")
          .attr("fill", "#444")
          .attr("cursor", "pointer")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states_provinces).features)
          .join("path")
          .on("click", clicked)
          .attr("d", path);

        states.append("title")
          .text(d => d.properties.name);

        g.append("path")
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("d", path(topojson.mesh(us, us.objects.states_provinces, (a, b) => a !== b)));

        svg.call(zoom);
      } catch (error) {
        console.error('Error loading or parsing JSON:', error);
      }
    };

    function reset() {
      if (selectedState) {
        // Reset the selected state color
        selectedState.transition().style("fill", null);
        selectedState = null;
      }

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();

      if (selectedState) {
        // Reset the previously selected state color
        selectedState.transition().style("fill", null);
      }

      // Set the color of the clicked state to red
      selectedState = d3.select(this);
      selectedState.transition().style("fill", "red");

      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2.5, height / 2.5)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
    }

    function zoomed(event) {
      const { transform } = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    // Append the SVG to the DOM
    if (!mapContainerRef.current.querySelector("svg")) {
        mapContainerRef.current.appendChild(svg.node());
    }

    loadAndRenderMap();

    return () => {
      // Cleanup logic, if necessary
    };
  }, []); // No dependencies as fetch is synchronous
  

  return <div ref={mapContainerRef} />;
};

export default MapChart;