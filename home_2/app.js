const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = services.filter((service) => {
    if (service.id === 'guide') {
      return guideChecked;
    }

    if (service.id === 'audio') {
      return audioChecked;
    }

    if (service.id === 'catalog') {
      return catalogChecked;
    }

    return false;
  });

  const items = selected.map(({ title, price }) => ({
    title: title.trim(),
    price,
  }));

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total,
    items,
  };
}

function showProgram() {
  if (data === null) {
    return;
  }

  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function submitForm(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  const json = JSON.stringify(report);
  JSON.parse(json);

  result.innerHTML =
    `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.` +
    report.items.map((item) => `<br>${item.title}`).join('');
  reportJson.textContent = json;

  choiceError.hidden = true;
  result.hidden = false;
  reportJson.hidden = false;
}

showProgramButton.addEventListener('click', showProgram);
form.addEventListener('submit', submitForm);

if (data === null) {
  form.hidden = true;
  dataError.hidden = false;
} else {
  form.hidden = false;
}
