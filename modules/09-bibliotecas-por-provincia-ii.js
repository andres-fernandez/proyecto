// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bibliotecas populares por provincia en Argentina  ////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

export function renderBibliotecas_por_provincia_II(){

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

  // Crear una máscara para recortar las hojas del libro
  const masks = _svg.append('defs')    
    .append('mask')
    .attr('id', 'leafs-mask')
    .append('polyline')    
    .attr('fill', '#fff')
    .attr('points', '5,195 115,80 245,80 355,195');

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

  const        middle_x = 180;
  const        bottom_y = 190;
  const  horizontal_gap = 0;
  const    vertical_gap = 3;
  const     total_leafs = 50;

  // const placeholder_data = Array.from({ length: 76 }, (_, i) => i - 37);
  const placeholder_data = Array.from({ length: total_leafs }, (_, i) => i - (total_leafs / 2) + 1 );
  const middle_data = placeholder_data / 2;
  // console.log(placeholder_data);

  const leafs_containers = svg_groups.append('g')
    .attr('mask', 'url(#leafs-mask)')
    .attr('data-bibliotecas', d => d[1])
    .attr('stroke', '#ccc')
    .attr('stroke-width', .25)
    .attr('fill', 'none');

  const leafs = leafs_containers.selectAll('path')
    .data(placeholder_data)
    .join('path')
    .attr('data-value', d => d)
    .attr('d', (d,i) => {      
      const origin_x = d <= 0 ? middle_x + (d * horizontal_gap) : middle_x - horizontal_gap + (d * horizontal_gap);
            
      // Las tres líneas de abajo producen el mismo resultado
      // const origin_y = d <= 0 ? bottom_y - (i * vertical_gap) : (bottom_y + vertical_gap * (d)) - (vertical_gap * placeholder_data.length / 2);  
      // const origin_y = d <= 0 ? bottom_y - (i * vertical_gap) : (bottom_y + vertical_gap * i) - (vertical_gap * (placeholder_data.length - 1));  
      const origin_y = d <= 0 ? bottom_y - (i * vertical_gap) : (bottom_y - (vertical_gap * d) + vertical_gap);  
                        
      const end_x = d <= 0 ? middle_x - 170 : middle_x + 170;
      // const end_y = d <= 0 ? bottom_y - i * (vertical_gap / 3) : bottom_y - i * (vertical_gap / 3) + (vertical_gap / 3) * (placeholder_data.length / 2);       
      const end_y = d <= 0 ? bottom_y - i * (vertical_gap / 1.5) : bottom_y - i * (vertical_gap / 1.5) + (vertical_gap / 1.5) * (placeholder_data.length / 2);       

      // Quadratic render
      // const quadratic_x = d <= 0 ? 180 - 90 : 180 + 90;
      // const quadratic_y = d <= 0 ? 180 - 50 - d * 3 : 180 - 50 + d * 3;         
      // return `M ${origin_x},${origin_y} Q ${quadratic_x},${quadratic_y} ${end_x},${end_y}`;
            
      // Curve render 
      let curve_pc_a, curve_pc_b, curve_pc_c, curve_pc_d;
      if(d <= 0) {
        curve_pc_a = origin_x - 40;
        curve_pc_b = origin_y - 50 - d * 0.25;
        curve_pc_c = end_x + 50;
        curve_pc_d = end_y + 7;
      } else {
        curve_pc_a = origin_x + 40;
        curve_pc_b = origin_y - 50 + d * -0.25;
        curve_pc_c = end_x - 50;
        curve_pc_d = end_y + 7;
      }
      return `M ${origin_x},${origin_y} C ${curve_pc_a},${curve_pc_b} ${curve_pc_c},${curve_pc_d} ${end_x},${end_y}`;
      })
    
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Colorear las páginas según la cantidad de bibliotecas por provincia //////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  leafs_containers.each(function(d, i) {
    const current_g = d3.select(this);                  // Muchísimo cuidado. Para usar 'this' es necesario usar una función anónima. NO USAR arrow function porque no corre
    const how_many_libraries = +d[1]; 
    const paths = current_g.selectAll('path');          // Selecciona todos los paths del grupo
    const percentage = how_many_libraries * total_leafs / 504;  

    // La línea de abajo selecciona desde el primer path en adelante. En el renderizado, comienza desde los paths de la izquierda
    // paths.filter((_, i) => i < percentage).attr('stroke', '#bfc19d').attr('stroke-width', 0.7);

    // La línea de abajo selecciona desde el útlimo path y va retrocediendo. En el renderizado, comienza desde los paths de la derecha
    paths.filter((_, i) => i >= total_leafs - percentage).attr('stroke', '#fcd89c').attr('stroke-width', 0.75);
    
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

const books_spine_a = svg_groups.append('polygon')
    .attr('data-element', 'book-spine')
    .attr('points', `${center_x - 50},${bottom_y + 4} ${center_x - 8},${bottom_y - 22} ${center_x + 8},${bottom_y - 22} ${center_x + 50},${bottom_y + 4}`)
    .attr('fill', '#222');

  const books_spine_b = svg_groups.append('ellipse')
    .attr('cx', center_x)
    .attr('cy', bottom_y - 8)
    .attr('rx', 14)
    .attr('ry', 5)
    .attr('fill', '#555');

  const books_spine_c = svg_groups.append('polygon')
    .attr('data-element', 'book-spine')
    .attr('points', `${center_x - 10},${bottom_y - 7} ${center_x - 8},${bottom_y - 14} ${center_x + 8},${bottom_y - 14} ${center_x + 10},${bottom_y - 7}`)
    .attr('fill', '#555');

  const books_spine_d = svg_groups.append('polygon')
    .attr('data-element', 'book-spine-inner')
    .attr('points', `${center_x - 16},${bottom_y + 2} ${center_x - 10},${bottom_y + 6} ${center_x + 10},${bottom_y + 6} ${center_x + 16},${bottom_y + 2}`)
    .attr('fill', '#555');

  const books_covers = svg_groups.selectAll('polyline')
    .data([6,2])
    .join('polyline')
    .attr('data-element', d => `book-cover-${d}`)
    .attr('points', d => d > 3 ? 
        `10,${bottom_y + 10} ${width / 2 - 20},185 ${width / 2 + 20},185 ${width - 10},${bottom_y +10}` :
        `10,${bottom_y + 16} ${width / 2 - 20},192 ${width / 2 + 20},192 ${width - 10},${bottom_y +16}`)
    .attr('fill', 'none')
    .attr('stroke', d => d > 3 ? '#555' : '#f00')
    .attr('stroke', '#555')
    .attr('stroke-width', d => d )
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