/**
 * math.js — funções matemáticas puras
 * Calculadora de Potências Modulares · Helen Daiane / ProfMat UEM 2026
 */

/** Máximo divisor comum (algoritmo de Euclides) */
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/** Função totiente de Euler φ(n) */
export function phi(n) {
  let result = n;
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    if (x % p === 0) {
      while (x % p === 0) x = Math.floor(x / p);
      result -= Math.floor(result / p);
    }
  }
  if (x > 1) result -= Math.floor(result / x);
  return result;
}

/** Exponenciação modular rápida: base^exp mod m */
export function modPow(base, exp, mod) {
  let result = 1;
  base = ((base % mod) + mod) % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

/**
 * Calcula a^b mod n usando o Teorema de Euler quando mdc(a,n)=1,
 * ou exponenciação modular rápida no caso geral.
 *
 * @returns {{ error: string }
 *          | { canUseEuler: true,  phi: number, reducedExp: number, result: number, steps: string[] }
 *          | { canUseEuler: false, result: number, steps: string[] }}
 */
export function eulerModPower(a, b, n) {
  if (n <= 0) return { error: "O módulo deve ser maior que zero." };
  if (b < 0)  return { error: "Este app não trata expoentes negativos." };

  const d = gcd(a, n);
  const steps = [`mdc(${a}, ${n}) = ${d}`];

  if (d === 1) {
    const phiN = phi(n);
    const reducedExp = b % phiN;
    steps.push(`φ(${n}) = ${phiN}`);
    steps.push(`${b} mod φ(${n}) = ${reducedExp}`);
    steps.push(`${a}^${b} ≡ ${a}^${reducedExp} (mod ${n})`);
    const result = modPow(a, reducedExp, n);
    steps.push(`Resultado final = ${result}`);
    return { canUseEuler: true, phi: phiN, reducedExp, result, steps };
  }

  const result = modPow(a, b, n);
  steps.push("O Teorema de Euler não se aplica diretamente (não são coprimos).");
  steps.push("Usada exponenciação modular rápida clássica.");
  steps.push(`Resultado final = ${result}`);
  return { canUseEuler: false, result, steps };
}
