import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderBibliotecas_x_dpto_II(habs_y_biblio, argentina_data, islas_malvinas_data, provincias_data, departamentos_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas por departamento II //////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const dptos_container = d3.select('#dataviz_departamentos_ii');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG setup ////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const svg = dptos_container.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('title', 'Bibliotecas populares por departamento en Argentina');
  
  const              defs = svg.append('defs');
  const             frame = svg.append('g').attr('id', 'frame');
  const             dptos = svg.append('g').attr('id', 'departamentos');
  const        provincias = svg.append('g').attr('id', 'limites-provinciales');
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         graticula = svg.append('g').attr('id', 'graticula');
  const  libraries_as_dot = svg.append('g').attr('id', 'bibliotecas');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');

 
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Force simulartion  ///////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // const colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#ffd353', '#ffc349', '#ffb242', '#f89c3b', '#ef8737', '#e86c33', '#de4f33', '#cd3d30', '#bb292c', '#b02743', '#9f2d55', '#83235c', '#62205f', '#4a1b54', '#341648']);
  const colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#944946', '#ad534d', '#c35d53', '#d36758', '#df775f', '#e68e66', '#eca36e', '#f2b677', '#efc580', '#e3cd87', '#bfc188', '#9ab086', '#739a82', '#619080', '#568a7e']);

    // Force simulation
    const simulation = d3.forceSimulation(habs_y_biblio.features)
    // .alphaTarget(0.01)                                                                               // stay hot
    // .velocityDecay(0.35)                                                                             // low friction
    .force('x', d3.forceX().strength(0.15).x(d =>  geoPathGenerator.centroid(d)[0] ))
    .force('y', d3.forceY().y(d => geoPathGenerator.centroid(d)[1]))
    .force('charge', d3.forceManyBody().strength(0.5))
    .force('collide', d3.forceCollide()
      .radius(d => Math.sqrt(d.properties.libraries_in_dpto) * 2.5 )
      .iterations(2))
    .stop();                                                                                            // This line stops the movement of the dots

/* ------------------------------------------------------------------------------------------------
//Use this setting to render the animation of the dots in the force layout

simulation
  .nodes(data_depurated)                                  // This defines the data where the simulation will be apply. It could be omitted if you pass the data early in 'd3.forceSimulation(data_depurated)'
  .on('tick', function(d) {                               // On each 'tick' [by default, 300 times], reset the 'cx' and 'cy' of every dot. This is what produce the movement of the dots
    dots.attr('cx', d => d.x).attr('cy', d => d.y);
  });
------------------------------------------------------------------------------------------------ */

  simulation.tick(250);        // Set the number of times the position is calculated. Default number es 300. Since you do not pass a callback function that apply the new 'cx' and 'cy'
                             //  to every dot on each simulation tick, the movement of the dots is not rendered, only the final state is visualized

  // Departamentos ///////////////////////////////////////////////////////////////////

    dptos.attr('fill', 'none')
      .selectAll('path')
      .data(habs_y_biblio.features)
      .join('path')
      .attr('d', geoPathGenerator)
      .attr('data-name', d => d.properties.fna)
      .attr('data-libraries-in-depto', d => d.properties.libraries_in_dpto)
      .attr('fill','none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.1);

    dptos.append('g')
      .attr('data-element', 'departamentos-centroid')
      .selectAll('circle')
      .data(habs_y_biblio.features)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => Math.sqrt(d.properties.libraries_in_dpto) * 2.35)
      .attr('fill', d => colorScale(d.properties.libraries_in_dpto))
      .attr('stroke', 'none')
      .attr('data-departamento', d => d.properties.fna)
      .attr('data-libraries-in-depto', d => d.properties.libraries_in_dpto);
  
  
    renderArgentina(argentina, argentina_data);
    renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
  
}