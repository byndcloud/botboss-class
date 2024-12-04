/* Funções */
function isOdd(number) {
  return number % 2 !== 0 // strict equality, testa o tipo e o valor
}

console.log(0 == false) // true
console.log(0 === false) // false

// Função principal
function calcularRetangulo(largura, altura) {
    // Função para calcular a área
    function calcularArea() {
        return largura * altura;
    }

    // Função para calcular o perímetro
    function calcularPerimetro() {
        return 2 * (largura + altura);
    }

    // Retorna um objeto com os resultados
    return {
        area: calcularArea(),
        perimetro: calcularPerimetro()
    };
}

// Exemplo de uso
const largura = 5;
const altura = 3;

const resultado = calcularRetangulo(largura, altura);

console.log(`Área: ${resultado.area}`); // Área: 15
console.log(`Perímetro: ${resultado.perimetro}`); // Perímetro: 16
