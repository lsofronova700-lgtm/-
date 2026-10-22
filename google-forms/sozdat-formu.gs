/**
 * Анкета удовлетворённости качеством услуг — «Точка роста»
 * Кружки «Робототехника» и «Графический дизайн».
 *
 * Как пользоваться:
 * 1. Откройте https://script.google.com → «Создать проект».
 * 2. Удалите всё в редакторе и вставьте этот файл целиком.
 * 3. Выберите функцию «sozdatFormu» и нажмите «Выполнить», разрешите доступ.
 * 4. Ссылки на форму и таблицу ответов появятся в «Журнале выполнения».
 * 5. Когда наберутся ответы, выполните функцию «podvestiItogi» — в таблице
 *    появится лист «Итоги» с индексом удовлетворённости и NPS.
 */

const SCALE = ['1', '2', '3', '4', '5'];

const COMMON = [
  'Мне интересно на занятиях',
  'Педагог понятно объясняет материал',
  'Педагог внимателен, помогает, если что-то не получается',
  'На занятиях я узнаю новое и получаю полезные навыки',
  'Оборудование и материалы в кабинете современные и исправные',
  'Расписание занятий удобное',
  'В кабинете комфортно и безопасно',
  'В группе доброжелательная атмосфера',
  'Есть возможность участвовать в конкурсах, выставках, проектах',
  'Информация о занятиях и мероприятиях доступна (сайт, чат, объявления)'
];
const ROBOT = [
  'Конструкторов и деталей хватает на всех',
  'Мне понятно, как программировать роботов',
  'Мы собираем собственные проекты, а не только по инструкции',
  'Есть возможность участвовать в соревнованиях по робототехнике'
];
const DESIGN = [
  'Компьютеры и графические программы работают без сбоев',
  'Мне понятно, как пользоваться графическими редакторами',
  'Задания развивают творчество и художественный вкус',
  'Мои работы показывают на выставках, сайте или в портфолио'
];

const T_COMMON = 'Общая оценка занятий';
const T_ROBOT = 'Робототехника';
const T_DESIGN = 'Графический дизайн';
const T_OVERALL = 'Насколько в целом вы удовлетворены занятиями в кружке?';
const T_RECOMMEND = 'Насколько вероятно, что вы порекомендуете кружок друзьям или знакомым?';
const SCALE_HELP = '1 — совсем не согласен, 2 — скорее не согласен, 3 — отчасти согласен, 4 — скорее согласен, 5 — полностью согласен';

function grid(form, title, rows) {
  return form.addGridItem()
    .setTitle(title)
    .setHelpText(SCALE_HELP)
    .setRows(rows)
    .setColumns(SCALE)
    .setRequired(true);
}

function sozdatFormu() {
  const form = FormApp.create('Анкета удовлетворённости: Робототехника и Графический дизайн («Точка роста»)');
  form.setDescription(
    'Уважаемые обучающиеся и родители! Просим вас ответить на вопросы анкеты. ' +
    'Она анонимная и займёт 5–7 минут. Ваши ответы помогут сделать занятия лучше.')
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setProgressBar(true)
    .setConfirmationMessage('Спасибо за участие в опросе!');

  // Страница 1. О вас + общие вопросы
  form.addSectionHeaderItem().setTitle('О вас');
  form.addMultipleChoiceItem().setTitle('Кто заполняет анкету?')
    .setChoiceValues(['Обучающийся', 'Родитель (законный представитель)']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('Класс')
    .setChoiceValues(['1–4 класс', '5–6 класс', '7–8 класс', '9–11 класс']);
  form.addMultipleChoiceItem().setTitle('Как долго посещаете кружок?')
    .setChoiceValues(['Меньше полугода', 'Полгода – год', 'Больше года']);
  grid(form, T_COMMON, COMMON);
  const askRobot = form.addMultipleChoiceItem()
    .setTitle('Вы (ваш ребёнок) посещаете кружок «Робототехника»?').setRequired(true);

  // Страница 2. Робототехника
  const pRobot = form.addPageBreakItem().setTitle(T_ROBOT);
  grid(form, T_ROBOT, ROBOT);

  // Страница 3. Вопрос про дизайн
  const pAskDesign = form.addPageBreakItem().setTitle('Графический дизайн');
  const askDesign = form.addMultipleChoiceItem()
    .setTitle('Вы (ваш ребёнок) посещаете кружок «Графический дизайн»?').setRequired(true);

  // Страница 4. Графический дизайн
  const pDesign = form.addPageBreakItem().setTitle(T_DESIGN);
  grid(form, T_DESIGN, DESIGN);

  // Страница 5. Итог и пожелания
  const pFinal = form.addPageBreakItem().setTitle('Итоговая оценка и пожелания');
  form.addScaleItem().setTitle(T_OVERALL).setBounds(1, 5)
    .setLabels('совсем не удовлетворён', 'полностью удовлетворён').setRequired(true);
  form.addScaleItem().setTitle(T_RECOMMEND).setBounds(0, 10)
    .setLabels('точно не порекомендую', 'обязательно порекомендую').setRequired(true);
  form.addMultipleChoiceItem().setTitle('Планируете продолжить занятия в следующем учебном году?')
    .setChoiceValues(['Да', 'Скорее да', 'Не знаю', 'Нет']);
  form.addParagraphTextItem().setTitle('Что вам больше всего нравится на занятиях?');
  form.addParagraphTextItem().setTitle('Что, по-вашему, стоит улучшить?');
  form.addParagraphTextItem().setTitle('Какие темы или проекты вы хотели бы добавить?');

  // Переходы: робототехника — только тем, кто её посещает; то же для дизайна
  askRobot.setChoices([askRobot.createChoice('Да', pRobot), askRobot.createChoice('Нет', pAskDesign)]);
  askDesign.setChoices([askDesign.createChoice('Да', pDesign), askDesign.createChoice('Нет', pFinal)]);

  // Таблица для ответов
  const ss = SpreadsheetApp.create('Ответы: анкета удовлетворённости «Точка роста»');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());

  Logger.log('Ссылка для участников: ' + form.getPublishedUrl());
  Logger.log('Редактирование формы: ' + form.getEditUrl());
  Logger.log('Таблица ответов: ' + ss.getUrl());
}

