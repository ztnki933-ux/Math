function resolverEcuacion() {
  const entrada = document.getElementById("ecuacion").value;
  const resultadoDiv = document.getElementById("resultado");

  try {
    const { a, b, c } = analizarEcuacion(entrada);

    if (a !== 0) {
      const soluciones = resolverSegundoGrado({ a, b, c });
      resultadoDiv.innerHTML = `Soluciones:<br>x₁ = ${soluciones.x1}<br>x₂ = ${soluciones.x2}`;
    } else if (b !== 0) {
      const x = resolverPrimerGrado({ b, c });
      resultadoDiv.innerHTML = `Solución:<br>x = ${x}`;
    } else {
      resultadoDiv.innerHTML = `Error: No hay solución válida.`;
    }
  } catch (error) {
    resultadoDiv.innerHTML = `Error: ${error.message}`;
  }
}

function analizarEcuacion(ecuacion) {
  const partes = ecuacion.split("=");
  if (partes.length !== 2) throw new Error("Formato inválido. Usa '=' para separar.");

  const izquierda = partes[0].trim();
  const derecha = partes[1].trim();

  // Convertimos ambos lados en términos algebraicos
  const izquierdaT = convertirATerminos(izquierda);
  const derechaT = convertirATerminos(derecha);

  // Movemos todos los términos al lado izquierdo
  const todos = izquierdaT.concat(derechaT.map(t => ({ ...t, coef: -t.coef })));

  // Agrupamos por tipo
  let a = 0, b = 0, c = 0;
  todos.forEach(t => {
    if (t.tipo === "x2") a += t.coef;
    else if (t.tipo === "x1") b += t.coef;
    else c += t.coef;
  });

  return { a, b, c };
}

function convertirATerminos(expresion) {
  const expr = expresion.replace(/\s+/g, "")
                        .replace(/-/g, "+-")
                        .replace(/x\^2/g, "x2")
                        .replace(/x(?!\d)/g, "x1");

  const partes = expr.split("+").filter(p => p);
  const terminos = [];

  partes.forEach(p => {
    if (p.includes("x2")) {
      const coef = p.replace("x2", "");
      terminos.push({ tipo: "x2", coef: parseFloat(coef || "1") });
    } else if (p.includes("x1")) {
      const coef = p.replace("x1", "");
      terminos.push({ tipo: "x1", coef: parseFloat(coef || "1") });
    } else {
      terminos.push({ tipo: "const", coef: parseFloat(p) });
    }
  });

  return terminos;
}

function resolverSegundoGrado({ a, b, c }) {
  const discriminante = b * b - 4 * a * c;
  if (discriminante < 0) throw new Error("No hay soluciones reales.");

  const x1 = (-b + Math.sqrt(discriminante)) / (2 * a);
  const x2 = (-b - Math.sqrt(discriminante)) / (2 * a);
  return { x1, x2 };
}

function resolverPrimerGrado({ b, c }) {
  return -c / b;
}
