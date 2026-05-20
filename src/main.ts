import './style.css';

const inputSenha = document.getElementById('senha') as HTMLInputElement | null;
const divResultado = document.getElementById('resultado') as HTMLElement | null;
const divTempo = document.getElementById('tempoCracking') as HTMLElement | null;

if (inputSenha) {
    inputSenha.addEventListener('input', calcularEntropia);
}

function calcularEntropia(): void {
    if (!inputSenha || !divResultado || !divTempo) return;

    const senha: string = inputSenha.value;
    const L: number = senha.length;
    let R: number = 0;

    if (L === 0) {
        divResultado.innerText = "Entropia: 0 bits";
        divTempo.innerText = "Digite algo para testar...";
        return;
    }

    if (/[a-z]/.test(senha)) R += 26;
    if (/[A-Z]/.test(senha)) R += 26;
    if (/[0-9]/.test(senha)) R += 10;
    if (/[^a-zA-Z0-9]/.test(senha)) R += 32;

    const entropia: number = L * Math.log2(R);
    const combinacoes: number = Math.pow(2, entropia);
    
    const poderDeProcessamento: number = 10_000_000_000;
    const segundos: number = combinacoes / poderDeProcessamento; 

    divResultado.innerText = `Entropia: ${entropia.toFixed(2)} bits (R=${R})`;
    divTempo.innerText = `Tempo de quebra: ${formatarTempo(segundos)}`;
}

function formatarTempo(segundos: number): string {
    if (segundos < 1) return "Instante (Menos de 1 segundo!) 🚨";
    if (segundos < 60) return `${segundos.toFixed(0)} segundos ⚠️`;
    if (segundos < 3600) return `${(segundos / 60).toFixed(0)} minutos 🟡`;
    if (segundos < 86400) return `${(segundos / 3600).toFixed(0)} horas 🟢`;
    if (segundos < 31536000) return `${(segundos / 86400).toFixed(0)} dias 🛡️`;
    return `${(segundos / 31536000).toFixed(0)} anos 💎`;
}