/** Строит лист «Итоги» по собранным ответам. */
function podvestiItogi() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Сначала выполните sozdatFormu');
  const ss = SpreadsheetApp.openById(id);
  const answers = ss.getSheets().find(s => s.getFormUrl());
  const data = answers.getDataRange().getValues();
  const head = data.shift();
  if (!data.length) throw new Error('Ответов пока нет');

  const col = title => head.indexOf(title);
  const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN;
  const nums = c => data.map(r => r[c]).filter(v => v !== '' && !isNaN(v)).map(Number);
  const index = m => isNaN(m) ? '' : Math.round((m - 1) / 4 * 100) + '%';

  const out = [['Раздел / утверждение', 'Ответов', 'Средний балл', 'Индекс удовлетворённости']];
  const allScores = [];
  [[T_COMMON, COMMON], [T_ROBOT, ROBOT], [T_DESIGN, DESIGN]].forEach(([title, rows]) => {
    const section = [];
    const lines = rows.map(row => {
      const v = nums(col(`${title} [${row}]`));
      section.push(...v);
      const m = avg(v);
      return ['   ' + row, v.length, isNaN(m) ? '' : +m.toFixed(2), index(m)];
    });
    allScores.push(...section);
    const m = avg(section);
    out.push([title, Math.round(section.length / rows.length), isNaN(m) ? '' : +m.toFixed(2), index(m)], ...lines);
  });

  const total = avg(allScores);
  const pct = Math.round((total - 1) / 4 * 100);
  const level = pct >= 80 ? 'высокий' : pct >= 60 ? 'средний' : 'низкий';
  const overall = avg(nums(col(T_OVERALL)));
  const rec = nums(col(T_RECOMMEND));
  const nps = Math.round((rec.filter(v => v >= 9).length - rec.filter(v => v <= 6).length) / rec.length * 100);

  out.push(['', '', '', ''],
    ['ИТОГО: индекс удовлетворённости', data.length, +total.toFixed(2), pct + '% — ' + level],
    ['Общая удовлетворённость (1–5)', data.length, +overall.toFixed(2), index(overall)],
    ['NPS (готовность рекомендовать)', rec.length, +avg(rec).toFixed(1), nps],
    ['Шкала: 80–100% — высокий, 60–79% — средний, ниже 60% — низкий уровень', '', '', '']);

  const sheet = ss.getSheetByName('Итоги') || ss.insertSheet('Итоги');
  sheet.clear();
  sheet.getRange(1, 1, out.length, 4).setValues(out);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  out.forEach((r, i) => { if (!String(r[0]).startsWith('   ') && i) sheet.getRange(i + 1, 1, 1, 4).setFontWeight('bold'); });
  sheet.autoResizeColumns(1, 4);
  Logger.log('Итоги: ' + ss.getUrl() + '#gid=' + sheet.getSheetId());
}
