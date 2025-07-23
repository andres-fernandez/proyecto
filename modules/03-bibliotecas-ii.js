import { projection, geoPathGenerator, renderArgentina, renderIslasMalvinas, renderProvincias, renderDepartamentos } from './00-render-maps.js';

export function renderBibliotecas_II(bibliotecas_data, argentina_data, islas_malvinas_data, width, height) {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas populares en Argentina  //////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const bibliotecas = d3.select('#dataviz_bibliotecas_ii');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SVG setup ////////////////////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const svg = bibliotecas.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height)
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
  frame.append('rect').attr('width', width).attr('height', height).attr('fill', '#222');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mask for voronid / delauny ///////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    defs.append('mask')
      .attr('id', 'mask-ar')
      .selectAll('path')
      .data(argentina_data.features)
      .join('path')
      .attr('d', geoPathGenerator)
      .attr('fill', '#fff')
      .attr('stroke', 'none')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render mapas /////////////////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  renderArgentina(argentina, argentina_data);
  renderIslasMalvinas(islas_malvinas, islas_malvinas_data);
  
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Un dot para cada biblioteca popular en Argentina /////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Crear una estructura de voronoid /////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
    const scaleColor = d3.scaleSequential().domain([0, 74]).interpolator(d3.interpolateRainbow);
  
    // const points = bibliotecas_data.map(d => {
    //   const x = parseFloat(projection([d.long, d.lat])[0].toFixed(2));
    //   const y = parseFloat(projection([d.long, d.lat])[1].toFixed(2));
    //   return [x,y];
    // });
      
    const points = bibliotecas_data.map(d => {
      const x = parseFloat(projection([d.long, d.lat])[0].toFixed(2));
      const y = parseFloat(projection([d.long, d.lat])[1].toFixed(2));
      const value = d.biblioteca.length;
      return { x, y, value };
    });
  
    const delaunay = d3.Delaunay.from(points, d => d.x, d => d.y);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
  
  // Función para calcular área de un polígono (fórmula del área de Gauss)

    function polygonArea(polygon) {
      let area = 0;
      for (let i = 0, n = polygon.length; i < n; i++) {
        const [x0, y0] = polygon[i];
        const [x1, y1] = polygon[(i + 1) % n];
        area += (x0 * y1 - x1 * y0);
      }
      return Math.abs(area / 2);
    }
  
  // Render Voronoi cells ///////////////////////////////////////////////////////////////
  
    voronoi_triang.attr('mask', 'url(#mask-ar)')
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.15)
      .selectAll('path')
      .data(points)
      .join('path')
      .attr('value', d => d.value)
      // .attr('fill', (_, i) => {
      //   const polygon = voronoi.cellPolygon(i);
      //   const curr_area = polygon ? polygonArea(polygon) : 0;
      //   return scaleColor(curr_area);
      // })
      // .attr('fill', d => scaleColor(d.value))
      .attr('fill', 'none')
      .attr('d', (d, i) => voronoi.renderCell(i))
      .attr('data-area', (_, i) => {
        const polygon = voronoi.cellPolygon(i);                 // Devuelve un array de arrays, donde cada array interno corresponde a un vértice del polígono y tiene dos valores: las coordenadas x,y del vértice        
        return polygon ? polygonArea(polygon).toFixed(2) : 0;
      });
  
  // Render Delaunay triangles //////////////////////////////////////////////////////////
  
     // delaunay_triang.attr('mask', 'url(#mask-ar)')
     //   .selectAll('path')
     //   .data(delaunay.trianglePolygons())
     //   .join('path')
     //   .attr('d', d => `M${d.join("L")}Z`)
     //   .attr('fill', 'none')
     //   .attr('stroke', '#fff')
     //   .attr('stroke-width', 0.25);
    
    }
