// Variáveis globais
let jogadores = [];
let ordemJogadores = [];
let temaAtual = "";
let jogadorAtual = 0;
let julgadorAtual = 0;
let letraAtual = "";
let timer;
let tempoRestante = 60;
let tempoTotal = 60;
let jogadoresInativos = [];
let letrasComErro = {};
let tempoPausado = 0;
let letrasBloqueadas = [];
let jogoPausado = false;

// Temas
const temas = [
    "Animais",
    "Frutas",
    "Países",
    "Cores",
    "Filmes"
];

// Paletas de cores
const paletasDeCores = {
    "arcoiris": {
        "--cor-primaria": "#ed5672",
        "--cor-secundaria": "#160e32",
        "--cor-terciaria": "#cdbb93",
        "--cor-texto": "#574435",
        "--cor-erro": "#fbc599"

        
    },
    "floresta": {
        "--cor-primaria": "#300511",
        "--cor-secundaria": "#b3544f",
        "--cor-terciaria": "#d6c396",
        "--cor-texto": "#e7fccf",
        "--cor-erro": "#1f0b0c"

    },
    "doce": {
        "--cor-primaria": "#FF4081",
        "--cor-secundaria": "#FFFACD",
        "--cor-terciaria": "#FFDAB9",
        "--cor-texto": "#800080",
        "--cor-erro": "#C71585"
    },
    "mar": {
        "--cor-primaria": "#300511",
        "--cor-secundaria": "#4682B4",
        "--cor-terciaria": "#d6c396",
        "--cor-texto": "#e7fccf",
        "--cor-erro": "#1f0b0c"

    },
    "espaco": {
        "--cor-primaria": "#ada241",
        "--cor-secundaria": "#a13866",
        "--cor-terciaria": "#381c30",
        "--cor-texto": "#a4f7d4",
        "--cor-erro": "#9ae07d"

    },
    "safari": {
        "--cor-primaria": "#d9d4a8",
        "--cor-secundaria": "#5c374b",
        "--cor-terciaria": "#cc3747",
        "--cor-texto": "#d15c57",
        "--cor-erro": "#d9d4a8"

    },
    "circo": {
        "--cor-primaria": "#9400D3",
        "--cor-secundaria": "#FFF5EE",
        "--cor-terciaria": "#D0B4DE",
        "--cor-texto": "#FF1493",
        "--cor-erro": "#FF0000"
    },
    "gelo": {
        "--cor-primaria": "#2f2e30",
        "--cor-secundaria": " #e84b2c",
        "--cor-terciaria": " #e6d839",
        "--cor-texto": "#2f2e30",
        "--cor-erro": "#2f2e30"

    },
    "fazenda": {
        "--cor-primaria": "#f9ebc4",
        "--cor-secundaria": "#fc2f68",
        "--cor-terciaria": "#ffb391",
        "--cor-texto": "#472f5f",
        "--cor-erro": "#08295e"
    },
    "construcao": {
        "--cor-primaria": "#000000",
        "--cor-secundaria": "#7890a8",
        "--cor-terciaria": "#304878",
        "--cor-texto": "#181848",
        "--cor-erro": "#f0a818"

    }
};

// Funções auxiliares
const sortearTema = () => temas[Math.floor(Math.random() * temas.length)];
const sortearOrdemJogadores = (jogadores) => jogadores.sort(() => Math.random() - 0.5);
const validarNomeJogador = (input) => input.value = input.value.replace(/[^A-Za-z]+/g, '');

// Aplica o tema de cores
const aplicarTemaCores = (tema) => {
    const paleta = paletasDeCores[tema];
    if (paleta) {
        Object.keys(paleta).forEach(cor => {
            document.documentElement.style.setProperty(cor, paleta[cor]);
        });
    }
};

