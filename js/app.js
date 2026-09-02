/* ==========================================================================
   FERNANDES CONSTRUTORA - APP LOGIC & MODALS
   Smooth Navigation, Interactive Project Modals, VIP Booking & UI Polish
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. DADOS DOS PROJETOS PARA MODAIS DE TOUR E DETALHES
  const projectsData = {
    'fronteira-nobre': {
      title: 'Residencial Fronteira Nobre',
      category: 'Alto Padrão & Casas Inteligentes',
      status: 'Lançamento Exclusivo',
      location: 'Bairro nobre de Ponta Porã (Próx. Parque dos Ervais)',
      area: '185m² a 340m²',
      suites: '3 a 4 Suítes com Closet',
      vagas: '3 a 4 Vagas Cobertas',
      previsao: 'Dezembro / 2026',
      diferenciais: [
        'Automação residencial completa via smartphone e voz',
        'Energia solar fotovoltaica instalada em todas as unidades',
        'Piscina privativa com borda infinita e hidromassagem',
        'Laje maciça com manta acústica de alta densidade',
        'Fechaduras biométricas e segurança perimetral 24h'
      ],
      description: 'O Fronteira Nobre redefine o conceito de morar bem no Mato Grosso do Sul. Com uma arquitetura contemporânea marcada por brises metálicos e integração biofílica, este empreendimento une sofisticação, tecnologia e total privacidade para a sua família.'
    },
    'parque-das-acacias': {
      title: 'Residencial Parque das Acácias',
      category: 'Minha Casa, Minha Vida Premium',
      status: 'Obras Aceleradas (75%)',
      location: 'Região de Alta Valorização - Ponta Porã',
      area: '64m² a 82m²',
      suites: '2 a 3 Quartos (1 Suíte)',
      vagas: '1 a 2 Vagas',
      previsao: 'Julho / 2026',
      diferenciais: [
        'Financiamento Caixa com subsídio de até R$ 55.000,00',
        'Entrada parcelada em até 60x direto com a Fernandes',
        'Piso em porcelanato polido e bancadas em granito',
        'Condomínio fechado com piscina adulto/infantil, churrasqueira e playground',
        'Isenção de ITBI e registro de imóvel para primeiro comprador'
      ],
      description: 'Projetado para quem não abre mão do acabamento refinado com as facilidades do programa Minha Casa, Minha Vida. Casas e apartamentos com plantas inteligentes e área de lazer completa para viver momentos inesquecíveis.'
    },
    'grand-horizon': {
      title: 'Edifício Grand Horizon',
      category: 'Apartamentos Panorâmicos',
      status: 'Últimas Unidades',
      location: 'Centro - Ponta Porã / MS',
      area: '112m² a 220m²',
      suites: '3 Suítes + Varanda Gourmet',
      vagas: '2 a 3 Vagas',
      previsao: 'Pronto para Morar',
      diferenciais: [
        'Vista 360° panorâmica da fronteira Ponta Porã / Pedro Juan',
        'Rooftop Lounge com piscina aquecida e academia panorâmica',
        'Pé direito duplo no living e janelas de piso a teto',
        'Gerador de energia para 100% das áreas comuns e elevadores',
        'Ponto de recarga para carros elétricos'
      ],
      description: 'A torre mais imponente de Ponta Porã. Um ícone de engenharia estrutural com fachada em vidro reflexivo e acabamentos nobres em madeira e concreto aparente.'
    },
    'reserva-ponta-pora': {
      title: 'Condomínio Reserva Ponta Porã',
      category: 'Condomínio Fechado de Casas',
      status: 'Fase de Lançamento',
      location: 'Anel Viário / Acesso Rápido às Faculdades',
      area: 'Lotes de 360m² a 600m²',
      suites: 'Projetos Arquitetônicos Personalizados',
      vagas: 'Garagens Amplas',
      previsao: 'Entrega 2027',
      diferenciais: [
        'Mais de 40.000m² de bosque nativo preservado e pista de caminhada',
        'Quadras de Beach Tennis, Tênis de Saibro e Campo de Futebol',
        'Fiação subterrânea e fibra óptica de alta velocidade',
        'Portaria blindada com reconhecimento facial',
        'Clubhouse com espaço gourmet e adega climatizada'
      ],
      description: 'A união perfeita entre a exuberância da natureza sul-mato-grossense e o luxo arquitetônico contemporâneo. O refúgio perfeito com segurança inabalável.'
    }
  };

  // 2. CONTROLE DO MODAL DE PROJETOS
  const projectModal = document.getElementById('project-detail-modal');
  const modalCloseBtn = projectModal?.querySelector('.modal-close-btn');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalLocation = document.getElementById('modal-project-location');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalSpecsArea = document.getElementById('modal-project-specs');
  const modalDiffsList = document.getElementById('modal-project-diffs');
  const modalCtaBtn = document.getElementById('modal-project-cta');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalCategory) modalCategory.textContent = `${data.category} • ${data.status}`;
    if (modalLocation) modalLocation.textContent = `📍 ${data.location}`;
    if (modalDesc) modalDesc.textContent = data.description;

    if (modalSpecsArea) {
      modalSpecsArea.innerHTML = `
        <div class="spec-item"><span class="spec-label">Área Privativa</span><span class="spec-val">${data.area}</span></div>
        <div class="spec-item"><span class="spec-label">Dormitórios</span><span class="spec-val">${data.suites}</span></div>
        <div class="spec-item"><span class="spec-label">Vagas</span><span class="spec-val">${data.vagas}</span></div>
        <div class="spec-item"><span class="spec-label">Previsão</span><span class="spec-val">${data.previsao}</span></div>
      `;
    }

    if (modalDiffsList) {
      modalDiffsList.innerHTML = data.diferenciais.map(item => `
        <li style="display:flex; align-items:center; gap:10px; margin-bottom:8px; font-size:0.9rem; color:#e2e8f0;">
          <span style="color:#d4af37; font-weight:bold;">✦</span> ${item}
        </li>
      `).join('');
    }

    if (modalCtaBtn) {
      const msg = encodeURIComponent(`Olá! Gostaria de receber a tabela de preços e a planta humanizada do empreendimento ${data.title} em Ponta Porã.`);
      modalCtaBtn.href = `https://wa.me/5567999615359?text=${msg}`;
      modalCtaBtn.target = '_blank';
    }

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project-btn]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-btn');
      openProjectModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', e => {
    if (e.target === projectModal) closeProjectModal();
  });

  // 3. MODAL DE AGENDAMENTO VIP & FORMULÁRIOS
  const bookingForm = document.getElementById('vip-booking-form');
  const toastNotice = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  }

  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('booking-name')?.value || '';
    const fone = document.getElementById('booking-phone')?.value || '';
    const interesse = document.getElementById('booking-interest')?.value || '';
    const dataVisita = document.getElementById('booking-date')?.value || '';

    showToast(`✨ Obrigado, ${nome.split(' ')[0]}! Sua solicitação para ${interesse} foi agendada.`);
    bookingForm.reset();

    // Redirecionamento amigável para confirmação imediata no WhatsApp
    setTimeout(() => {
      const msg = encodeURIComponent(`🏛️ Agendamento VIP Fernandes Construtora:\nNome: ${nome}\nWhatsApp: ${fone}\nInteresse: ${interesse}\nData Desejada: ${dataVisita}\nGostaria de confirmar o atendimento presencial em Ponta Porã.`);
      window.open(`https://wa.me/5567999615359?text=${msg}`, '_blank');
    }, 1200);
  });

  // 4. MENU MOBILE TOGGLE
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  mobileToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('mobile-active');
  });

  // 5. SMOOTH SCROLL PARA ÂNCORAS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
