
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 // Bibliotecas populares en Argentina  //////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

document.addEventListener("DOMContentLoaded", function() {

  const start = performance.now();
  const width = 450;
  const height = 750;

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
  const        provincias = svg.append('g').attr('id', 'limites-provinciales');
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         graticula = svg.append('g').attr('id', 'graticula');
  const  libraries_as_dot = svg.append('g').attr('id', 'bibliotecas');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  // frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');


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
  // Projection ///////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // Esta es la mejor proyección de Argentina para uso infográfico. Genera el mismo resultado que la proyección [laea] usada en Mapshaper  
  
  const projection = d3.geoAzimuthalEqualArea()
    .scale(1200)
    .rotate([63.5, 0])
    .center([0, -38.5])
    .translate([(width / 2), (height / 2)])
    .precision(0.1);
  
  /* ----------------------------------------------------------- */
  
  const geoPathGenerator = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule()
    .step([3, 3])
    .extent([[-86, -18], [-40, -60]]);  // [ -86w, -18s ][ -40w, -57s ] - extent() especifica qué meridianos y paralelos serán renderizados por d3.js
  
  // Sirve para omitir trazar paralelos o meridianos que están fuera del viewport y no serán visualizados por el usuario
  // Sintaxis: extent[[meridiano de la izquierda, paralelo superior],[ meridiano de la derecha, paralelo inferior]]
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Gratícuola ///////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
   // var lines = graticula.selectAll('path')
   //  // .data([graticule()])                   // Esta línea produce el mismo resultado que la de abajo
   //  .data(graticule.lines())
   //  .join('path')
   //  .attr('d', geoPathGenerator)
   //  .attr('fill', 'none')
   //  .attr('stroke', '#fff')
   //  .attr('stroke-width', .1)
   //  .attr('id', function(d) {
   //      var c = d.coordinates;
   //      if (c[0][0] == c[1][0]) { return (c[0][0] < 0) ? -c[0][0] + "W" : +c[0][0] + "E"; }
   //      else if (c[0][1] == c[1][1]) { return (c[0][1] < 0) ? -c[0][1] + "S" : c[0][1] + "N"; }
   //  });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Argentina + provincias + departamentos ///////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Del archivo GeoJSON original de Argentina, se separó la parte continental de las Islas Malvinas, para poder estilizarlos por separado
  // El archivo con la parte continental tuvo que ser sanitizado para poder aplicarle un atributo de relleno. Eso se hizo en https://rewind.davidb.dev
  
  d3.json('./data/argentina_sanitized.json').then(function (mapa) {
    argentina.selectAll('path')
      .data(mapa.features)
      .join('path')
      .attr('d', geoPathGenerator)
      .attr('fill', d => 'none')
      .attr('stroke', '#353535')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', d => {
        // console.log(d3.geoBounds(mapa));                   // Returns the spherical bounding box for the specified GeoJSON object.
        // console.log('Centroid: ' + d3.geoCentroid(mapa));  // Returns the spherical centroid of the specified GeoJSON object
        return 1.25
      })
  });
  
  // Islas Malvinas ///////////////////////////////////////////////////////////////////
  
   d3.json('./data/islas_malvinas_sanitized.json').then(function (mapa) {
     islas_malvinas.attr('fill', 'none')
       .selectAll('path')
       .data(mapa.features)
       .join('path')
       .attr('d', geoPathGenerator)
       .attr('stroke', '#bbb')
       .attr('stroke-width', .25)
   });
  
  // Departamentos ///////////////////////////////////////////////////////////////////
  
  let colorScale;
  // colorScale = d3.scaleLinear().domain([0,1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#353535','#feedb0','#fbd499','#f8bb82','#f4a270','#ef8a61','#e87156','#dd5853','#cf4456','#bc345c','#a62762','#8f1f63','#771b61','#5e1859','#45144c','#2f0f3e']);
  // colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#ffd353', '#ffc349', '#ffb242', '#f89c3b', '#ef8737', '#e86c33', '#de4f33', '#cd3d30', '#bb292c', '#b02743', '#9f2d55', '#83235c', '#62205f', '#4a1b54', '#341648']);
  colorScale = d3.scaleLinear().domain([1,2,3,4,5,6,7,8,10,12,17,25,35,43]).range(['#944946', '#ad534d', '#c35d53', '#d36758', '#df775f', '#e68e66', '#eca36e', '#f2b677', '#efc580', '#e3cd87', '#bfc188', '#9ab086', '#739a82', '#619080', '#568a7e']);

  d3.json('./data/bibliotecas_por_departamentos_sanitized.json').then(function (mapa) {
    dptos.attr('fill', 'none')
      .selectAll('path')
      .data(mapa.features)
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
      .attr('stroke-width', .1)
  });
  
  // Provincias ///////////////////////////////////////////////////////////////////
      
  d3.json('./data/limites-provinciales.json').then(function (mapa) {
    provincias.attr('fill', 'none')
      .selectAll('path')
      .data(mapa.features)
      .join('path')
      .attr('d', geoPathGenerator)
      .attr('stroke', '#222')
      .attr('stroke-width', .5)
  });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Un dot para cada biblioteca en Argentina /////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // d3.csv('data/bibliotecas.csv').then(data => {
  //   libraries_as_dot.attr('stroke-width', 0)
  //     .attr('fill', '#fff')
  //     .selectAll('circle')
  //     .data(data)
  //     .join('circle')
  //     // .attr('establecimiento', d => d.fna)
  //     .attr('cx', d => projection([d.long, d.lat])[0].toFixed(2))
  //     .attr('cy', d => projection([d.long, d.lat])[1].toFixed(2))
  //     .attr('r', 0.85);
  // });
  
  
  
  /* //////////////////////////////////////////////////////////////////// */
  
  const end = performance.now();
  console.log('Establecimientos educativos en Argentina render in: ' + (end - start) + 'ms.');
  
  /* //////////////////////////////////////////////////////////////////// */

});