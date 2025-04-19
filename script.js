const chefeId = 6; // Charizard
let chefe = {};
let ranking = [];

async function buscarPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return {
    nome: data.name,
    tipo: data.types[0].type.name,
    imagem: data.sprites.front_default,
    poder: data.stats[1].base_stat // attack
  };
}

async function gerarDesafiante() {
  const idAleatorio = Math.floor(Math.random() * 151) + 1;
  return await buscarPokemon(idAleatorio);
}

function atualizarUI(pokemon, prefixo) {
  document.getElementById(`img-${prefixo}`).src = pokemon.imagem;
  document.getElementById(`nome-${prefixo}`).textContent = pokemon.nome;
  document.getElementById(`tipo-${prefixo}`).textContent = `Tipo: ${pokemon.tipo}`;
}

function simularBatalha(chefe, desafiante) {
  const chance = desafiante.poder / (chefe.poder + desafiante.poder);
  return Math.random() < chance;
}

function efeitoVisual() {
  document.body.style.backgroundColor = "#ffe066";
  setTimeout(() => {
    document.body.style.backgroundColor = "#f0f4f8";
  }, 300);
}

function tocarSom() {
  const som = document.getElementById("som-ataque");
  som.play();
}

function atualizarRanking(nome) {
  ranking.push(nome);
  const rankingEl = document.getElementById("ranking");
  rankingEl.innerHTML =
    "<h3>Ranking de Vencedores:</h3><ol>" +
    ranking.map(p => `<li>${p}</li>`).join("") +
    "</ol>";
}

async function iniciarBatalha() {
  const desafiante = await gerarDesafiante();
  atualizarUI(chefe, "chefe");
  atualizarUI(desafiante, "desafiante");

  efeitoVisual();
  tocarSom();

  const venceu = simularBatalha(chefe, desafiante);
  const resultado = venceu ? "Vitória do Desafiante!" : "O Chefe venceu!";

  const resultadoEl = document.getElementById("resultado");
  resultadoEl.textContent = resultado;
  resultadoEl.style.color = venceu ? "green" : "red";

  if (venceu) {
    atualizarRanking(desafiante.nome);
  }
}

document.getElementById("update-btn").addEventListener("click", iniciarBatalha);

async function init() {
  chefe = await buscarPokemon(chefeId);
  atualizarUI(chefe, "chefe");
}

init();
