// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas populares por provincia en Argentina  ////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

export function renderBibliotecas_por_provincia() {

  const width = 360;
  const height = 240;
  const center_x = width / 2;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Data /////////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const db = {
    'Ciudad Autónoma de Buenos Aires': 46,
    'Neuquén': 69,
    'San Luis': 47,
    'Santa Fe': 252,
    'La Rioja': 25,
    'Catamarca': 38,
    'Tucumán': 39,
    'Chaco': 70,
    'Formosa': 24,
    'Santa Cruz': 20,
    'Chubut': 48,
    'Mendoza': 71,
    'Entre Ríos': 66,
    'San Juan': 57,
    'Jujuy': 41,
    'Santiago del Estero': 68,
    'Río Negro': 68,
    'Corrientes': 56,
    'Misiones': 44,
    'Salta': 65,
    'Córdoba': 162,
    'Buenos Aires': 504,
    'La Pampa': 73,
    'Tierra del Fuego': 11
  }
  
  // Recordar que .data() no opera sobre objetos, sólo acepta un array como parámetro
  // Por eso es necesario convertir el objeto original a un array con Object.entries()
  // El resultado será un array de arrays con esta estructura: [ ["Neuquén", 69], ... ['Tierra del Fuego': 11] ] 
  // Luego, se ordena el array tomando como referncia el número de biliotecas. Y se lo invierte para que quede en orden descendente

  let db_as_array = Object.entries(db);
      db_as_array = d3.sort(db_as_array, d => d[1]).reverse();  // d3.sort(iterable, comparator) 

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Divs /////////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Crear un div para cada elemento del array 'db_as_array' y asignarle como ID una versión sanitizada del primer elemento de cada array interno
  const divs = d3.select('#dataviz_provincias').selectAll('div')
    .data(db_as_array)
    .join('div')
    .attr('id', d => d[0].toLowerCase().split(' ').join('-').normalize('NFKD').replace(/[\u0300-\u036f]/g, ''));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SVG //////////////////////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Crear un SVG dentro de cada div. No hace falta bindear nuevamente los datos, por se heredan de la asignación original al crear los divs    
  const _svg = divs.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', [0, 0, width, height])
    .attr('title', d => d[0])
    .attr('data-value', d => d[1]);


  // Crear una máscara para mostrar sólo la mitad del círculo
  // const masks = _svg.append('defs')    
  //   .append('mask')
  //   .attr('id', 'semicircle')
  //   .append('rect')
  //   .attr('x', 0)
  //   .attr('y', 0)
  //   .attr('width', width)
  //   .attr('height', height - 20)
  //   .attr('fill', '#fff');


  // Crear un 'g' dentro de cada SVG
  const svg_groups = _svg.append('g')


  // Crear un círculo dentro de cadq 'g'. No es necesario bindear los datos porque ya se heredan de la asignación original
  // const circles = svg_groups.append('circle')
  //   .attr('mask', 'url(#semicircle)')
  //   .attr('cx', center_x)
  //   .attr('cy', height - 20)
  //   .attr('r', center_x - 10)
  //   .attr('fill', '#242424')
  //   .attr('fill', 'none')
  //   .attr('data-name', d => d[0])


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Renderizar líneas con curvatura //////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // https://docs.aspose.com/svg/es/net/drawing-basics/svg-path-data/
  // https://svg-path-visualizer.netlify.app/#M2%2C2%20Q8%2C2%208%2C8
  // https://www.joshwcomeau.com/animation/dynamic-bezier-curves/ ++

  const  number_of_leafs = 75;
  const       angle_step = 180 / (number_of_leafs - 1);
  // const         origin_x = 180;
  const         origin_y = 180;
  const           radius = 150;
  const     curve_offset = 50;                                  // Controla qué tan "inflada" es la curva. A mayor valor, mayor comba
  const              gap = .6;

  const angles = d3.range(0, 180 + angle_step, angle_step);     // De 0° a 180° inclusive

  const leafs_containers = svg_groups.append('g')
    .attr('data-bibliotecas', d => d[1])
    .attr('stroke', '#555')
    .attr('stroke-width', .35)
    .attr('fill', 'none');

  const leafs = leafs_containers.selectAll('path')
    .data(angles)
    .join('path')
    .attr('d', (angle,i) => {

      const total_width = (number_of_leafs - 1) * gap;
      const origin_x = center_x - total_width / 2 + i * gap;

      const theta = (angle - 180) * Math.PI / 180;
      
      // Punto final de la línea curva
      const x2 = origin_x + radius * Math.cos(theta);
      const y2 = origin_y + radius * Math.sin(theta);

      // Punto de control: un poco más cerca y desplazado hacia afuera
      const control_radius = radius * 0.5;                                   // Si es mayor a radius / 2, la curva se infla más y parece más un libro
      const cx = origin_x + control_radius * Math.cos(theta);
      const cy = origin_y + control_radius * Math.sin(theta) - curve_offset;

      return `M ${origin_x},${origin_y} Q ${cx},${cy} ${x2},${y2}`;
    });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Colorear las páginas según la cantidad de bibliotecas por provincia //////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  leafs_containers.each(function(d, i) {
    const current_g = d3.select(this);                  // Muchísimo cuidado. Para usar 'this' es necesario usar una función anónima. NO USAR arrow function porque no corre
    const how_many_libraries = +d[1]; 
    const paths = current_g.selectAll('path');          // Selecciona todos los paths del grupo
    const percentage = how_many_libraries * 75 / 504;  

    // La línea de abajo selecciona desde el primer path en adelante. En el renderizado, comienza desde los paths de la izquierda
    // paths.filter((_, i) => i < percentage).attr('stroke', '#bfc19d').attr('stroke-width', 0.7);

    // La línea de abajo selecciona desde el útlimo path y va retrocediendo. En el renderizado, comienza desde los paths de la derecha
    paths.filter((_, i) => i >= 75 - percentage).attr('stroke', '#fcd89c').attr('stroke-width', 0.75);

    // Las líneas de abajo seleccionarn los paths de manera simétrica desde el centro 
    // const start_point = Math.floor((75 - percentage) / 2 );
    // paths.filter((_, i) => i >= start_point && i < start_point + percentage).attr('stroke', '#bfc19d').attr('stroke-width', 0.7);

  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Renderizar líneas rectas con un origen común /////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // const angle_by_library = 2;
  // const angles = d3.range(0, 180, angle_by_library);
  // const base_grid = svg_groups.append('g')
  //   .attr('data-type', 'base-grid')
  //   .attr('stroke', '#666')
  //   .attr('stroke-width', 0.4)
  //   .attr('stroke-linecap', 'round')
  //   .selectAll('line')
  //   .data(angles)
  //   .join('line')
  //   .attr('x1', origin_x)
  //   .attr('y1', origin_y)
  //   .attr('x2', d => origin_x + radius * Math.cos(d * Math.PI / 180))
  //   .attr('y2', d => origin_y - radius * Math.sin(d * Math.PI / 180)); 

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Sólo para análisis y referencia  /////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Esta sección se mantiene sólo como referncia y para análisis. En este caso, las líneas desde el centro se dibujan usando 'd3.lineRadial()'    
  // La clave, en este caso, es que lineRadial() toma como valor cero el extremo superior, equivalente a las 12:00 en un reloj analógico
  // Esa es la principal diferencia con las coordenadas polares usadas más arriba.

  // const lineRadial_library_angle = d3.lineRadial().angle(d => d * Math.PI / 90).radius(d => 150);
  // console.log(lineRadial_library_angle([90])) // Renders this M1.2246467991473532e-14,100Z

  // const base_grid = svg_groups.append('g')
  //   .attr('transform', 'translate(' + width / 2 + ',' + (height - 60) + ')')
  //   .attr('data-type', 'base-grid')
  //   .attr('stroke', '#666')
  //   .attr('stroke-width', 0.25)
  //   .attr('stroke-linecap', 'round')
  //   .selectAll('line')
  //   .data(d3.range(0, 180, 2))
  //   .join('line')
  //   .attr('stroke', (d, i) => i == 0 ? 'red' : null)
  //   .attr('x1', 0)
  //   .attr('y1', 0)
  //   .attr('x2', d => lineRadial_library_angle([d]).split(',')[0].slice(1))
  //   .attr('y2', d => lineRadial_library_angle([d]).split(',')[1].slice(0, -1));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Renderizar los lomos de los libros  //////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // const books = svg_groups.append('line')
  //   .attr('x1', width / 2 - 19)
  //   .attr('y1', 187)
  //   .attr('x2', width / 2 + 19)
  //   .attr('y2', 187)
  //   .attr('stroke', '#555')
  //   .attr('stroke-width', 6)
  //   .attr('stroke-linecap', 'round');

  const books = svg_groups.selectAll('line')
    .data([1,7])
    .join('line')
    .attr('x1', (_, i) => i == 0 ? width / 2 - 20 : width / 2 - 21)
    .attr('y1', d => 187 + d )
    .attr('x2', (_, i) => i == 0 ? width / 2 + 20 : width / 2 + 21)
    .attr('y2', d => 187 + d )
    .attr('stroke', '#555')
    .attr('stroke-width', (_, i) => i == 0 ? 6 : 2)
    .attr('stroke-linecap', 'round');


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Nombre de las provincias y cantidad de bibliotecas ///////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // En la línea de abajo, no es necesario volver a ejecutar un binding de datos con data(), porque cada div ya está vinculado con los datos de db_as_array
  // const titles = divs.append('h3').text(d => d[0])

  const titles = svg_groups.append('text')
    .attr('fill', '#777')
    .attr('x', width / 2)
    .attr('y', height - 23)
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.9rem')
    .text(d => d[0]);
    
  const number_of_libraries = svg_groups.append('text')
    .attr('fill', '#fff')
    .attr('x', width / 2)
    .attr('y', height)
    .attr('text-anchor', 'middle')
    .attr('font-size', '1rem')
    .attr('font-weight', 'bold')
    .text(d => d[1]);
 
/* //////////////////////////////////////////////////////////////////// */

}