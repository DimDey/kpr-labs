import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useRef, useEffect } from "react";

const MARGIN = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
};

function Map({ launchpads = [], highlightedLaunchpadId = null }) {
    const width = 1000;
    const height = 600;
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const projectionRef = useRef(null);
    const gRef = useRef(null);

    useEffect(() => {
        // Инициализация карты
        if (!containerRef.current) return;
        
        const svg = d3.select(containerRef.current).select("svg");
        
        if (svg.empty()) {
            // Создаем SVG только если его нет
            const newSvg = d3.select(containerRef.current)
                .append("svg")
                .attr("width", width + MARGIN.left + MARGIN.right)
                .attr("height", height + MARGIN.top + MARGIN.bottom);
            
            const g = newSvg.append("g")
                .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
            
            const projection = d3.geoMercator()
                .scale(70)
                .center([0, 20])
                .translate([width / 2 - MARGIN.left, height / 2 - MARGIN.top]);
            
            // Рисуем карту мира
            g.selectAll("path.topo")
                .data(Geo.features)
                .enter()
                .append("path")
                .attr("class", "topo")
                .attr("d", d3.geoPath().projection(projection))
                .style("opacity", 0.7);
            
            // Настройка зума
            const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function (event) {
                    g.selectAll('path.topo')
                        .attr('transform', event.transform);
                    g.selectAll('circle.launchpad')
                        .attr('transform', event.transform);
                });
            
            newSvg.call(zoom);
            
            svgRef.current = newSvg;
            projectionRef.current = projection;
            gRef.current = g;
        } else {
            // Если SVG уже существует, получаем ссылки
            const g = svg.select("g");
            const projection = d3.geoMercator()
                .scale(70)
                .center([0, 20])
                .translate([width / 2 - MARGIN.left, height / 2 - MARGIN.top]);
            
            projectionRef.current = projection;
            gRef.current = g;
        }
    }, []);

    useEffect(() => {
        // Отрисовка launchpads
        if (!gRef.current || !projectionRef.current || launchpads.length === 0) {
            return;
        }

        const g = gRef.current;
        const projection = projectionRef.current;

        // Фильтруем launchpads с валидными координатами
        const validLaunchpads = launchpads.filter(pad => 
            pad.latitude !== null && 
            pad.longitude !== null && 
            !isNaN(pad.latitude) && 
            !isNaN(pad.longitude)
        );

        // Обновляем круги для launchpads
        const circles = g.selectAll("circle.launchpad")
            .data(validLaunchpads, d => d.id);

        // Удаляем старые круги
        circles.exit().remove();

        // Добавляем новые круги
        const circlesEnter = circles.enter()
            .append("circle")
            .attr("class", "launchpad")
            .attr("r", 5)
            .style("fill", "#ff6b6b")
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .style("opacity", 0.7)
            .style("cursor", "pointer");

        // Обновляем позиции и стили для всех кругов
        circlesEnter.merge(circles)
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .style("fill", d => d.id === highlightedLaunchpadId ? "#ff0000" : "#ff6b6b")
            .style("opacity", d => d.id === highlightedLaunchpadId ? 1 : 0.7)
            .attr("r", d => d.id === highlightedLaunchpadId ? 8 : 5)
            .style("stroke-width", d => d.id === highlightedLaunchpadId ? 3 : 2);

    }, [launchpads, highlightedLaunchpadId]);

    return (
        <div className="mapContainer map" ref={containerRef}>
        </div>
    )
}

export { Map }
