const AUDITOR_PIN = "1234";
let registros = JSON.parse(localStorage.getItem("registros")) || [];

const loginModal = document.getElementById("loginModal");
const roleTag = document.getElementById("roleTag");

function aplicarPermissoes(){
  const role = localStorage.getItem("role");
  roleTag.textContent = role ? `Perfil: ${role}` : "";

  document.querySelectorAll("[data-auditor-only]").forEach(el=>{
    el.style.display = role === "auditor" ? "block" : "none";
  });

  if(!role) loginModal.style.display="flex";
  else loginModal.style.display="none";
}

document.getElementById("btnEntrarAprendiz").onclick = ()=>{
  localStorage.setItem("role","aprendiz");
  aplicarPermissoes();
}

document.getElementById("btnEntrarAuditor").onclick = ()=>{
  if(document.getElementById("auditorPin").value === AUDITOR_PIN){
    localStorage.setItem("role","auditor");
    aplicarPermissoes();
  } else alert("PIN inválido");
}

document.getElementById("btnSair").onclick = ()=>{
  localStorage.removeItem("role");
  aplicarPermissoes();
}

const form = document.getElementById("formRegistro");

form.onsubmit = e =>{
  e.preventDefault();

  registros.push({
    aprendiz: aprendiz.value,
    empresa: empresa.value,
    data: data.value,
    turno: turno.value,
    quantidade: Number(quantidade.value),
    descricao: descricao.value
  });

  localStorage.setItem("registros",JSON.stringify(registros));
  renderizar();
  form.reset();
}

function renderizar(){
  tabelaRegistros.innerHTML="";
  totais.innerHTML="";
  totaisTurno.innerHTML="";
  totaisEmpresa.innerHTML="";

  let totalGeral=0, manha=0, tarde=0;
  let porEmpresa={};

  registros.forEach(r=>{
    tabelaRegistros.innerHTML += `<tr><td>${r.aprendiz}</td><td>${r.empresa}</td><td>${r.data}</td><td>${r.turno}</td><td>${r.quantidade}</td></tr>`;

    totalGeral += r.quantidade;
    if(r.turno==="manha") manha+=r.quantidade;
    else tarde+=r.quantidade;

    porEmpresa[r.empresa] = (porEmpresa[r.empresa]||0)+r.quantidade;
  });

  totais.innerHTML = `<li>Total Geral: ${totalGeral}</li>`;
  totaisTurno.innerHTML = `<li>Manhã: ${manha}</li><li>Tarde: ${tarde}</li>`;

  for(let e in porEmpresa)
    totaisEmpresa.innerHTML += `<li>${e}: ${porEmpresa[e]}</li>`;
}

const btnLimpar = document.getElementById("btnLimpar");

if (btnLimpar) {
  btnLimpar.addEventListener("click", () => {
    const ok = confirm("Tem certeza que deseja apagar TODOS os registros?");
    if (!ok) return;

    registros = [];
    localStorage.removeItem("registros");

    tabelaRegistros.innerHTML = "";
    totais.innerHTML = "";
    totaisTurno.innerHTML = "";
    totaisEmpresa.innerHTML = "";

    alert("Registros apagados com sucesso.");
  });
}


document.getElementById("btnRelatorio").onclick = ()=>{
  let texto="Relatório da Semana\n\n";
  registros.forEach(r=>{
    texto+=`${r.data} - ${r.empresa} - ${r.quantidade}\n`;
  });
  saidaRelatorio.value = texto;
}

document.getElementById("btnCopiar").onclick = ()=>{
  navigator.clipboard.writeText(saidaRelatorio.value);
}

aplicarPermissoes();
renderizar();
