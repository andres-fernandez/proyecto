import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderHabitantes_por_biblioteca(biblio_data, habs_y_biblio_data, argentina_data, islas_malvinas_data, provincias_data, departamentos_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Habitantes por biblioteca populares en Argentina  ////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

  const habitantes_container = d3.select('#dataviz_habitantes');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG setup ////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Pattern: hatches /////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Estas líneas son para generar el patrón que se usará en los departamentos sin bibliotecas
  // La meta es generar este patrón: 
  // <pattern id="hatches" patternUnits="userSpaceOnUse" width="3" height="10" patternTransform="rotate(45)"><rect x="0" y="0" width="2" height="10" fill="#ffff9e"></rect><rect x="2" y="0" width="1" height="10" fill="#e4ba3a"></rect></pattern>

  const pattern = defs.append('pattern')
    .attr('id', 'hatches-2')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '3')
    .attr('height', '10')
    .attr('patternTransform', 'rotate(45)');

  const pattern_inner = pattern.selectAll('rect')
    // .data( [{ color: '#fd884b', x: 0, w: 2 }, { color: '#a94203', x: 2, w: 1 }] )
    .data( [{ color: '#fff', x: 0, w: 2 }, { color: '#cdcdcd', x: 2, w: 1 }] )
    .join('rect')
    .attr('x', d => d.x)
    .attr('y', 0)
    .attr('width', d => d.w)
    .attr('height', 10)
    .attr('fill', d => d.color)
    
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render mapas ///////////////////////////////////////////////////////////////// 
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    
  // Departamentos ///////////////////////////////////////////////////////////////////
  
  let colorScale;
   colorScale = d3.scaleLinear().domain([1000,8341,17386,28932,42340,57860,81553,102421,132087,171000]).range(['#40b8bf', '#c9e1d5', '#fef4ad', '#fcd382', '#fbb361', '#fc9551', '#f77a47', '#d06b50', '#aa6059', '#865f5e', '#626063']);
  // colorScale = d3.scaleLinear().domain([1000,8341,17386,28932,42340,57860,81553,102421,132087,171000]).range(['#568a7e', '#679381', '#9eb286', '#d7c987', '#efc27e', '#eea770', '#e48764', '#d56859', '#ba5851', '#944946']);

  dptos.attr('fill', 'none')
    .selectAll('path')
    .data(habs_y_biblio_data.features)
    .join('path')
    .attr('d', geoPathGenerator)
    .attr('data-name', d => d.properties.fna)
    .attr('data-bibliotecas', d => d.properties.libraries_in_dpto)
    .attr('data-habitantes-por-biblioteca', d => d.properties.hab_x_biblio)
    .attr('fill', d => {
      // console.log(d.properties)
      const habs = d.properties.hab_x_biblio;
      const filling_colour = !habs ? 'url(#hatches-2)' : colorScale(habs);
      return filling_colour;
    })
    .attr('stroke', '#000')
    .attr('stroke-width', .1);

    ///////////////////////////////////////////////////////////////////

    renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
    renderArgentina(argentina, argentina_data);
    renderProvincias(provincias, provincias_data);
    
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Un dot para cada biblioteca en Argentina /////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    libraries_as_dot.attr('stroke-width', 0)
      .attr('fill', '#222')
      .selectAll('circle')
      .data(biblio_data)
      .join('circle')
      // .attr('establecimiento', d => d.fna)
      .attr('cx', d => projection([d.long, d.lat])[0].toFixed(2))
      .attr('cy', d => projection([d.long, d.lat])[1].toFixed(2))
      .attr('r', 0.75);
  
    }
