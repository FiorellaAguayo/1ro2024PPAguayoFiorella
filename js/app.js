import { Ciudadano } from './ciudadano.js';
import { Extranjero } from './extranjero.js';
import { data } from './data.js';
import * as funciones from './funciones.js';

// -----------------------------------------------------------------------------------------------------------
// ------------------------------------------------- 1ER FORM ------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

let dataPersonas = data;

function llenarTabla(usuarios = dataPersonas) {
    const tbody = document.getElementById('tablaUsuarios').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    usuarios.forEach(usuario => {
        const fila = tbody.insertRow();
        fila.insertCell().textContent = usuario.id;
        fila.insertCell().textContent = usuario.nombre;
        fila.insertCell().textContent = usuario.apellido;
        fila.insertCell().textContent = usuario.fechaNacimiento;

        if ('dni' in usuario) {
            fila.insertCell().textContent = usuario.dni;
            fila.insertCell().textContent = '-';
        } else if ('paisOrigen' in usuario) {
            fila.insertCell().textContent = '-';
            fila.insertCell().textContent = usuario.paisOrigen;
        }
    });

    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', function() {
            const userId = parseInt(row.cells[0].textContent);
            const usuario = dataPersonas.find(user => user.id === userId);
    
            document.getElementById('id').value = usuario.id;
            document.getElementById('tipo').value = usuario.dni !== undefined ? 'ciudadano' : 'extranjero';
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('dni').value = usuario.dni || '';
            document.getElementById('paisOrigen').value = usuario.paisOrigen || '';
    
            const fechaNacimiento = usuario.fechaNacimiento || '';
            const processedFechaNacimiento = processFechaNacimiento(fechaNacimiento);
            document.getElementById('fechaNacimiento').value = processedFechaNacimiento;

            toggleFormVisibility(true, false);
        });
    });
    toggleColumnVisibility();

    
    function processFechaNacimiento(fecha) {
        if(!fecha) {
            return '';
        }
        const fechaArray = fecha.split('-').join('').split('');
        return fechaArray.join('');
    }
}

function toggleColumnVisibility() {
    const columnas = ['id', 'nombre', 'apellido', 'fechaNacimiento', 'dni', 'paisOrigen'];
    columnas.forEach((col, index) => {
        const checkbox = document.getElementById(`col-${col}`);
        const th = document.getElementById(`th-${col}`);
        const isVisible = checkbox.checked;

        th.style.display = isVisible ? '' : 'none';
        document.querySelectorAll(`td:nth-child(${index + 1})`).forEach(td => {
            td.style.display = isVisible ? '' : 'none';
        });
    });
}

//------------------------------------------------- FILTROS ------------------------------------------------------------

function filtrarUsuarios() {
    const filtro = document.getElementById('filtro').value;
    let usuariosFiltrados;

    if (filtro === "1") {
        usuariosFiltrados = dataPersonas.filter(usuario => 'paisOrigen' in usuario);
    } else if (filtro === "2") {
        usuariosFiltrados = dataPersonas.filter(usuario => 'dni' in usuario);
    } else {
        usuariosFiltrados = dataPersonas;
    }
    llenarTabla(usuariosFiltrados);
}

function obtenerUsuariosFiltrados(filtro) {
    let usuariosFiltrados = [];
    if (filtro === "1") {
        usuariosFiltrados = dataPersonas.filter(usuario => 'paisOrigen' in usuario);
    } else if (filtro === "2") { 
        usuariosFiltrados = dataPersonas.filter(usuario => 'dni' in usuario);
    } else {
        usuariosFiltrados = dataPersonas;
    }
    return usuariosFiltrados;
}

//------------------------------------------------- CALCULAR PROMEDIO ------------------------------------------------------------

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const anioNacimiento = parseInt(fechaNacimiento.substring(0, 4));
    const anioActual = hoy.getFullYear();
    const edad = anioActual - anioNacimiento;
    return edad;
}

