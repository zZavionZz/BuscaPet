const STORAGE_KEY = 'buscapet_animais_mvp';
const JSON_FILE = 'animais.json';

let animais = [];

const form = document.getElementById('animal-form');
const listaAnimaisEl = document.getElementById('lista-animais');
const listaVaziaEl = document.getElementById('lista-vazia');
const listaInfoEl = document.getElementById('lista-info');
const formMessageEl = document.getElementById('form-message');
const temColeiraSelect = document.getElementById('temColeira');
const nomeNaColeiraInput = document.getElementById('nomeNaColeira');
const fotoInput = document.getElementById('foto');
const castradoSelect = document.getElementById('castrado');
const sexoSelect = document.getElementById('sexo');
const porteSelect = document.getElementById('porte');
const descricaoInput = document.getElementById('descricaoAparencia');
const estaComCachorroSelect = document.getElementById('estaComCachorro');
const ultimoLugarInput = document.getElementById('ultimoLugarEncontrado');

function showMessage(text, type) {
  formMessageEl.textContent = text;
  formMessageEl.className = 'form-message ' + type;
  setTimeout(() => {
    formMessageEl.textContent = '';
    formMessageEl.className = 'form-message';
  }, 4000);
}

function handleColeiraChange() {
  if (temColeiraSelect.value === 'true') {
    nomeNaColeiraInput.disabled = false;
  } else {
    nomeNaColeiraInput.disabled = true;
    nomeNaColeiraInput.value = '';
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.animais)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Erro ao ler localStorage:', error);
    showMessage('Erro ao ler dados salvos localmente. Tentando carregar do arquivo JSON.', 'error');
    return null;
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ animais: animais }));
    return true;
  } catch (error) {
    console.error('Erro ao gravar localStorage:', error);
    showMessage('Erro ao salvar no localStorage. Os dados não serão persistidos neste navegador.', 'error');
    return false;
  }
}

async function loadFromJson() {
  try {
    const response = await fetch(JSON_FILE, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error('Não foi possível carregar ' + JSON_FILE);
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.animais)) {
      throw new Error('Formato inválido do JSON');
    }
    return data;
  } catch (error) {
    console.error('Erro ao carregar JSON:', error);
    showMessage('Não foi possível carregar animais.json. Iniciando com lista vazia.', 'error');
    return { animais: [] };
  }
}

function getMaxId() {
  if (animais.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < animais.length; i++) {
    if (animais[i].id > max) {
      max = animais[i].id;
    }
  }
  return max;
}

function renderAnimais() {
  listaAnimaisEl.innerHTML = '';

  if (animais.length === 0) {
    listaVaziaEl.hidden = false;
    listaInfoEl.textContent = '';
    return;
  }

  listaVaziaEl.hidden = true;
  listaInfoEl.textContent = 'Total: ' + animais.length + ' animal(is) cadastrado(s).';

  for (let i = 0; i < animais.length; i++) {
    const animal = animais[i];
    const card = document.createElement('article');
    card.className = 'card';

    let fotoHtml;
    if (animal.foto && animal.foto.trim() !== '') {
      fotoHtml = '<img class="card-imagem" src="' + escapeHtml(animal.foto) + '" alt="Foto do animal" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">';
      fotoHtml += '<div class="card-imagem-placeholder" style="display:none;">Sem foto</div>';
    } else {
      fotoHtml = '<div class="card-imagem-placeholder">Sem foto</div>';
    }

    const temColeira = animal.temColeira ? 'Sim' : 'Não';
    const nomeNaColeira = (animal.temColeira && animal.nomeNaColeira && animal.nomeNaColeira.trim() !== '') ? animal.nomeNaColeira : 'Não informado';
    const castrado = animal.castrado === true ? 'Sim' : animal.castrado === false ? 'Não' : 'Não sei';
    const sexo = animal.sexo === 'M' ? 'Macho (M)' : 'Fêmea (F)';
    const estaComCachorro = animal.estaComCachorro ? 'Sim' : 'Não';

    card.innerHTML = fotoHtml +
      '<div class="card-conteudo">' +
      '<h3 class="card-titulo">Animal #' + escapeHtml(String(animal.id)) + '</h3>' +
      '<div class="card-info"><strong>Sexo:</strong> <span>' + escapeHtml(sexo) + '</span></div>' +
      '<div class="card-info"><strong>Porte:</strong> <span>' + escapeHtml(animal.porte) + '</span></div>' +
      '<div class="card-info"><strong>Tem coleira:</strong> <span>' + escapeHtml(temColeira) + '</span></div>' +
      '<div class="card-info"><strong>Nome na coleira:</strong> <span>' + escapeHtml(nomeNaColeira) + '</span></div>' +
      '<div class="card-info"><strong>Castrado:</strong> <span>' + escapeHtml(castrado) + '</span></div>' +
      '<div class="card-info"><strong>Está com cachorro:</strong> <span>' + escapeHtml(estaComCachorro) + '</span></div>' +
      '<div class="card-info"><strong>Último lugar encontrado:</strong> <span>' + escapeHtml(animal.ultimoLugarEncontrado) + '</span></div>' +
      '<div class="card-descricao"><strong>Descrição da aparência:</strong><p>' + escapeHtml(animal.descricaoAparencia) + '</p></div>' +
      '</div>';

    listaAnimaisEl.appendChild(card);
  }
}

