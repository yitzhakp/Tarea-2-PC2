function procesarGramatica() {
    let input = document.getElementById('productions').value;

    // Remove extra spaces and blank lines
    input = input.replace(/^\s*$(?:\r\n?|\n)/gm, ''); // Remove blank lines
    input = input.trim(); // Remove leading and trailing spaces


    const producciones = parseProductions(input);
    const nuevasProducciones = eliminarRecursionIzquierda(producciones);
    mostrarProducciones(nuevasProducciones);
    const primeros = calcularPrimero(nuevasProducciones);
    mostrarPrimero(primeros);
    mostrarPrimeroM(primeros); 

    document.querySelector('.follow-sets-section').style.display = 'block';
    document.getElementById('producciones-follow').value = formatProductionsForFollow(nuevasProducciones);
}

function parseProductions(input) {
    const lines = input.split('\n');
    const producciones = {};
    for (const line of lines) {
        const [noTerminal, reglas] = line.split('->').map(s => s.trim());
        producciones[noTerminal] = reglas.split('|').map(s => s.trim());
    }
    return producciones;
}

function eliminarRecursionIzquierda(producciones) {
    const nuevasProducciones = {};
    for (const noTerminal in producciones) {
        const reglas = producciones[noTerminal];
        const recursivas = [];
        const noRecursivas = [];
        for (const regla of reglas) {
            if (regla.startsWith(noTerminal)) {
                recursivas.push(regla.slice(noTerminal.length));
            } else {
                noRecursivas.push(regla);
            }
        }
        if (recursivas.length > 0) {
            const nuevoNoTerminal = noTerminal + "'";
            nuevasProducciones[noTerminal] = noRecursivas.map(nr => nr + nuevoNoTerminal);
            nuevasProducciones[nuevoNoTerminal] = recursivas.map(r => '' + r + nuevoNoTerminal).concat(['ε']);
        } else {
            nuevasProducciones[noTerminal] = reglas;
        }
    }
    return nuevasProducciones;
}

function mostrarProducciones(producciones) {
    const output = document.getElementById('output-productions');
    const outputM = document.getElementById('output-productions-m');
    output.textContent = '';
    outputM.textContent = '';
    for (const noTerminal in producciones) {
        const reglas = producciones[noTerminal].join(' | ');
        output.textContent += `${noTerminal} -> ${reglas}\n`;
        outputM.textContent += `${noTerminal} -> ${reglas}\n`;
    }
}

function calcularPrimero(producciones) {
    const primeros = {};
    for (const noTerminal in producciones) {
        primeros[noTerminal] = new Set();
    }

    let cambio = true;
    while (cambio) {
        cambio = false;
        for (const noTerminal in producciones) {
            const reglas = producciones[noTerminal];
            for (const regla of reglas) {
                let simbolo;
                if (regla.startsWith('id')) {
                    simbolo = 'id';
                } else {
                    simbolo = regla[0];
                }
                if (!producciones[simbolo]) {
                    if (!primeros[noTerminal].has(simbolo)) {
                        primeros[noTerminal].add(simbolo);
                        cambio = true;
                    }
                } else {
                    const oldSize = primeros[noTerminal].size;
                    for (const elem of primeros[simbolo]) {
                        primeros[noTerminal].add(elem);
                    }
                    if (primeros[noTerminal].size > oldSize) {
                        cambio = true;
                    }
                }
            }
        }
    }

    for (const noTerminal in primeros) {
        primeros[noTerminal] = Array.from(primeros[noTerminal]);
    }

    return primeros;
}

function mostrarPrimero(primeros) {
    const output = document.getElementById('output-first');
    output.innerHTML = '<tr><th>No Terminal</th><th>Primero</th></tr>';
    for (const noTerminal in primeros) {
        const row = document.createElement('tr');
        const cellNoTerminal = document.createElement('td');
        cellNoTerminal.textContent = noTerminal;
        const cellPrimero = document.createElement('td');
        cellPrimero.textContent = `{${primeros[noTerminal].join(', ')}}`;
        row.appendChild(cellNoTerminal);
        row.appendChild(cellPrimero);
        output.appendChild(row);
    }
}

function mostrarPrimeroM(primeros) {
    const output = document.getElementById('output-first-m');
    output.innerHTML = ''; 
    for (const noTerminal in primeros) {
        const resultado = `Prim(${noTerminal}): {${primeros[noTerminal].join(', ')}}`;
        output.appendChild(document.createTextNode(resultado)); 
        output.appendChild(document.createElement('br')); 
    }
}

