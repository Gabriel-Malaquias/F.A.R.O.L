// ============================================================================
// 1. NAVEGAÇÃO ENTRE AS ABAS DO SISTEMA F.A.R.O.L.
// ============================================================================
function trocarTela(telaAlvo) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`tela-${telaAlvo}`).classList.add('ativa');
    document.getElementById(`btn-${telaAlvo}`).classList.add('active');
}

// ============================================================================
// 2. ESTADO DO SISTEMA E DICIONÁRIO DE ANÁLISE SEMÂNTICA
// ============================================================================
let totalAlertas = 2;
let totalModerados = 1;
let totalSeveros = 1;
let totalSessoes = 18;

// Palavras-chave monitoradas pelo algoritmo de triagem
const palavrasRiscoSevero = [
    'suicidio', 'suicídio', 'morrer', 'morte', 'desespero', 'socorro', 
    'nao aguento mais', 'não aguento mais', 'acabar com tudo', 'crise severa', 'machucar'
];

const palavrasRiscoModerado = [
    'ansioso', 'ansiosa', 'ansiedade', 'depressao', 'depressão', 'triste', 
    'isolado', 'isolada', 'sozinho', 'sozinha', 'angustia', 'angústia', 'medo', 'pressão', 'falhar'
];

// ============================================================================
// 3. MOTOR DE CHAT E TRIAGEM AUTOMATIZADA
// ============================================================================
function enviarMensagem(event) {
    event.preventDefault();
    const input = document.getElementById('input-mensagem');
    const textoUsuario = input.value.trim();

    if (textoUsuario === '') return;

    // 1. Exibe a mensagem do estudante no Porto Seguro
    adicionarBolhaMensagem(textoUsuario, 'usuario');
    input.value = '';

    // 2. Processa a análise semântica simulando tempo de resposta
    setTimeout(() => {
        processarTriagemFarol(textoUsuario);
    }, 700);
}

// Atalho para os botões de simulação rápida no Mundo SENAI
function enviarAtalho(textoPronto) {
    const input = document.getElementById('input-mensagem');
    input.value = textoPronto;
    enviarMensagem(new Event('submit'));
}

function adicionarBolhaMensagem(texto, tipo) {
    const areaMensagens = document.getElementById('chat-messages');
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('mensagem', tipo);

    const horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    divMensagem.innerHTML = `
        <div class="msg-conteudo">${texto}</div>
        <span class="msg-hora">${horarioAtual}</span>
    `;

    areaMensagens.appendChild(divMensagem);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

function processarTriagemFarol(texto) {
    const textoMinusculo = texto.toLowerCase();
    let nivelDetectado = 'normal';

    // 1. Verifica padrão de Risco Severo (Sinal Vermelho)
    for (let palavra of palavrasRiscoSevero) {
        if (textoMinusculo.includes(palavra)) {
            nivelDetectado = 'severo';
            break;
        }
    }

    // 2. Verifica padrão de Risco Moderado (Sinal Âmbar)
    if (nivelDetectado === 'normal') {
        for (let palavra of palavrasRiscoModerado) {
            if (textoMinusculo.includes(palavra)) {
                nivelDetectado = 'moderado';
                break;
            }
        }
    }

    // 3. Resposta empática ao aluno + Emissão de Sinal para a Torre de Monitoramento
    if (nivelDetectado === 'severo') {
        adicionarBolhaMensagem(
            "🚨 O F.A.R.O.L. está aqui consigo. Sinto muito que esteja a passar por uma tempestade tão difícil, mas a sua vida importa imenso. Acabei de emitir um sinal prioritário para a nossa rede de proteção cuidar de si com total respeito e sigilo.",
            'sistema'
        );
        emitirSinalParaTorre(
            'Vulnerabilidade crítica / Angústia severa detectada na triagem',
            '🔴 Sinal Vermelho (Severo)',
            'severo',
            '<strong>Acionar Psicologia Escolar + Intervenção do Conselho Tutelar</strong>'
        );
    } else if (nivelDetectado === 'moderado') {
        adicionarBolhaMensagem(
            "🟡 Obrigado por confiar no F.A.R.O.L. É normal sentir que o mar está agitado diante de tantas cobranças. Respire fundo, este espaço é seguro. Quer contar-me um pouco mais sobre o que tem tirado a sua paz?",
            'sistema'
        );
        emitirSinalParaTorre(
            'Indicadores semânticos de ansiedade, pressão ou isolamento silencioso',
            '🟡 Sinal Âmbar (Moderado)',
            'moderado',
            'Acompanhamento Pedagógico Preventivo / Roda de Acolhimento'
        );
    } else {
        adicionarBolhaMensagem(
            "Estou a ouvir com total atenção e resguardo. Continue a partilhar como se tem sentido na sua rotina escolar.",
            'sistema'
        );
    }
}

// ============================================================================
// 4. ATUALIZAÇÃO DA TORRE DE MONITORAMENTO (SEM EXPOR O TEXTO DO ALUNO)
// ============================================================================
function emitirSinalParaTorre(padraoDetectado, textoSinal, classeNivel, protocoloAcao) {
    totalAlertas++;
    if (classeNivel === 'severo') {
        totalSeveros++;
        document.getElementById('kpi-severos').innerText = totalSeveros;
    } else {
        totalModerados++;
        document.getElementById('kpi-moderados').innerText = totalModerados;
    }

    // Atualiza o contador no menu superior
    document.getElementById('contador-alertas').innerText = totalAlertas;

    // Adiciona o registo na tabela da Torre de Monitoramento
    const tabela = document.getElementById('lista-alertas');
    const novaLinha = document.createElement('tr');
    const codigoAleatorio = Math.floor(403 + Math.random() * 500);
    const horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    novaLinha.innerHTML = `
        <td><strong>#SINAL-${codigoAleatorio}</strong><br><small>Agora, ${horarioAtual}</small></td>
        <td>Ensino Médio / Técnico</td>
        <td>${padraoDetectado}</td>
        <td><span class="tag-risco ${classeNivel}">${textoSinal}</span></td>
        <td>${protocoloAcao}</td>
    `;

    tabela.insertBefore(novaLinha, tabela.firstChild);
}

// Gera novo Hash de sessão para provar o anonimato aos visitantes do Mundo SENAI
function reiniciarChat() {
    const codigoAleatorio = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('id-sessao').innerText = `#FRL-${codigoAleatorio}-X`;

    totalSessoes++;
    document.getElementById('kpi-sessoes').innerText = totalSessoes;

    const areaMensagens = document.getElementById('chat-messages');
    areaMensagens.innerHTML = `
        <div class="mensagem sistema">
            <div class="msg-conteudo">
                🔄 Novo Hash Criptográfico gerado! O histórico anterior foi descartado com sucesso. Bem-vindo(a) ao seu Porto Seguro no <strong>F.A.R.O.L.</strong> Como posso acolher você agora?
            </div>
            <span class="msg-hora">Agora</span>
        </div>
    `;
}