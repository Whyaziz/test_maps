import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const MapChart = () => {
    const mapContainerRef = useRef();
    let selectedState; // Variable to store the selected state

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

        const svg = d3
            .create("svg")
            .attr("viewBox", [-100, -100, width, height])
            .attr("style", "transform: scaleY(-1);")
            .on("click", reset);

        const path = d3.geoPath();

        const g = svg.append("g");

        const loadAndRenderMap = async () => {
            try {
                const us = await d3.json("/indonesia.json");

                const b = path.bounds(
                    topojson.feature(us, us.objects.states_provinces)
                );
                const s =
                    0.95 /
                    Math.max(
                        (b[1][0] - b[0][0]) / width,
                        (b[1][1] - b[0][1]) / height
                    );
                const t = [
                    (width - s * (b[1][0] + b[0][0])) / 2,
                    (height - s * (b[1][1] + b[0][1])) / 2,
                ];

                const states = g
                    .append("g")
                    .attr("fill", "#444")
                    .attr("cursor", "pointer")
                    .selectAll("path")
                    .data(
                        topojson.feature(us, us.objects.states_provinces)
                            .features
                    )
                    .join("path")
                    .on("click", clicked)
                    .attr("d", path);

                states.append("title").text((d) => d.properties.name);

                g.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-linejoin", "round")
                    .attr(
                        "d",
                        path(
                            topojson.mesh(
                                us,
                                us.objects.states_provinces,
                                (a, b) => a !== b
                            )
                        )
                    );

                svg.call(
                    zoom.transform,
                    d3.zoomIdentity.translate(t[0], t[1]).scale(s)
                );
            } catch (error) {
                console.error("Error loading or parsing JSON:", error);
            }
        };

        async function reset() {
            const us = await d3.json("/indonesia.json");

            const b = path.bounds(
                topojson.feature(us, us.objects.states_provinces)
            );
            const s =
                0.95 /
                Math.max(
                    (b[1][0] - b[0][0]) / width,
                    (b[1][1] - b[0][1]) / height
                );
            const t = [
                (width - s * (b[1][0] + b[0][0])) / 2,
                (height - s * (b[1][1] + b[0][1])) / 2,
            ];

            const states = g
                .append("g")
                .attr("fill", "#444")
                .attr("cursor", "pointer")
                .selectAll("path")
                .data(
                    topojson.feature(us, us.objects.states_provinces).features
                )
                .join("path")
                .on("click", clicked)
                .attr("d", path);

            states.append("title").text((d) => d.properties.name);

            g.append("path")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-linejoin", "round")
                .attr(
                    "d",
                    path(
                        topojson.mesh(
                            us,
                            us.objects.states_provinces,
                            (a, b) => a !== b
                        )
                    )
                );

            svg.transition()
                .duration(750) // duration of the transition in milliseconds
                .call(
                    zoom.transform,
                    d3.zoomIdentity.translate(t[0], t[1]).scale(s),
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

            const dx = x1 - x0;
            const dy = y1 - y0;
            const x = (x0 + x1) / 2;
            const y = (y0 + y1) / 2;
            const scale = 0.78 / Math.max(dx / width, dy / height);
            const translate = [width / 2 - scale * x, height / 2 - scale * y];

            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(translate[0], translate[1])
                        .scale(scale)
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