function calcularEdadPromedio(){
    const filtro = document.getElementById('filtro').value;
    const usuariosFiltrados = obtenerUsuariosFiltrados(filtro);
    if(usuariosFiltrados.length > 0) {
        const totalEdades = usuariosFiltrados.reduce((sum, user) => sum + calcularEdad(user.fechaNacimiento), 0);
        const promedioEdad = (totalEdades / usuariosFiltrados.length).toFixed(2);
        document.getElementById('edadPromedio').value = promedioEdad;
    }else {
        document.getElementById('edadPromedio').value = 'No hay datos';
    }
}

// ----------------------------------------- MANEJAR VISIBILIDAD DE FORM Y BOTONES -------------------------------------------------

function toggleFormVisibility(showABM, showDatos) {
    const formABM = document.getElementById('Form_ABM');
    const formTabla = document.getElementById('Form_Tabla');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnAlta = document.getElementById('btnAlta');
    const btnModificar = document.getElementById('btnModificar');
    const btnEliminar = document.getElementById('btnEliminar');

    if(showABM) {
        formABM.classList.replace('hidden', 'visible');
        btnCancelar.classList.replace('hidden', 'visible'); 
        btnAgregar.classList.replace('visible', 'hidden');
        btnAlta.classList.replace('hidden', 'visible');
        btnModificar.classList.replace('hidden', 'visible');
        btnEliminar.classList.replace('hidden', 'visible');
    } else {
        formABM.classList.replace('visible', 'hidden');
        btnCancelar.classList.replace('visible', 'hidden');
        btnAgregar.classList.replace('hidden', 'visible');
        btnAlta.classList.replace('visible', 'hidden');
        btnModificar.classList.replace('visible', 'hidden');
        btnEliminar.classList.replace('visible', 'hidden');
    }

    if(showDatos){
        formTabla.classList.replace('hidden', 'visible');
        llenarTabla(dataPersonas);
    } else {
        formTabla.classList.replace('visible', 'hidden');
    }
}


document.getElementById('btnAgregar').addEventListener('click', function() {
    toggleFormVisibility(true, false);
});
    
document.addEventListener('DOMContentLoaded', () => {
    llenarTabla();
    document.getElementById('filtro').addEventListener('change', filtrarUsuarios);
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', toggleColumnVisibility);
    });
    const btnCalcular = document.getElementById('btnCalcular');
    btnCalcular.addEventListener('click', function(event) {
        event.preventDefault();
        calcularEdadPromedio();
    });
});

// ----------------------------------------- ORDENAR LA TABLA SEGUN ENCABEZADO -----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('th').forEach(th => {
        th.addEventListener('click', () => {
            const columna = th.id.replace('th-', '');
            ordenarTabla(columna);
        });
    });
});

function ordenarTabla(columna) {
    const tipo = tipoDeDato(columna);
    const filtro = document.getElementById('filtro').value;
    let usuariosFiltrados = obtenerUsuariosFiltrados(filtro);
    usuariosFiltrados.sort((a, b) => {
        if (tipo === 'number') {
            return a[columna] - b[columna];
        } else {
            return a[columna].localeCompare(b[columna]);
        }
    });
    llenarTabla(usuariosFiltrados);
}

function tipoDeDato(columna) {
    if(['id','fechaNacimiento', 'dni'].includes(columna)) {
        return 'number';
    } else {
        return 'string';
    }
}

// -----------------------------------------------------------------------------------------------------------
// ------------------------------------------------- 2DO FORM ------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

controlarDatosIngresados();

document.getElementById('btnCancelar').addEventListener('click', function(event) {
    event.preventDefault();
    llenarTabla(dataPersonas);
    toggleFormVisibility(false, true);
});


document.addEventListener('DOMContentLoaded', function() {
    const tipo = document.getElementById('tipo');
    const dni = document.getElementById('dni');
    const paisOrigen = document.getElementById('paisOrigen');

    tipo.addEventListener('change', function() {
        if (tipo.value === 'ciudadano') {
            dni.disabled = false;
            paisOrigen.disabled = true;
            limpiarCampo(paisOrigen);
        } else if (tipo.value === 'extranjero') {
            dni.disabled = true;
            paisOrigen.disabled = false;
            limpiarCampo(dni);
        }
    });
    function limpiarCampo(campo) {
        if (campo.value) {
            campo.value = '';
        }
    }
    tipo.dispatchEvent(new Event('change'));
});

