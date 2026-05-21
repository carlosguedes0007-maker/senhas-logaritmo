// ============================================
// HACKER TEST — Probabilidade & Logaritmo
// Script Principal
// ============================================

// === 1. LÓGICA DO DICIONÁRIO ===
const bancoDeSignificados = {
    'probabilidade': "A chance de um hacker acertar sua senha no primeiro 'chute'. Se sua senha tem 1 milhão de combinações possíveis, a probabilidade do hacker acertar de primeira é de 1 em 1 milhão (uma fração muito próxima de zero).",

    'entropia': "A Entropia é a medida da 'incerteza', calculada através do logaritmo da probabilidade. Na segurança, não importa se sua senha é 'bonita', importa quantos bits de entropia ela tem. Cada vez que a entropia ganha 1 bit, o tempo de quebra dobra.",

    'bit': "A palavra 'Bit' vem de Binary Digit (Dígito Binário). É a menor unidade de informação. No nosso cálculo, cada 1 bit a mais de entropia significa que o número de tentativas que o computador do hacker precisa testar acabou de dobrar!",

    'forca-bruta': "Um ataque onde o computador tenta adivinhar a senha testando todas as combinações possíveis em alta velocidade (aaaa, aaab, aaac...).",

    'logaritmo': "O Logaritmo (na base 2) faz o caminho inverso da potência. Ele pega o número gigantesco de combinações totais geradas pela probabilidade e descobre qual é o expoente (os Bits) que gerou aquele monstro."
};

const palavrasChave = document.querySelectorAll('.palavra-chave');
const painelDicionario = document.getElementById('painelDicionario');
const tituloDicionario = document.getElementById('tituloDicionario');
const textoDicionario = document.getElementById('textoDicionario');

let dicionarioTimeout = null;

palavrasChave.forEach(palavra => {
    palavra.addEventListener('dblclick', function () {
        const termo = this.getAttribute('data-termo');
        const significado = bancoDeSignificados[termo];

        tituloDicionario.innerText = "// " + this.innerText;
        textoDicionario.innerHTML = significado;
        painelDicionario.style.display = 'block';

        // Limpa timeout anterior se existir
        if (dicionarioTimeout) clearTimeout(dicionarioTimeout);

        // Oculta o dicionário automaticamente após 15 segundos
        dicionarioTimeout = setTimeout(() => {
            painelDicionario.style.display = 'none';
        }, 15000);
    });
});


// === 2. LÓGICA DA MATEMÁTICA E PROBABILIDADE ===
const inputSenha = document.getElementById('senha');
const divResultado = document.getElementById('resultado');
const divTempo = document.getElementById('tempoCracking');
const painelProfessor = document.getElementById('painelProfessor');
const passoAPasso = document.getElementById('passoAPasso');
const strengthBar = document.getElementById('strengthBar');

if (inputSenha) {
    inputSenha.addEventListener('input', calcularEntropia);
}

function formatarNumero(num) {
    if (num > 1e18) return num.toExponential(2);
    return num.toLocaleString('pt-BR');
}

function calcularEntropia() {
    if (!inputSenha || !divResultado || !divTempo || !painelProfessor || !passoAPasso) return;

    const senha = inputSenha.value;
    const L = senha.length;
    let R = 0;

    if (L === 0) {
        divResultado.innerText = "Entropia: 0 bits";
        divTempo.innerText = "Digite algo para testar...";
        painelProfessor.style.display = "none";
        painelDicionario.style.display = 'none';
        updateStrengthBar(0);
        return;
    }

    painelProfessor.style.display = "block";

    let tipos = [];
    if (/[a-z]/.test(senha)) { R += 26; tipos.push("Minúsculas"); }
    if (/[A-Z]/.test(senha)) { R += 26; tipos.push("Maiúsculas"); }
    if (/[0-9]/.test(senha)) { R += 10; tipos.push("Números"); }
    if (/[^a-zA-Z0-9]/.test(senha)) { R += 32; tipos.push("Símbolos"); }

    // Cálculos expostos
    const combinacoes = Math.pow(R, L);
    const probabilidade = 1 / combinacoes;
    const logaritmoCalculado = Math.log2(R);
    const entropia = L * logaritmoCalculado;

    const poderDeProcessamento = 10000000000; // 10 bilhões por segundo
    const segundos = combinacoes / poderDeProcessamento;
    const anos = segundos / 31536000;

    // Renderizando todos os passos matemáticos no HTML
    passoAPasso.innerHTML = `
        <div class="etapa-calc">
            <strong>1. Análise Base:</strong><br>
            <strong>L</strong> (Tamanho da senha): ${L} caracteres<br>
            <strong>R</strong> (Tipos de caracteres): ${R} <i>(${tipos.join(' + ')})</i>
        </div>

        <div class="etapa-calc">
            <strong>2. A Probabilidade (P):</strong><br>
            Chance de chutar 1 caractere certo: 1/${R}<br>
            Chance de chutar a senha inteira certa: (1/${R})<sup>${L}</sup><br>
            P = 1 / ${formatarNumero(combinacoes)}
        </div>

        <div class="etapa-calc">
            <strong>3. Combinações Totais (C):</strong><br>
            C = R<sup>L</sup> ➡ ${R}<sup>${L}</sup><br>
            C = <strong>${formatarNumero(combinacoes)}</strong> combinações
        </div>

        <div class="etapa-calc">
            <strong>4. Calculando o Logaritmo (Entropia):</strong><br>
            A Entropia é o Logaritmo das combinações na Base 2.<br>
            E = log₂(C) ➡ log₂(${formatarNumero(combinacoes)})<br>
            <i>Aplicando a propriedade da potência: E = L × log₂(R)</i><br>
            E = ${L} × ${logaritmoCalculado.toFixed(4)}<br>
            <span class="resultado-destaque"><strong>E = ${entropia.toFixed(2)} bits</strong></span>
        </div>

        <div class="etapa-calc">
            <strong>5. A Conversão de Tempo (Bits ➡ Anos):</strong><br>
            <strong>I. A Potência:</strong> Combinações (C) = 2<sup>${entropia.toFixed(2)}</sup><br>
            <strong>II. Em Segundos (S):</strong> C ÷ 10 Bilhões (Velocidade do Hacker)<br>
            S = ${formatarNumero(segundos)} segundos<br>
            <strong>III. Em Anos (A):</strong> S ÷ 31.536.000 (Segundos em 1 ano)<br>
            <span class="resultado-destaque"><strong>A = ${formatarNumero(anos)} anos</strong></span>
        </div>
    `;

    divResultado.innerText = `Entropia: ${entropia.toFixed(2)} bits`;
    divTempo.innerText = `Tempo de Força Bruta: ${formatarTempo(segundos)}`;

    // Atualizar barra de força
    updateStrengthBar(entropia);
}

