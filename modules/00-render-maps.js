// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Projection & geopath generator ///////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
// Esta es la mejor proyección de Argentina para uso infográfico. Genera el mismo resultado que la proyección [laea] usada en Mapshaper  

export const projection = d3.geoAzimuthalEqualArea()
	.scale(1200)
	.rotate([63.5, 0])
	.center([0, -38.5])
	.translate([(450 / 2), (750 / 2)])
	.precision(0.1);

/* ----------------------------------------------------------- */

export const geoPathGenerator = d3.geoPath().projection(projection);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Gratícula ////////////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// const graticule = d3.geoGraticule()
// 	.step([3, 3])
// 	.extent([
// 		[-86, -18],
// 		[-40, -60]
// 	]); 														

// [ -86w, -18s ][ -40w, -57s ] - extent() especifica qué meridianos y paralelos serán renderizados por d3.js
// Sirve para omitir trazar paralelos o meridianos que están fuera del viewport y no serán visualizados por el usuario
// Sintaxis: extent[[meridiano de la izquierda, paralelo superior],[ meridiano de la derecha, paralelo inferior]]

// const lines = graticula.selectAll('path')
//  .data([graticule()])                   					// Esta línea produce el mismo resultado que la de abajo
//  .data(graticule.lines())
//  .join('path')
//  .attr('d', geoPathGenerator)
//  .attr('fill', 'none')
//  .attr('stroke', '#fff')
//  .attr('stroke-width', .1)
//  .attr('id', function(d) {
//      const c = d.coordinates;
//      if (c[0][0] == c[1][0]) { return (c[0][0] < 0) ? -c[0][0] + "W" : +c[0][0] + "E"; }
//      else if (c[0][1] == c[1][1]) { return (c[0][1] < 0) ? -c[0][1] + "S" : c[0][1] + "N"; }
//  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render Argentina /////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function renderArgentina(container, JSON_data) {

	// Del archivo GeoJSON original de Argentina, se separó la parte continental de las Islas Malvinas, para poder estilizarlos por separado
	// El archivo con la parte continental tuvo que ser sanitizado para poder aplicarle un atributo de relleno. Eso se hizo en https://rewind.davidb.dev

	const strokeColor = '#ccc';
	const strokeWidth = 1.25;

	container.selectAll('path')
		.data(JSON_data.features)
		.join('path')
		.attr('d', geoPathGenerator)
		.attr('fill', d => 'none')
		.attr('stroke', strokeColor)
		.attr('stroke-linejoin', 'round')
		.attr('stroke-width', d => {
			// console.log(d3.geoBounds(mapa));                   // Returns the spherical bounding box for the specified GeoJSON object.
			// console.log('Centroid: ' + d3.geoCentroid(mapa));  // Returns the spherical centroid of the specified GeoJSON object
			return strokeWidth;
		});
	}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render Islas Malvinas ////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
export function renderIslasMalvinas(container, JSON_data) {  
		
		const strokeColor = '#bbb';
		const strokeWidth = 0.25;

    container.attr('fill', 'none')
      .selectAll('path')
      .data(JSON_data.features)
      .join('path')
    	.attr('d', geoPathGenerator)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth);
   }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render Provincias /////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
export function renderProvincias(container, JSON_data) {
		
		const strokeColor = '#ddd';
		const strokeWidth = 0.5;

     container.attr('fill', 'none')
       .selectAll('path')
       .data(JSON_data.features)
       .join('path')
       .attr('d', geoPathGenerator)
       .attr('stroke', strokeColor)
       .attr('stroke-width', strokeWidth);
   }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render Departamentos /////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
export function renderDepartamentos(container, JSON_data) { 
		
		const strokeColor = '#bbb';
		const strokeWidth = 0.1;

     container.attr('fill', 'none')
       .selectAll('path')
       .data(JSON_data.features)
       .join('path')
       .attr('d', geoPathGenerator)
       .attr('stroke', strokeColor)
       .attr('stroke-width', strokeWidth);
   }

/////////////////////////////////////////////////////////////////////////////////////