// Cria campos para nomes dos jogadores
const criarCamposNomes = (quantidade) => {
    const camposNomes = document.getElementById('camposNomes');
    camposNomes.innerHTML = '';
    for (let i = 1; i <= quantidade; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nome do Jogador ${i}`;
        input.required = true;
        input.setAttribute('oninput', 'validarNomeJogador(this)');
        camposNomes.appendChild(input);
    }
};

// Atualiza a lista de jogadores (ativos e inativos)
const atualizarListaJogadores = () => {
    const listaJogadores = document.getElementById('listaJogadores');
    listaJogadores.innerHTML = '';

    jogadores.forEach(jogador => {
        const li = document.createElement('li');
        li.textContent = jogador;
        if (jogadoresInativos.includes(jogador)) {
            li.classList.add('inativo');
        }
        listaJogadores.appendChild(li);
    });
};

// Atualiza a transparência das letras
const desbloquearLetras = () => {
    document.querySelectorAll('.alfabeto button').forEach(botao => {
        if (!botao.classList.contains('erro') && !letrasBloqueadas.includes(botao.textContent)) {
            botao.disabled = false;
            botao.style.opacity = '';
        } else {
            botao.style.opacity = '0.5';
        }
    });
};

// Bloqueia todas as letras
const bloquearLetras = () => {
    document.querySelectorAll('.alfabeto button').forEach(botao => {
        botao.disabled = true;
    });
};

// Funções de tempo
const iniciarTimer = () => {
    if (jogoPausado) return;

    const contadorTempo = document.getElementById('contadorTempo');
    const barraTempo = document.getElementById('barraTempo');
    const timerElement = document.querySelector('.timer');

    contadorTempo.textContent = tempoRestante;
    barraTempo.style.width = `${(tempoRestante / tempoTotal) * 100}%`;
    timerElement.classList.remove('metade-tempo');

    timer = setInterval(() => {
        if (jogoPausado) return;

        tempoRestante--;
        contadorTempo.textContent = tempoRestante;
        barraTempo.style.width = `${(tempoRestante / tempoTotal) * 100}%`;

        if (tempoRestante <= tempoTotal / 2) {
            timerElement.classList.add('metade-tempo');
        }

        if (tempoRestante <= 0) {
            clearInterval(timer);
            const jogadorAtualNome = ordemJogadores[jogadorAtual];
            jogadoresInativos.push(jogadorAtualNome);
            atualizarListaJogadores();
            if (jogadores.length - jogadoresInativos.length === 1) {
                const vencedor = jogadores.find(jogador => !jogadoresInativos.includes(jogador));
                exibirMensagemVitoria(vencedor);
            } else {
                exibirMensagemEliminacao(jogadorAtualNome);
            }
            pausarJogo();
        }
    }, 1000);
};

const pararTimer = () => clearInterval(timer);

// Funções de mensagem
const exibirMensagemEliminacao = (nomeJogador) => {
    document.getElementById('jogadorEliminadoNome').textContent = `${nomeJogador} está fora desta partida!`;
    document.getElementById('mensagemEliminacao').style.display = 'block';
    pausarJogo();
};

const exibirMensagemVitoria = (nomeVencedor) => {
    document.getElementById('jogadorVencedorNome').textContent = `${nomeVencedor} VENCEU A PARTIDA!!!`;
    document.getElementById('mensagemVitoria').style.display = 'block';
    pausarJogo();
};

// Funções de controle do jogo
const pausarJogo = () => {
    jogoPausado = true;
    pararTimer();
};

const continuarJogo = () => {
    document.getElementById('mensagemEliminacao').style.display = 'none';
    jogoPausado = false;
    proximaJogada();
};

const iniciarJogo = () => {
    const quantidadeJogadoresSelecionada = document.querySelector('input[name="quantidadeJogadores"]:checked');
    const quantidadeJogadores = quantidadeJogadoresSelecionada ? parseInt(quantidadeJogadoresSelecionada.value) : 2;

    jogadores = [];
    const inputsNomes = document.querySelectorAll('#camposNomes input');
    inputsNomes.forEach(input => {
        if (input.value.trim()) {
            jogadores.push(input.value.trim());
        }
    });

    if (jogadores.length < 2) {
        alert("É necessário pelo menos 2 jogadores.");
        return;
    }
    if (jogadores.length !== quantidadeJogadores) {
        alert(`Por favor, insira o nome para todos os ${quantidadeJogadores} jogadores.`);
        return;
    }

    ordemJogadores = sortearOrdemJogadores(jogadores);
    jogadorAtual = 0;

    const tempoSelecionado = document.querySelector('input[name="tempoJogo"]:checked');
    tempoTotal = tempoSelecionado ? parseInt(tempoSelecionado.value) : 60;
    tempoRestante = tempoTotal;

    letrasBloqueadas = [];
    jogadoresInativos = [];

    atualizarListaJogadores();
    desbloquearLetras();

    document.getElementById('telaInicial').style.display = 'none';
    document.getElementById('telaJogo').style.display = 'block';

    temaAtual = sortearTema();
    document.getElementById('temaSorteado').textContent = `Tema Sorteado: ${temaAtual}`;

    // Obter o tema de cores selecionado
    const temaCoresSelecionado = document.getElementById('temaCores').value;
    aplicarTemaCores(temaCoresSelecionado);

    jogoPausado = false;
    proximaJogada();
};

const reiniciarJogo = () => {
    temaAtual = sortearTema();
    document.getElementById('temaSorteado').textContent = `Tema Sorteado: ${temaAtual}`;

    letrasBloqueadas = [];
    jogadoresInativos = [];

    ordemJogadores = sortearOrdemJogadores(jogadores);
    jogadorAtual = 0;

    desbloquearLetras();

    const tempoSelecionado = document.querySelector('input[name="tempoJogo"]:checked');
    tempoTotal = tempoSelecionado ? parseInt(tempoSelecionado.value) : 60;
    tempoRestante = tempoTotal;

    atualizarListaJogadores();

    document.getElementById('mensagemVitoria').style.display = 'none';
    jogoPausado = false;

    // Obter o tema de cores selecionado
    const temaCoresSelecionado = document.getElementById('temaCores').value;
    aplicarTemaCores(temaCoresSelecionado);

    proximaJogada();
};

const proximaJogada = () => {
    do {
        jogadorAtual = (jogadorAtual + 1) % ordemJogadores.length;
    } while (jogadoresInativos.includes(ordemJogadores[jogadorAtual]) && jogadoresInativos.length < jogadores.length);

    if (jogadoresInativos.length === jogadores.length) {
        return;
    }

    pararTimer();
    tempoRestante = tempoTotal;
    iniciarTimer();

    document.querySelector('.timer').classList.remove('metade-tempo');
    document.getElementById('vezDoJogador').textContent = `VEZ DO JOGADOR: ${ordemJogadores[jogadorAtual]}`;
    desbloquearLetras();

    document.querySelectorAll('.alfabeto button').forEach(botao => {
        botao.onclick = () => {
            letraAtual = botao.textContent;
            botao.disabled = true;

            pararTimer();
            bloquearLetras();
            tempoPausado = tempoRestante;

            do {
                julgadorAtual = Math.floor(Math.random() * jogadores.length);
            } while (julgadorAtual === jogadorAtual || jogadoresInativos.includes(jogadores[julgadorAtual]));

            document.getElementById('mensagemJulgamento').textContent = `${jogadores[julgadorAtual]}, você aceita a palavra para a letra ${letraAtual}?`;
            document.getElementById('julgamento').style.display = 'block';
        };
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const quantidadePadrao = document.querySelector('input[name="quantidadeJogadores"]:checked').value;
    criarCamposNomes(parseInt(quantidadePadrao));

    // Obter o tema de cores selecionado e aplicar ao carregar a página
    const temaCoresSelecionado = document.getElementById('temaCores').value;
    aplicarTemaCores(temaCoresSelecionado);

    // Adiciona um ouvinte de evento para cada botão de rádio de quantidade de jogadores
    document.querySelectorAll('input[name="quantidadeJogadores"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const quantidadeSelecionada = document.querySelector('input[name="quantidadeJogadores"]:checked').value;
            criarCamposNomes(parseInt(quantidadeSelecionada));
        });
    });
});

document.getElementById('fecharMensagemEliminacao').addEventListener('click', continuarJogo);
document.getElementById('fecharMensagemVitoria').addEventListener('click', reiniciarJogo);
document.getElementById('iniciarJogo').addEventListener('click', iniciarJogo);

document.getElementById('aceitar').addEventListener('click', () => {
    document.getElementById('julgamento').style.display = 'none';
    document.getElementById('mensagemJulgamento').textContent = `O JOGADOR ${jogadores[julgadorAtual]} ACEITOU a palavra.`;

    letrasBloqueadas.push(letraAtual);

    const botaoLetra = Array.from(document.querySelectorAll('.alfabeto button')).find(botao => botao.textContent === letraAtual);
    if (botaoLetra) {
        botaoLetra.disabled = true;
        botaoLetra.style.opacity = '0.5';
    }

    proximaJogada();
});

document.getElementById('recusar').addEventListener('click', () => {
    document.getElementById('julgamento').style.display = 'none';
    document.getElementById('mensagemJulgamento').textContent = `O JOGADOR ${jogadores[julgadorAtual]} RECUSOU a palavra.`;

    desbloquearLetras();

    tempoRestante = tempoPausado;
    iniciarTimer();
});