function formatProductionsForFollow(productions) {
    let result = '';
    for (const noTerminal in productions) {
        const rules = productions[noTerminal].join(' | ').replace(/'/g, ''); 
        result += `${noTerminal} -> ${rules}\n`;
    }
    return result;
}

function calcularFollowSets() {
    const input = document.getElementById('producciones-follow');
    input.value = input.value.replace(/'/g, '');

    const lines = input.value.trim().split('\n').map(line => line.trim());

    const producciones = {};

    lines.forEach(line => {
        const [nonTerminal, rhs] = line.split('->').map(s => s.trim());
        producciones[nonTerminal] = rhs.split('|').map(s => s.trim());
    });

    const noTerminales = Object.keys(producciones);
    const primeros = {};
    const siguientes = {};

    noTerminales.forEach(v => {
        primeros[v] = new Set();
        siguientes[v] = new Set();
    });

    siguientes[noTerminales[0]].add('$');

    function calcularPrimeros(cadena) {
        const resultado = new Set();
        for (let i = 0; i < cadena.length; i++) {
            const simbolo = cadena[i];
            if (simbolo === 'ε') {
                resultado.add('ε');
                break;
            }
            if (!noTerminales.includes(simbolo)) {
                resultado.add(simbolo);
                break;
            }
            const firstSimbolo = primeros[simbolo];
            firstSimbolo.forEach(x => {
                if (x !== 'ε') resultado.add(x);
            });
            if (!firstSimbolo.has('ε')) break;
            if (i === cadena.length - 1) resultado.add('ε');
        }
        return resultado;
    }
    
    let cambios;
    do {
        cambios = false;
        noTerminales.forEach(nonTerminal => { // Ensure consistent naming here
            producciones[nonTerminal].forEach(cadena => {
                const simbolos = cadena.split('');
                const primerosCadena = calcularPrimeros(simbolos);
                primerosCadena.forEach(x => {
                    if (!primeros[nonTerminal].has(x)) { // Use nonTerminal consistently
                        primeros[nonTerminal].add(x);  // Use nonTerminal consistently
                        cambios = true;
                    }
                });
            });
        });
    } while (cambios);
    
    do {
        cambios = false;
        noTerminales.forEach(nonTerminal => { // Ensure consistent naming here
            producciones[nonTerminal].forEach(cadena => {
                const simbolos = cadena.split('');
                for (let i = 0; i < simbolos.length; i++) {
                    const simbolo = simbolos[i];
                    if (noTerminales.includes(simbolo)) {
                        const primerosBeta = calcularPrimeros(simbolos.slice(i + 1));
                        primerosBeta.forEach(x => {
                            if (x !== 'ε' && !siguientes[simbolo].has(x)) {
                                siguientes[simbolo].add(x);
                                cambios = true;
                            }
                        });
                        if (primerosBeta.has('ε') || i === simbolos.length - 1) {
                            siguientes[nonTerminal].forEach(x => { // Use nonTerminal consistently
                                if (!siguientes[simbolo].has(x)) {
                                    siguientes[simbolo].add(x);
                                    cambios = true;
                                }
                            });
                        }
                    }
                }
            });
        });
    } while (cambios);
    
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';
    const headerRow = document.createElement('tr');
    const headerNoTerminal = document.createElement('th');
    headerNoTerminal.textContent = 'No Terminal';
    const headerSiguiente = document.createElement('th');
    headerSiguiente.textContent = 'Siguiente';
    headerRow.appendChild(headerNoTerminal);
    headerRow.appendChild(headerSiguiente);
    resultados.appendChild(headerRow);
    noTerminales.forEach((nonTerminal, index) => { // Ensure consistent naming here
        const cantidadApariciones = lines.filter(line => line.startsWith(nonTerminal)).length;
        const cantidadMostrar = cantidadApariciones > 1 ? 2 : 1;
        for (let i = 0; i < cantidadMostrar; i++) {
            const row = document.createElement('tr');
            const cellNoTerminal = document.createElement('td');
            cellNoTerminal.textContent = i === 0 ? nonTerminal : nonTerminal + "'";
            const cellSiguiente = document.createElement('td');
            cellSiguiente.textContent = `{${Array.from(siguientes[nonTerminal]).join(', ')}}`; // Use nonTerminal consistently
            row.appendChild(cellNoTerminal);
            row.appendChild(cellSiguiente);
            resultados.appendChild(row);
        }
    });
    
    const outputFollowM = document.getElementById('output-follow-m');
    noTerminales.forEach(nonTerminal => { // Ensure consistent naming here
        const cantidadApariciones = lines.filter(line => line.startsWith(nonTerminal)).length;
        const cantidadMostrar = cantidadApariciones > 1 ? 2 : 1;
    
        const outputRow = document.createElement('div');
        outputRow.classList.add('output-row');
    
        for (let i = 0; i < cantidadMostrar; i++) {
            const nonTerminalText = i === 0 ? nonTerminal : nonTerminal + "'";
            const siguienteText = `{${Array.from(siguientes[nonTerminal]).join(', ')}}`; // Use nonTerminal consistently
            const pElement = document.createElement('p');
            pElement.textContent = `Sgte(${nonTerminalText}): ${siguienteText}`;
            outputRow.appendChild(pElement);
        }
        outputFollowM.appendChild(outputRow);
    });
} 

function generarTabla() {
    const produccionesInput = document.getElementById('producciones').value.trim();
    if (!produccionesInput) {
        console.error("No productions entered");
        return;
    }

    const firstInput = document.getElementById('first').value.trim();
    const followInput = document.getElementById('follow').value.trim();

    const producciones = analizarProducciones(produccionesInput);
    if (Object.keys(producciones).length === 0) {
        console.error("Failed to parse productions");
        return;
    }
    
    const first = analizarConjuntos(firstInput);
    const follow = analizarConjuntos(followInput);

    const noTerminales = Object.keys(producciones);
    const terminales = obtenerTerminales(producciones);

    const contenedor = document.getElementById('tablaM-contenedor');

    const tabla = document.createElement('table');
    tabla.setAttribute('id', 'tablaM');

    const cabecera = document.createElement('thead');
    const cuerpo = document.createElement('tbody');

    const filaEncabezado = document.createElement('tr');
    filaEncabezado.appendChild(document.createElement('th')); 
    terminales.forEach(terminal => {
        const th = document.createElement('th');
        th.textContent = terminal;
        filaEncabezado.appendChild(th);
    });
    cabecera.appendChild(filaEncabezado);

    tabla.appendChild(cabecera);

    contenedor.innerHTML = '';
    contenedor.appendChild(tabla);

    noTerminales.forEach((noTerminal, indiceFila) => {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.textContent = noTerminal;
        fila.appendChild(celda);

        setTimeout(() => { 
            terminales.forEach((terminal, indiceColumna) => {
                setTimeout(() => { 
                    const celda = document.createElement('td');
                    celda.textContent = obtenerProduccion(noTerminal, terminal, producciones, first, follow);
                    fila.appendChild(celda);
                }, 100 * indiceColumna); 
            });

            cuerpo.appendChild(fila);
        }, 200 * indiceFila); 
    });

    tabla.appendChild(cuerpo);
}


function analizarProducciones(entrada) {
    if (!entrada || typeof entrada !== 'string') {
        console.error("Invalid input for productions");
        return {};
    }
    const lineas = entrada.split('\n');
    const resultado = {};
    lineas.forEach(linea => {
        if (linea.trim() === "") return; // Skip empty lines
        const partes = linea.trim().split('->');
        if (partes.length < 2) {
            console.error("Malformed production rule:", linea);
            return;
        }
        const noTerminal = partes[0].trim();
        const producciones = partes[1].trim().split('|').map(p => p.trim());
        resultado[noTerminal] = producciones;
    });
    return resultado;
}

function analizarConjuntos(entrada) {
    const lineas = entrada.split('\n');
    const resultado = {};

    lineas.forEach(linea => {
        linea = linea.trim();
        if (!linea) return; // Skip empty lines

        const partes = linea.split(':');
        if (partes.length < 2) {
            console.error("Malformed input line:", linea);
            return;
        }

        const noTerminal = partes[0]
            .replace('Prim(', '')
            .replace('Sgte(', '')
            .replace(')', '')
            .trim();

        if (!partes[1]) {
            console.error("Missing symbols for non-terminal:", noTerminal);
            return;
        }

        const simbolos = partes[1]
            .replace('{', '')
            .replace('}', '')
            .split(',')
            .map(s => s.trim());

        resultado[noTerminal] = simbolos;
    });

    return resultado;
}


function obtenerTerminales(producciones) {
    const conjuntoTerminales = new Set();
    Object.values(producciones).flat().forEach(prod => {
        const coincidencias = prod.match(/[a-z]+|\S/g);
        if (coincidencias) {
          coincidencias.forEach(char => {
                if (!producciones[char] && char !== '\'' && char !== 'ε') {
                    conjuntoTerminales.add(char);
                }
            });
        }
    });
    conjuntoTerminales.delete('$');
    const arrayTerminales = Array.from(conjuntoTerminales).sort();
    arrayTerminales.push('$');
    return arrayTerminales;
}

function obtenerProduccion(noTerminal, terminal, producciones, first, follow) {
    const produccionesNoTerminal = producciones[noTerminal];
    const conjuntoFirst = first[noTerminal];
    const conjuntoFollow = follow[noTerminal];

    for (const produccion of produccionesNoTerminal) {
        if (produccion.startsWith(terminal)) { 
            return `${noTerminal} → ${produccion}`;
        }

        const primerSimboloProduccion = first[produccion[0]]; 
        if (primerSimboloProduccion && primerSimboloProduccion.includes(terminal)) {
            return `${noTerminal} → ${produccion}`;
        }

        if (produccion === 'ε' && conjuntoFollow.includes(terminal)) {
            return `${noTerminal} → ε`;
        }

        if (!noTerminal.includes(terminal) && terminal === produccion) {
            return `${noTerminal} → ${produccion}`;
        }
    }

    return '';
}

function alternarExplicacion() {
    const popupExplicacion = document.getElementById('popup-explicacion');
    popupExplicacion.classList.toggle('mostrar');
}

function cerrarExplicacion() {
    const popupExplicacion = document.getElementById('popup-explicacion');
    popupExplicacion.classList.remove('mostrar');
}