function updateStrengthBar(entropia) {
    if (!strengthBar) return;

    // Remove todas as classes de nível
    strengthBar.className = 'strength-bar';

    if (entropia <= 0) {
        strengthBar.classList.add('level-0');
    } else if (entropia < 28) {
        strengthBar.classList.add('level-1');
    } else if (entropia < 40) {
        strengthBar.classList.add('level-2');
    } else if (entropia < 56) {
        strengthBar.classList.add('level-3');
    } else if (entropia < 72) {
        strengthBar.classList.add('level-4');
    } else {
        strengthBar.classList.add('level-5');
    }
}

function formatarTempo(segundos) {
    if (segundos < 1) return "Instante (Menos de 1s) \u{1F6A8}";
    if (segundos < 60) return `${segundos.toFixed(0)} segundos \u{26A0}\u{FE0F}`;
    if (segundos < 3600) return `${(segundos / 60).toFixed(0)} minutos \u{1F7E1}`;
    if (segundos < 86400) return `${(segundos / 3600).toFixed(0)} horas \u{1F7E2}`;
    if (segundos < 31536000) return `${(segundos / 86400).toFixed(0)} dias \u{1F6E1}\u{FE0F}`;

    const anos = segundos / 31536000;
    if (anos > 1e6) return `${formatarNumero(anos)} anos \u{1F48E}`;
    return `${anos.toFixed(0)} anos \u{1F48E}`;
}


// === 3. MATRIX RAIN EFFECT ===
(function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Caracteres usados na chuva (katakana + latinas + números)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\+=*&^%$#@!';
    const charArray = chars.split('');

    const fontSize = 14;
    const tailLength = 48; // Quantidade de caracteres no rastro
    let columns;
    let drops;
    let trails; // Armazena os últimos caracteres de cada coluna

    function initColumns() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        trails = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -50;
            trails[i] = []; // Cada coluna tem seu histórico de posições + caracteres
        }
    }

    initColumns();

    function getAlphaForColumn(x) {
        const centerX = canvas.width / 2;
        const containerHalfWidth = 340;
        const distFromCenter = Math.abs(x - centerX);

        if (distFromCenter < containerHalfWidth - 40) {
            return 0.02;
        } else if (distFromCenter < containerHalfWidth + 60) {
            const t = (distFromCenter - (containerHalfWidth - 40)) / 100;
            return 0.02 + t * 0.28;
        }
        return 0.3;
    }

    function draw() {
        // Limpa a tela completamente — zero rastro residual
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < columns; i++) {
            const x = i * fontSize;
            const baseAlpha = getAlphaForColumn(x);

            // Gera um novo caractere e adiciona ao trail
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const y = Math.floor(drops[i]);

            if (y >= 0) {
                trails[i].push({ char: char, y: y });
            }

            // Limita o tamanho do trail
            if (trails[i].length > tailLength) {
                trails[i].shift();
            }

            // Desenha o trail (do mais antigo ao mais recente)
            for (let j = 0; j < trails[i].length; j++) {
                const t = trails[i][j];
                const age = (j + 1) / trails[i].length; // 0 = antigo, 1 = novo

                if (j === trails[i].length - 1) {
                    // Cabeça do stream — mais brilhante
                    ctx.fillStyle = `rgba(180, 255, 180, ${baseAlpha * 2.5 * age})`;
                } else {
                    ctx.fillStyle = `rgba(0, 255, 65, ${baseAlpha * age * 0.7})`;
                }

                ctx.fillText(t.char, x, t.y * fontSize);
            }

            // Reset quando sai da tela
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                trails[i] = [];
            }

            drops[i] += 0.4 + Math.random() * 0.4;
        }
    }

    // ~24fps
    setInterval(draw, 42);

    window.addEventListener('resize', function () {
        initColumns();
    });
})();

