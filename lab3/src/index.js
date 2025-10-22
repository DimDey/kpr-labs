import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)

async function setup() {
    const spaceX = new SpaceX();
    const { launches, launchpads } = await spaceX.getData();

    const listContainer = document.getElementById("listContainer");
    renderLaunches(launches, listContainer);
    drawMap(launchpads);

    // store launchpads globally for hover lookup
    window.launchpads = launchpads;
}

function renderLaunches(launches, container) {
    const list = document.createElement("ul");

    launches.forEach(launch => {
        const item = document.createElement("li");
        item.textContent = launch.name;

        // Hover behavior
        item.addEventListener("mouseenter", () => {
            highlightLaunchpad(launch.launchpad, true);
        });
        item.addEventListener("mouseleave", () => {
            highlightLaunchpad(launch.launchpad, false);
        });

        list.appendChild(item);
    });

    container.replaceChildren(list);
}

function highlightLaunchpad(launchpadId, active) {
    d3.selectAll(".launchpad-dot")
        .transition()
        .duration(150)
        .attr("r", d => d.id === launchpadId ? (active ? 8 : 4) : 4)
        .style("fill", d => d.id === launchpadId && active ? "yellow" : "red");
}

function drawMap(launchpads = []) {
    const width = 640;
    const height = 480;
    const margin = { top: 20, right: 10, bottom: 40, left: 100 };

    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2 - margin.left, height / 2]);

    svg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", "#cfd8dc")
        .style("stroke", "#999")
        .style("opacity", .7);

    svg.append("g")
        .selectAll("circle")
        .data(launchpads)
        .enter()
        .append("circle")
        .attr("class", d => `launchpad-dot id-${d.id}`)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 4)
        .style("fill", "red")
        .style("opacity", 0.8);
}