function escapeHtml(text) {
  if (text === null || text === undefined) {
    return '';
  }
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const foto = fotoInput.value.trim();
  const temColeira = temColeiraSelect.value === 'true';
  let nomeNaColeira = nomeNaColeiraInput.value.trim();
  const castradoStr = castradoSelect.value;
  const sexo = sexoSelect.value;
  const porte = porteSelect.value;
  const descricaoAparencia = descricaoInput.value.trim();
  const estaComCachorro = estaComCachorroSelect.value === 'true';
  const ultimoLugarEncontrado = ultimoLugarInput.value.trim();

  if (sexo === '') {
    showMessage('Sexo é obrigatório.', 'error');
    sexoSelect.focus();
    return;
  }
  if (porte === '') {
    showMessage('Porte é obrigatório.', 'error');
    porteSelect.focus();
    return;
  }
  if (descricaoAparencia === '') {
    showMessage('Descrição da aparência é obrigatória.', 'error');
    descricaoInput.focus();
    return;
  }
  if (ultimoLugarEncontrado === '') {
    showMessage('Último lugar encontrado é obrigatório.', 'error');
    ultimoLugarInput.focus();
    return;
  }

  if (!temColeira) {
    nomeNaColeira = '';
  }

  let castrado;
  if (castradoStr === 'true') {
    castrado = true;
  } else if (castradoStr === 'false') {
    castrado = false;
  } else if (castradoStr === 'null') {
    castrado = null;
  } else {
    castrado = null;
  }

  const novoAnimal = {
    id: getMaxId() + 1,
    foto: foto === '' ? null : foto,
    temColeira: temColeira,
    nomeNaColeira: temColeira && nomeNaColeira !== '' ? nomeNaColeira : null,
    castrado: castrado,
    sexo: sexo,
    porte: porte,
    descricaoAparencia: descricaoAparencia,
    estaComCachorro: estaComCachorro,
    ultimoLugarEncontrado: ultimoLugarEncontrado
  };

  animais.push(novoAnimal);
  saveToLocalStorage();
  renderAnimais();
  form.reset();
  handleColeiraChange();
  showMessage('Animal cadastrado com sucesso!', 'success');
});

temColeiraSelect.addEventListener('change', handleColeiraChange);
window.addEventListener('load', async function () {
  handleColeiraChange();
  const localData = loadFromLocalStorage();
  if (localData) {
    animais = localData.animais.slice();
    renderAnimais();
    return;
  }
  const jsonData = await loadFromJson();
  animais = jsonData.animais.slice();
  saveToLocalStorage();
  renderAnimais();
});