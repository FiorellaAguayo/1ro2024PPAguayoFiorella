export function validarCampoVacio(campo1, campo2, campo3, campo4) {
    if(campo1 === '' || campo1 === null || campo2 === '' || campo2 === null || 
    campo3 === '' || campo3 === null|| campo4 === '' || campo4 === null){
        return false;
    }
    return true;
}

export function validarSoloLetras(valorInput)
{
    valorInput.addEventListener('input', function(event) {
        const valor = event.target.value;
        const soloLetrasRegex = /^[a-zA-Z]*$/;
        if (!soloLetrasRegex.test(valor)) {
            event.target.value = valor.replace(/[^a-zA-Z]/g, '');
        }
    });
}

export function validarSoloNumerosEnteros(valorInput) {
    valorInput.addEventListener('input', function(event) {
        const valor = event.target.value;
        const soloNumerosEnterosRegex = /^\d*$/;
        if (isNaN(valor) || !soloNumerosEnterosRegex.test(valor)) {
            event.target.value = valor.slice(0, -1);
        }
    });
}

export function validarSoloNumeros(valorInput){
    valorInput.addEventListener('input', function(event) {
        const valor = event.target.value;
        const soloNumerosRegex = /^\d*\.?\d*$/;
        if (!soloNumerosRegex.test(valor)){
            event.target.value = valor.replace(/[^\d.]/g, '');
        }
        if(valor.split('.').length > 2) {
            event.target.value = valor.replace(/(\..*)\./g, '$1');
        }
        return valor;
    });
}

export function validarFechaDeNacimiento(inputFecha)  {
    inputFecha.addEventListener('input', function(event) {
        let valor = event.target.value;
        if (valor.length > 8) {
            valor = valor.slice(0, 8);
        }
        const formatoValido = /^\d{0,8}$/.test(valor);
        if (!formatoValido) {
            event.target.setCustomValidity("La fecha de nacimiento tien un limitede 8 caracteres y tiene formato AAAAMMDD.");
        } else {
            event.target.setCustomValidity("");
        }
        event.target.value = valor;
    });
}