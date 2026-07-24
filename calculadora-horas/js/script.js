'use strict';

const form = document.querySelector('#hoursForm');
const fields = {
  entry: document.querySelector('#entry'),
  exit: document.querySelector('#exit'),
  breakTime: document.querySelector('#breakTime'),
  shift: document.querySelector('#shift')
};

const output = {
  total: document.querySelector('#totalHours'),
  balance: document.querySelector('#balance'),
  balanceLabel: document.querySelector('#balanceLabel'),
  balanceCard: document.querySelector('#balanceCard'),
  suggestedBreak: document.querySelector('#suggestedBreak'),
  recommendationText: document.querySelector('#recommendationText'),
  recommendationCard: document.querySelector('#recommendationCard'),
  error: document.querySelector('#errorMessage')
};

function timeToMinutes(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return (hours * 60) + minutes;
}

function formatDuration(totalMinutes, signed = false) {
  const rounded = Math.round(totalMinutes);
  const sign = rounded < 0 ? '-' : signed && rounded > 0 ? '+' : '';
  const absolute = Math.abs(rounded);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getBreakRecommendation(workedMinutes) {
  if (workedMinutes <= 240) {
    return { duration: 0, message: 'Para jornadas de até 4 horas, a tabela não prevê intervalo obrigatório.', warning: false };
  }
  if (workedMinutes <= 360) {
    return { duration: 15, message: 'Para jornadas acima de 4 e até 6 horas, a sugestão é um intervalo de 15 minutos.', warning: false };
  }
  if (workedMinutes <= 660) {
    return { duration: 60, message: 'Para jornadas acima de 6 e até 11 horas, a sugestão é um intervalo de 1 hora.', warning: false };
  }
  return { duration: null, message: 'Cuidado: a jornada líquida ultrapassa 11 horas. Revise os horários e o intervalo informado.', warning: true };
}

function calculate() {
  output.error.textContent = '';

  const entry = timeToMinutes(fields.entry.value);
  let exit = timeToMinutes(fields.exit.value);
  const breakMinutes = timeToMinutes(fields.breakTime.value);
  const shiftMinutes = timeToMinutes(fields.shift.value);

  if ([entry, exit, shiftMinutes].some(value => value === null)) {
    output.error.textContent = 'Preencha todos os campos com horários válidos.';
    return;
  }

  // Se a saída for anterior à entrada, considera-se que o turno terminou no dia seguinte.
  if (exit < entry) exit += 24 * 60;

  const elapsed = exit - entry;
  if (breakMinutes > elapsed) {
    output.error.textContent = 'O intervalo não pode ser maior que o período entre entrada e saída.';
    return;
  }
  // if (shiftMinutes === 0) {
  //   output.error.textContent = 'A escala do dia deve ser maior que zero.';
  //   return;
  // }

  const worked = elapsed - breakMinutes;
  const balance = worked - shiftMinutes;
  const recommendation = getBreakRecommendation(worked);

  output.total.textContent = formatDuration(worked);
  output.balance.textContent = formatDuration(balance, true);
  output.balanceLabel.textContent = balance === 0 ? 'Jornada cumprida' : balance > 0 ? 'Crédito de horas' : 'Débito de horas';
  output.suggestedBreak.textContent = recommendation.warning ? 'ALERTA' : formatDuration(recommendation.duration);
  output.recommendationText.textContent = recommendation.message;

  output.balanceCard.classList.remove('positive', 'negative');
  if (balance > 0) output.balanceCard.classList.add('positive');
  if (balance < 0) output.balanceCard.classList.add('negative');
  output.recommendationCard.classList.toggle('warning', recommendation.warning);
}

function resetResults() {
  form.reset();
  fields.breakTime.value = '00:00';
  fields.shift.value = '00:00';
  output.total.textContent = '--:--';
  output.balance.textContent = '--:--';
  output.balanceLabel.textContent = 'Aguardando cálculo';
  output.suggestedBreak.textContent = '--:--';
  output.recommendationText.textContent = 'Preencha os horários para receber uma recomendação com base na tabela de regras.';
  output.error.textContent = '';
  output.balanceCard.classList.remove('positive', 'negative');
  output.recommendationCard.classList.remove('warning');
  fields.entry.focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  calculate();
});

document.querySelector('#clearButton').addEventListener('click', resetResults);
document.querySelector('#fillExample').addEventListener('click', () => {
  fields.entry.value = '13:30';
  fields.exit.value = '22:39';
  fields.breakTime.value = '01:00';
  fields.shift.value = '08:00';
  calculate();
});

Object.values(fields).forEach(field => field.addEventListener('change', () => {
  if (Object.values(fields).every(item => item.value)) calculate();
}));
