import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderHabitantes_por_biblioteca_II(habs_y_biblio_data, argentina_data, islas_malvinas_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Habitantes por biblioteca en Argentina - II  /////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

  const habitantes_container = d3.select('#dataviz_habitantes_ii');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG setup //////////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const svg = habitantes_container.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('title', 'Habitantes por biblioteca popular por departamento en Argentina');
  
  const              defs = svg.append('defs');
  const             frame = svg.append('g').attr('id', 'frame');
  const             dptos = svg.append('g').attr('id', 'departamentos');
  const        provincias = svg.append('g').attr('id', 'limites-provinciales');
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         graticula = svg.append('g').attr('id', 'graticula');
  const  libraries_as_dot = svg.append('g').attr('id', 'bibliotecas');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  // Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG 
  frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Mapas //////////////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Departamentos /////////////////////////////////////////////////////////////////////
  
  let colorScale;
      // colorScale = d3.scaleLinear().domain([1000,8341,17386,28932,42340,57860,81553,102421,132087,171000]).range(['#568a7e', '#679381', '#9eb286', '#d7c987', '#efc27e', '#eea770', '#e48764', '#d56859', '#ba5851', '#944946']);
      colorScale = d3.scaleLinear().domain([1000,8341,17386,28932,42340,57860,81553,102421,132087,171000]).range(['#40b8bf', '#bbdadc', '#ffffbb', '#fde397', '#fbc874', '#fbae5c', '#fc9551', '#fd7c45', '#dd704d', '#bd6455', '#9e5e5b', '#805f5f', '#626063']);
    
  let radiusScale;
      // radiusScale = d3.scaleSqrt().domain([179800,430]).range([0.5,7]);
      radiusScale = d3.scaleLog().domain([179800,430]).range([0.35,8]);
  
  // Force simulation
  const simulation = d3.forceSimulation(habs_y_biblio_data.features)
   // .alphaTarget(0.01)                                                                               // stay hot
   // .velocityDecay(0.35)                                                                             // low friction
    .force('x', d3.forceX().strength(0.15).x(d =>  geoPathGenerator.centroid(d)[0] ))
    .force('y', d3.forceY().y(d => geoPathGenerator.centroid(d)[1]))
    .force('charge', d3.forceManyBody().strength(0.5))
    .force('collide', d3.forceCollide()
      .radius(d => radiusScale(d.properties.hab_x_biblio) + 0.1)
      .iterations(2))
    .stop();                                                                                            // This line stops the movement of the dots

  simulation.tick(250);        // Set the number of times the position is calculated. Default number es 300. Since you do not pass a callback function that apply the new 'cx' and 'cy'
                               //  to every dot on each simulation tick, the movement of the dots is not rendered, only the final state is visualized

  renderDepartamentos(dptos, habs_y_biblio_data);

    dptos.append('g')
      .attr('data-element', 'departamentos-centroid')
      .selectAll('circle')
      .data(habs_y_biblio_data.features)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => radiusScale(d.properties.hab_x_biblio))
      .attr('fill', d => colorScale(d.properties.hab_x_biblio))
      .attr('stroke', 'none')
      .attr('data-departamento', d => d.properties.fna)
      .attr('data-habitantes-por-biblioteca', d => d.properties.hab_x_biblio);
  
  // Argentina e Islas Malvinas  //////////////////////////////////////////////

  renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
  renderArgentina(argentina, argentina_data);
  
 ///////////////////////////////////////////////////////////////////////////////
    
}