// ------------------------------------ ALTA ----------------------------------------

document.getElementById("btnAlta").addEventListener("click", function(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const dni = document.getElementById('dni').value;
    const paisOrigen = document.getElementById('paisOrigen').value;
    const idUnico = generarIdUnico();

    if (tipo === 'ciudadano') {
        if(!funciones.validarCampoVacio(nombre, apellido, fechaNacimiento, dni)){
            alert(`No pueden quedar campos vacíos`);
            return ;
        }
        const nuevoCiudadano = new Ciudadano(idUnico, nombre, apellido, fechaNacimiento, dni);
        dataPersonas.push(nuevoCiudadano);
        alert('Ciudadano agregado correctamente');
    } else if (tipo === 'extranjero') {
        if(!funciones.validarCampoVacio(nombre, apellido, fechaNacimiento, paisOrigen)){
            alert(`No pueden quedar campos vacíos`);
            return ;
        }
        const nuevoExtranjero = new Extranjero(idUnico, nombre, apellido, fechaNacimiento, paisOrigen);
        dataPersonas.push(nuevoExtranjero);
        alert('Extranjero agregado correctamente');
    }
    //calcularEdadPromedio();
    llenarTabla();
    limpiarDatos();
    toggleColumnVisibility();
    toggleFormVisibility(false, true);
});

// ---------------------------------- MODIFICAR ------------------------------------------

document.getElementById("btnModificar").addEventListener("click", function(event) {
    event.preventDefault(); 

    const id = parseInt(document.getElementById('id').value);
    const tipo = document.getElementById('tipo').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const dni = document.getElementById('dni').value;
    const paisOrigen = document.getElementById('paisOrigen').value;

    const index = dataPersonas.findIndex(user => user.id === id);
    if (index !== -1) {
        if (tipo === 'ciudadano') {
            if(!funciones.validarCampoVacio(nombre, apellido, fechaNacimiento, dni)){
                alert(`No pueden quedar campos vacíos`);
                return ;
            }
            dataPersonas[index] = new Ciudadano(id, nombre, apellido, fechaNacimiento, dni);
        } else if (tipo === 'extranjero') {
            if(!funciones.validarCampoVacio(nombre, apellido, fechaNacimiento, paisOrigen)){
                alert(`No pueden quedar campos vacíos`);
                return ;
            }
            dataPersonas[index] = new Extranjero(id, nombre, apellido, fechaNacimiento, paisOrigen);
        }
        alert('Usuario modificado correctamente');
        llenarTabla();
        toggleFormVisibility(false, true);
    } else {
        alert('El usuario con el ID especificado no existe.');
    }
});

// ---------------------------------- BAJA ------------------------------------------

document.getElementById("btnEliminar").addEventListener("click", function(event) {
    event.preventDefault(); 
    const id = parseInt(document.getElementById('id').value);
    const newDataPersonas = dataPersonas.filter(user => user.id !== id);
    if (newDataPersonas.length < dataPersonas.length) {
        dataPersonas = newDataPersonas;
        alert('Usuario eliminado correctamente');
        llenarTabla();
        toggleFormVisibility(false, true);
    } else {
        alert('El usuario con el ID especificado no existe.');
    }
});


function generarIdUnico() {
    const idsExistentes = dataPersonas.map(item => item.id);
    const maxId = Math.max(...idsExistentes, 0);
    return maxId + 1;
}

function controlarDatosIngresados()
{
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const dni = document.getElementById('dni');
    const paisOrigen = document.getElementById('paisOrigen');

    funciones.validarSoloLetras(nombreInput);
    funciones.validarSoloLetras(apellidoInput);
    funciones.validarFechaDeNacimiento(fechaNacimientoInput);
    funciones.validarSoloNumerosEnteros(dni);
    funciones.validarSoloLetras(paisOrigen);
}