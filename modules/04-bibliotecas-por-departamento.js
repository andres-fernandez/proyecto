import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderBibliotecas_x_dpto(habs_y_biblio, argentina_data, islas_malvinas_data, provincias_data, departamentos_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas populares en Argentina por departamento  /////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

  const dptos_container = d3.select('#dataviz_departamentos');

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
  const        provincias = svg.append('g').attr('id', 'limites-provinciales').attr('stroke', '#000').attr('stroke-width', 0.65);
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Pattern: hatches /////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Estas líneas son para generar el patrón que se usará en los departamentos sin bibliotecas
  // La meta es generar este patrón: 
  // <pattern id="hatches" patternUnits="userSpaceOnUse" width="3" height="10" patternTransform="rotate(45)"><rect x="0" y="0" width="2" height="10" fill="#ffff9e"></rect><rect x="2" y="0" width="1" height="10" fill="#e4ba3a"></rect></pattern>

  // const pattern_I = defs.append('pattern')
  //   .attr('id', 'hatches')
  //   .attr('patternUnits', 'userSpaceOnUse')
  //   .attr('width', '3')
  //   .attr('height', '10')
  //   .attr('patternTransform', 'rotate(45)');

  // const pattern_I_inner = pattern_I.selectAll('rect')
  //   .data( [{ color: '#ffff9e', x: 0, w: 2 }, { color: '#c8a21d', x: 2, w: 1 }] )
  //   .join('rect')
  //   .attr('x', d => d.x)
  //   .attr('y', 0)
  //   .attr('width', d => d.w)
  //   .attr('height', 10)
  //   .attr('fill', d => d.color)


  const pattern_II = defs.append('pattern')
    .attr('id', 'hatches')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '3')
    .attr('height', '10')
    .attr('patternTransform', 'rotate(45)');

  const pattern_II_inner = pattern_II.selectAll('rect')
    // .data( [{ color: '#fd884b', x: 0, w: 2 }, { color: '#a94203', x: 2, w: 1 }] )
    .data( [{ color: '#562b29', x: 0, w: 2 }, { color: '#944946', x: 2, w: 1 }] )
    .join('rect')
    .attr('x', d => d.x)
    .attr('y', 0)
    .attr('width', d => d.w)
    .attr('height', 10)
    .attr('fill', d => d.color)
    

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render maps //////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  let colorScale;
  // colorScale = d3.scaleLinear().domain([0,1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#353535','#feedb0','#fbd499','#f8bb82','#f4a270','#ef8a61','#e87156','#dd5853','#cf4456','#bc345c','#a62762','#8f1f63','#771b61','#5e1859','#45144c','#2f0f3e']);
  // colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#ffd353', '#ffc349', '#ffb242', '#f89c3b', '#ef8737', '#e86c33', '#de4f33', '#cd3d30', '#bb292c', '#b02743', '#9f2d55', '#83235c', '#62205f', '#4a1b54', '#341648']);
  colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#944946', '#ad534d', '#c35d53', '#d36758', '#df775f', '#e68e66', '#eca36e', '#f2b677', '#efc580', '#e3cd87', '#bfc188', '#9ab086', '#739a82', '#619080', '#568a7e']);

  dptos.attr('fill', 'none')
    .selectAll('path')
    .data(habs_y_biblio.features)
    .join('path')
    .attr('d', geoPathGenerator)
    .attr('data-name', d => d.properties.fna)
    .attr('data-libraries-in-depto', d => d.properties.libraries_in_dpto)
    .attr('fill', d => {
      const libs = d.properties.libraries_in_dpto;
      // const filling_colour = libs == 0 ? '#ffff9e' : colorScale(libs);
      const filling_colour = libs == 0 ? 'url(#hatches)' : colorScale(libs);
      return filling_colour;
    })
    .attr('stroke', '#000')
    .attr('stroke-width', .1);
  
  // Argentina + Islas Malvinas + Departamentos  //////////////////////////////
    
    renderArgentina(argentina, argentina_data);
    renderIslasMalvinas(islas_malvinas, islas_malvinas_data);      
    renderProvincias(provincias, provincias_data);

    d3.select('#dataviz_departamentos #argentina path').attr('stroke','#222');
    d3.selectAll('#dataviz_departamentos #limites-provinciales path').attr('stroke', null).attr('stroke-width', null);
  
  /////////////////////////////////////////////////////////////////////////////

  }