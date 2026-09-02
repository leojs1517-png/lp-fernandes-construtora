/* ==========================================================================
   FERNANDES CONSTRUTORA - MINHA CASA MINHA VIDA SIMULATOR & INTERACTIVE UI
   Official Caixa calculation logic, real-time feedback & WhatsApp integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. ELEMENTOS DO SIMULADOR MCMV
  const incomeSlider = document.getElementById('mcmv-income-slider');
  const incomeDisplay = document.getElementById('mcmv-income-display');
  const optDependents = document.getElementById('opt-dependents');
  const optFgts = document.getElementById('opt-fgts');

  const resFaixa = document.getElementById('res-faixa');
  const resSubsidio = document.getElementById('res-subsidio');
  const resParcela = document.getElementById('res-parcela');
  const resJuros = document.getElementById('res-juros');
  const resEntrada = document.getElementById('res-entrada');
  const rentSavingText = document.getElementById('rent-saving-val');
  const btnWhatsappSim = document.getElementById('btn-whatsapp-sim');

  // Valores de Estado do Simulador
  let state = {
    income: 2800,
    hasDependents: true,
    hasFgts: true,
    faixa: 'Faixa 1',
    subsidy: 48500,
    monthlyPayment: 580,
    interestRate: '4.25% a.a.',
    downPaymentMonthly: 190
  };

  // 2. FUNÇÃO DE CÁLCULO MCMV
  function calculateMCMV() {
    const income = parseFloat(incomeSlider.value);
    state.income = income;

    let subsidy = 0;
    let interest = '4.25% a.a.';
    let faixa = 'Faixa 1';

    if (income <= 2850) {
      faixa = 'Faixa 1 (Máximo Benefício)';
      // Subsídio de até 55.000 conforme renda
      const factor = (2850 - income) / 1350;
      subsidy = 35000 + (factor * 20000);
      if (state.hasDependents) subsidy += 4000;
      if (subsidy > 55000) subsidy = 55000;
      interest = state.hasFgts ? '4.00% a.a.' : '4.50% a.a.';
    } else if (income <= 4700) {
      faixa = 'Faixa 2 (Subsídio Médio)';
      const factor = (4700 - income) / 1850;
      subsidy = 12000 + (factor * 23000);
      if (state.hasDependents) subsidy += 3000;
      if (subsidy > 38000) subsidy = 38000;
      interest = state.hasFgts ? '4.75% a.a.' : '5.25% a.a.';
    } else if (income <= 8000) {
      faixa = 'Faixa 3 (Taxas Reduzidas)';
      subsidy = 0;
      interest = state.hasFgts ? '7.66% a.a.' : '8.16% a.a.';
    } else {
      faixa = 'SBPE / Pró-Cotista';
      subsidy = 0;
      interest = '8.99% a.a.';
    }

    // Parcela estimada máxima recomendada (entre 22% e 28% da renda)
    const monthlyPayment = Math.round(income * 0.24);
    // Entrada facilitada em 60x pela Fernandes Construtora
    const downPaymentMonthly = Math.max(150, Math.round((25000 - (subsidy * 0.35)) / 60));

    state.faixa = faixa;
    state.subsidy = Math.round(subsidy);
    state.monthlyPayment = monthlyPayment;
    state.interestRate = interest;
    state.downPaymentMonthly = downPaymentMonthly;

    // Atualizar na Interface
    if (incomeDisplay) {
      incomeDisplay.textContent = `R$ ${income.toLocaleString('pt-BR')},00`;
    }

    if (resFaixa) resFaixa.textContent = faixa.split(' ')[0] + ' ' + faixa.split(' ')[1];
    if (resSubsidio) resSubsidio.textContent = subsidy > 0 ? `R$ ${state.subsidy.toLocaleString('pt-BR')}` : 'Sob Consulta';
    if (resParcela) resParcela.textContent = `R$ ${monthlyPayment.toLocaleString('pt-BR')}/mês`;
    if (resJuros) resJuros.textContent = interest;
    if (resEntrada) resEntrada.textContent = `60x de R$ ${downPaymentMonthly.toLocaleString('pt-BR')}`;

    // Economia comparativa em relação a um aluguel de R$ 1.350 em Ponta Porã
    const rentDiff = 1350 - monthlyPayment;
    if (rentSavingText) {
      if (rentDiff > 0) {
        rentSavingText.textContent = `Economia de até R$ ${(rentDiff * 12).toLocaleString('pt-BR')}/ano vs Aluguel!`;
      } else {
        rentSavingText.textContent = `Parcela 100% investida no seu próprio patrimônio!`;
      }
    }

    updateWhatsappLink();
  }

  // 3. ATUALIZAÇÃO DO LINK WHATSAPP
  function updateWhatsappLink() {
    if (!btnWhatsappSim) return;
    const phone = '5567999615359'; // Número oficial Fernandes Construtora Ponta Porã
    const text = encodeURIComponent(
      `🏛️ Olá, Fernandes Construtora!\n` +
      `Fiz uma simulação do Minha Casa Minha Vida no site oficial:\n\n` +
      `📍 Renda Familiar Bruta: R$ ${state.income.toLocaleString('pt-BR')},00\n` +
      `🏷️ Faixa Identificada: ${state.faixa}\n` +
      `🎁 Subsídio Federal Estimado: R$ ${state.subsidy.toLocaleString('pt-BR')},00\n` +
      `💳 Parcela Estimada: R$ ${state.monthlyPayment.toLocaleString('pt-BR')}/mês\n` +
      `👨‍👩‍👧 Possui dependentes: ${state.hasDependents ? 'Sim' : 'Não'}\n` +
      `💼 Saldo FGTS / 3 anos: ${state.hasFgts ? 'Sim' : 'Não'}\n\n` +
      `Gostaria de solicitar minha PRÉ-APROVAÇÃO GRATUITA com a Caixa Econômica Federal em Ponta Porã!`
    );

    btnWhatsappSim.href = `https://wa.me/${phone}?text=${text}`;
    btnWhatsappSim.target = '_blank';
    btnWhatsappSim.rel = 'noopener noreferrer';
  }

  // Event Listeners dos Controles
  if (incomeSlider) {
    incomeSlider.addEventListener('input', calculateMCMV);
  }

  if (optDependents) {
    optDependents.addEventListener('click', () => {
      state.hasDependents = !state.hasDependents;
      optDependents.classList.toggle('checked', state.hasDependents);
      calculateMCMV();
    });
  }

  if (optFgts) {
    optFgts.addEventListener('click', () => {
      state.hasFgts = !state.hasFgts;
      optFgts.classList.toggle('checked', state.hasFgts);
      calculateMCMV();
    });
  }

  // Inicializar cálculo inicial
  calculateMCMV();

  // 4. FILTRO DE PROJETOS & PORTFÓLIO
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'none';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. FAQ ACCORDION INTERATIVO
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
