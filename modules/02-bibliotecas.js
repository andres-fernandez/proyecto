import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderBibliotecas(bibliotecas_data, argentina_data, islas_malvinas_data, provincias_data, departamentos_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas populares en Argentina  //////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

  const bibliotecas = d3.select('#dataviz_bibliotecas');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Heatmap canvas setup /////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // simpleheat.js » https://gist.github.com/patricksurry/803a131d4c34fde54b9fbb074341daa5
  //               » https://github.com/mourner/simpleheat
    
  const canvasLayer = bibliotecas.append('canvas').attr('id', 'heatmap').attr('width', width).attr('height', height);
  const      canvas = canvasLayer.node();
  const     context = canvas.getContext("2d");
  const        heat = simpleheat(canvas);         // Create a 'simpleheat' object given an id or canvas reference


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG setup ////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const svg = bibliotecas.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('title', 'Bibliotecas populares en Argentina');
  
  const              defs = svg.append('defs');
  const             frame = svg.append('g').attr('id', 'frame');
  const     departamentos = svg.append('g').attr('id', 'departamentos');
  const        provincias = svg.append('g').attr('id', 'limites-provinciales');
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         graticula = svg.append('g').attr('id', 'graticula');
  const            coords = svg.append('g').attr('id', 'coordenadas');
  const  public_libraries = svg.append('g').attr('id', 'public-libraries');
  const            extras = svg.append('g').attr('id', 'extras');
  const    voronoi_triang = svg.append('g').attr('id', 'voronoi-triangulation');
  const   delaunay_triang = svg.append('g').attr('id', 'delaunay-triangulation');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  // frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Mask for voronid / delauny
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // d3.json('./data/argentina_sanitized.json').then(function (mapa) {
  //   defs.append('mask')
  //     .attr('id', 'mask-ar')
  //     .selectAll('path')
  //     .data(mapa.features)
  //     .join('path')
  //     .attr('d', geoPathGenerator)
  //     .attr('fill', '#fff')
  //     .attr('stroke', 'none')
  // });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Argentina + provincias + departamentos ///////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  renderArgentina(argentina, argentina_data);
  renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
  renderProvincias(provincias, provincias_data);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Un dot para cada biblioteca popular en Argentina /////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
    public_libraries.attr('stroke', '#222')
      .attr('stroke-width', 0)
      .attr('fill', '#fff')
      .selectAll('circle')
      .data(bibliotecas_data)
      .join('circle')
      .attr('library', d => d.biblioteca)
      .attr('cx', d => projection([d.long, d.lat])[0].toFixed(2))
      .attr('cy', d => projection([d.long, d.lat])[1].toFixed(2))
      .attr('r', .75);
  
    heat.data(bibliotecas_data.map(d => {                                        // Set data of [[x, y, value], ...] format
      const x = projection([d.long, d.lat])[0].toFixed(2);
      const y = projection([d.long, d.lat])[1].toFixed(2);
      const value = 1;     
      return [x, y, value];
    }));      
        
    // heat.max()                                                    // Set max data value (1 by default). El valor pasado como argumento es el que se tomará como referencia para aplicar opacidad al 100%
                                                                     // Si no se define, toma 1 como valor por defecto, pero todos los valores superiores a ese número serán renderizados con total opacidad
                                                                     // Por eso es fundamental definir el máximo valor. Todos los valores restantes tendrán una opacidad proporconal.   
    // heat.max(22000);                                              
    // heat.max(data, d => +d.nro_registro);                                                                                       
              
    heat.radius(4, 6);                                                                                          // Set point radius and blur radius [25 and 15 by default]
  
    // heat.gradient(grad)                                                                                        // Set gradient colors as {<stop>: '<color>'}, e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    // heat.gradient({   0: '#132f8a', 0.3: '#5a56c8', 0.6: '#fc7ead', 1: '#ffca3e'});                          
    // heat.gradient({0.4: '#0000ff', 0.6: '#00ffff', 0.7: '#00ff00', 0.8: '#ffff00', 1.0: '#ff0000'});           // Defautl gradiente
    // heat.gradient({ 0.4: '#042e33', 0.6: '#05704e', 0.7: '#8cb130', 0.8: '#f5ce12', 1: '#efefcd'});  
    heat.gradient({ 0.2: '#341648', 0.4: '#62205f', 0.5: '#9f2d55', 0.6: '#bb292c', 0.7: '#de4f33', 0.8: '#ef8737', 0.9: '#ffb242', 1: '#ffd353' });      
        
    heat.draw(0.05);                                                  // Draw the heatmap with optional minimum point opacity (0.05 by default)
    heat.resize();                                                    // Call in case 'canvas' size changed
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Crear una estructura de voronoid /////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // d3.csv('./data/bibliotecas.csv').then(data => {
  
  //   const scaleColor = d3.scaleSequential().domain([0, 74]).interpolator(d3.interpolateRainbow);
  
  //   // const points = data.map(d => {
  //   //   const x = parseFloat(projection([d.long, d.lat])[0].toFixed(2));
  //   //   const y = parseFloat(projection([d.long, d.lat])[1].toFixed(2));
  //   //   return [x,y];
  //   // });
      
  //   const points = data.map(d => {
  //     const x = parseFloat(projection([d.long, d.lat])[0].toFixed(2));
  //     const y = parseFloat(projection([d.long, d.lat])[1].toFixed(2));
  //     const value = d.biblioteca.length;
  //     return { x, y, value };
  //   });
  
  //   const delaunay = d3.Delaunay.from(points, d => d.x, d => d.y);
  //   const voronoi = delaunay.voronoi([0, 0, width, height]);
  
  // // Función para calcular área de un polígono (fórmula del área de Gauss)

  //   function polygonArea(polygon) {
  //     let area = 0;
  //     for (let i = 0, n = polygon.length; i < n; i++) {
  //       const [x0, y0] = polygon[i];
  //       const [x1, y1] = polygon[(i + 1) % n];
  //       area += (x0 * y1 - x1 * y0);
  //     }
  //     return Math.abs(area / 2);
  //   }
  
  // // // Render Voronoi cells ////////////////////////////////////////////////////////
  
  //   voronoi_triang.attr('mask', 'url(#mask-ar)')
  //     .attr('fill', 'none')
  //     .attr('stroke', '#fff')
  //     .attr('stroke-width', 0.15)
  //     .selectAll('path')
  //     .data(points)
  //     .join('path')
  //     .attr('value', d => d.value)
  //     // .attr('fill', (_, i) => {
  //     //   const polygon = voronoi.cellPolygon(i);
  //     //   const curr_area = polygon ? polygonArea(polygon) : 0;
  //     //   return scaleColor(curr_area);
  //     // })
  //     .attr('fill', d => scaleColor(d.value))
  //     .attr('fill-opacity', 0)
  //     .attr('d', (d, i) => voronoi.renderCell(i))
  //     .attr('data-area', (_, i) => {
  //       const polygon = voronoi.cellPolygon(i);                 // Devuelve un array de arrays, donde cada array interno corresponde a un vértice del polígono y tiene dos valores: las coordenadas x,y del vértice        
  //       return polygon ? polygonArea(polygon).toFixed(2) : 0;
  //     });
  
  //    // Render Delaunay triangles ///////////////////////////////////////////////////
  
  //    // delaunay_triang.attr('mask', 'url(#mask-ar)')
  //    //   .selectAll('path')
  //    //   .data(delaunay.trianglePolygons())
  //    //   .join('path')
  //    //   .attr('d', d => `M${d.join("L")}Z`)
  //    //   .attr('fill', 'none')
  //    //   .attr('stroke', '#fff')
  //    //   .attr('stroke-width', 0.25);
    // });
  
  /* //////////////////////////////////////////////////////////////////// */

};