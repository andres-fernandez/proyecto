
'use strict';

import                     { renderEscuelas } from './modules/01-establecimientos-educativos.js';
import                  { renderBibliotecas } from './modules/02-bibliotecas.js';
import               { renderBibliotecas_II } from './modules/03-bibliotecas-ii.js';
import           { renderBibliotecas_x_dpto } from './modules/04-bibliotecas-por-departamento.js';
import        { renderBibliotecas_x_dpto_II } from './modules/05-bibliotecas-por-departamento-ii.js';
import    { renderHabitantes_por_biblioteca } from './modules/06-habitantes-por-biblioteca.js';
import { renderHabitantes_por_biblioteca_II } from './modules/07-habitantes-por-biblioteca-ii.js';
// import    { renderBibliotecas_por_provincia } from './modules/08-bibliotecas-por-provincia.js';
import { renderBibliotecas_por_provincia_II } from './modules/09-bibliotecas-por-provincia-ii.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// //////////////////////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

document.addEventListener("DOMContentLoaded", function() {

	 const start = performance.now();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Fetching data ////////////////////////////////////////////////////////////////
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 

	let w = 450;
	let h = 750;

	Promise.all([

		d3.csv('./data/establecimientos_educativos_en_argentina.csv'),
		d3.csv('./data/bibliotecas.csv'),
		d3.json('./data/habitantes_y_biblioteca_por_departamento.json'),
		d3.json('./data/argentina_sanitized.json'),
		d3.json('./data/islas_malvinas_sanitized.json'),
		d3.json('./data/limites-provinciales.json'),
		d3.json('./data/departamentos_sanitized.json')

	]).then(([esc, biblio, hab_biblio, arg, malv, pcia, dpto]) => {

		renderEscuelas(esc, arg, malv, pcia, dpto, w, h);
		renderBibliotecas(biblio, arg, malv, pcia, dpto, w, h) ;
		renderBibliotecas_II(biblio, arg, malv, w, h);
		renderBibliotecas_x_dpto(hab_biblio, arg, malv, pcia, dpto, w, h);
		renderBibliotecas_x_dpto_II(hab_biblio, arg, malv, pcia, dpto, w, h);
		renderHabitantes_por_biblioteca(biblio, hab_biblio, arg, malv, pcia, dpto, w, h);
		renderHabitantes_por_biblioteca_II(hab_biblio, arg, malv, w, h);
		// renderBibliotecas_por_provincia();
		renderBibliotecas_por_provincia_II();

	}).catch(error => {
		console.error('Error loading files:', error);
	});

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Download and view  ///////////////////////////////////////////////////////////
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  function view_and_download(e) {
    const eTarget = e.target;
    if (eTarget.matches('button[data-download]')) {
      const     container = eTarget.parentElement.parentElement;
      const      map_name = container.dataset.render;
      let     dataviz_svg = container.querySelector('svg').outerHTML;
              dataviz_svg = dataviz_svg.replace('width="450"', '').replace('height="750"', '');
      const     save_date = new Date().toLocaleString("sv-SE").replace(' ', '__').replace(':', 'y').slice(0, -3);
      const      fileName = `${map_name} - ${save_date}.svg`;
      const  downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', fileName);
      downloadLink.setAttribute('href', 'data: image/svg+xml, ' + encodeURIComponent(dataviz_svg));
      downloadLink.click();
    } else {
      eTarget.classList.toggle('dimmed');
      const container = eTarget.parentElement.parentElement;
      const canvas = container.querySelector('canvas').classList.toggle('hidden');
    }
  }
    
	document.body.addEventListener('click', view_and_download);

	const end = performance.now();
 // console.log('Maps render in: ' + (end - start) + 'ms.');

// No tocar debajo de esto ////////////////////////////////////////////////////

});