import { projection, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderEscuelas(escuelas_data, argentina_data, islas_malvinas_data, provincias_data, departamentos_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 // Bibliotecas populares en Argentina  //////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

  const escuelas = d3.select('#dataviz_escuelas');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Heatmap canvas setup /////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // simpleheat.js » https://gist.github.com/patricksurry/803a131d4c34fde54b9fbb074341daa5
  //               » https://github.com/mourner/simpleheat
    
  const canvasLayer = escuelas.append('canvas').attr('width', width).attr('height', height);
  const      canvas = canvasLayer.node();
  const     context = canvas.getContext('2d');
  const        heat = simpleheat(canvas);         // Create a 'simpleheat' object given an id or canvas reference

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG setup ////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const svg = escuelas.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('title', 'Establecimientos educativos en Argentina');
  
  const              defs = svg.append('defs');
  const             frame = svg.append('g').attr('id', 'frame');
  const     departamentos = svg.append('g').attr('id', 'departamentos');
  const        provincias = svg.append('g').attr('id', 'limites-provinciales');
  const    islas_malvinas = svg.append('g').attr('id', 'islas-malvinas');
  const         graticula = svg.append('g').attr('id', 'graticula');
  const            coords = svg.append('g').attr('id', 'coordenadas');
  const           schools = svg.append('g').attr('id', 'establecimientos-educativos');
  const            extras = svg.append('g').attr('id', 'extras');
  const         argentina = svg.append('g').attr('id', 'argentina');
  
  /* Habilitar la línea de abajo, sólo cuando se quiera descargar el SVG */
  // frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');

  renderArgentina(argentina, argentina_data);
  renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Un dot para cada establecimiento educativo en Argentina //////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
    schools.attr('stroke-width', 0)
      .attr('fill', '#fff')
      .selectAll('circle')
      .data(escuelas_data)
      .join('circle')
      // .attr('establecimiento', d => d.fna)
      .attr('cx', d => projection([d.long, d.lat])[0].toFixed(2))
      .attr('cy', d => projection([d.long, d.lat])[1].toFixed(2))
      .attr('r', 0.25);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Heatmap //////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
    heat.data(escuelas_data.map(d => {                                        // Set data of [[x, y, value], ...] format
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
              
    heat.radius(1, 4);                                                                                          // Set point radius and blur radius [25 and 15 by default]
  
    // heat.gradient(grad)                                                                                        // Set gradient colors as {<stop>: '<color>'}, e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    // heat.gradient({   0: '#132f8a', 0.3: '#5a56c8', 0.6: '#fc7ead', 1: '#ffca3e'});                          

    // heat.gradient({0.4: '#0000ff', 0.6: '#00ffff', 0.7: '#00ff00', 0.8: '#ffff00', 1.0: '#ff0000'});           // Defautl gradiente
    // heat.gradient({ 0.4: '#042e33', 0.6: '#05704e', 0.7: '#8cb130', 0.8: '#f5ce12', 1: '#efefcd'});  
    // heat.gradient({ 0.4: '#1d457f', 0.6: '#61599d', 0.7: '#c36377', 0.8: '#eb7f54', 1: '#f2af4a'});  
    // heat.gradient({ 0.2: '#341648', 0.4: '#62205f', 0.5: '#9f2d55', 0.6: '#bb292c', 0.7: '#de4f33', 0.8: '#ef8737', 0.9: '#ffb242', 1: '#ffd353' });      
    // heat.gradient({ 0.2: '#7c1d6f', 0.4: '#b9257a', 0.5: '#dc3977', 0.6: '#e34f6f', 0.7: '#f0746e', 0.8: '#faa476', 1: '#fcde9c' });      
    // heat.gradient({ 0.2: '#1f005c', 0.4: '#5b0060', 0.5: '#870160', 0.6: '#ac255e', 0.7: '#ca485c', 0.8: '#e16b5c', 0.9: '#f39060', 1: '#ffb56b' });      
    // heat.gradient({ 0.1: '#6e40aa', 0.2: '#963db3', 0.3: '#bf3caf', 0.4: '#e3419e', 0.5: '#fe4b83', 0.6: '#ff5e64', 0.7: '#ff7747', 0.8: '#fb9633', 0.9: '#e2b72f', 1: '#c7d63c' });      
    heat.gradient({   0: '#110133', 0.3: '#00918e', 0.6: '#4dd599', 1: '#ffdc34'});  // ++

    heat.draw(0.05);                                                  // Draw the heatmap with optional minimum point opacity (0.05 by default)
    heat.resize();                                                    // Call in case 'canvas' size changed
        
 
/* //////////////////////////////////////////////////////////////////// */

}