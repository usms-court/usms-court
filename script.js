/* ============================================================
   USMS GENERATOR — SCRIPT v3.5
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // КОНСТАНТЫ
    // ============================================================
    
    const STORAGE_KEY = 'usms_generator_settings_v3';

    const DEFAULT_TEMPLATE = `
[TABLE width="100%"]
[TR]
[td][IMG width="886px" alt="USMS.png"]https://imgur.com/F9gO8NW.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/zQNkkZU.png[/IMG] [B][SIZE=6][COLOR=rgb(41, 105, 176)]ПОСТАНОВЛЕНИЕ MSLR-№620[/COLOR][/SIZE]
Руководствуясь своими полномочиями, предоставленными статьей 2.13 и 2.14 главы V Закона "О United States Marshals Service" и постановлением [COLOR=rgb(184, 49, 47)]{judgeRank} {judgeName}[/COLOR] о принятии искового заявления[COLOR=rgb(184, 49, 47)] №{caseId}[/COLOR] в [COLOR=rgb(255, 255, 255)]{courtType} суд[/COLOR] штата Сан-Андреас постановляю: 
Кому: [COLOR=rgb(41, 105, 176)]{faction} {citizen}[/COLOR][IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG] 
 
{obligations}


[IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG]
[B][COLOR=rgb(184, 49, 47)]1.[/COLOR] В случае невозможности исполнения какого-либо из пункстов настоящего постановления соответствующее уведомление с указанием причин направить на указанную ниже почту;
 
[COLOR=rgb(184, 49, 47)]2.[/COLOR] Доказательства исполнения предоставить на указанную ниже почту; 
 
[COLOR=rgb(184, 49, 47)]3.[/COLOR] Адрес электронной почты Службы Маршалов: {prosecutorDiscord}
 
[COLOR=rgb(184, 49, 47)]4.[/COLOR] Постановление вступает в законную силу с момента публикации.
 
[COLOR=rgb(184, 49, 47)]5.[/COLOR] Срок исполнения постановления установить равным 24 часам. [/B] [IMG width="886px" alt="USMS.png"]https://imgur.com/T0zf5dm.png[/IMG][/CENTER]
[RIGHT][B]
{prosecutorPosition} 
 Дата: {currentDate}[/B]
{prosecutorName}
{prosecutorSignatureFormatted}[/RIGHT]
[/TR]
[/TABLE]
`;

    const WANTED_TEMPLATE = `
[TABLE width="100%"]
[TR]
[td][IMG width="862px" alt="USMS.png"]https://imgur.com/3sEdzED.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/3HqLU38.png[/IMG]

[COLOR=rgb(41, 105, 176)][SIZE=6][B]Постановление о федеральном розыске MSFS-{wantedOrderNumber}[/B][/SIZE][/COLOR]

[B]Руководствуясь пунктом [B]3 статьи 42 главы X Процессуального кодекса[/B] Штата San Andreas, а так же
на основании постановления [B]{wantedJudgeRank}[/B] [B][B][COLOR=rgb(184, 49, 47)]{wantedJudgeName}[/COLOR][/B][/B] по иску [COLOR=rgb(184, 49, 47)]№{wantedCaseId}[/COLOR] {wantedCourtType}[/B]

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]


{wantedList}

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]
[SIZE=4][B]Срок: [COLOR=rgb(41, 105, 176)]до исполнения.[/COLOR]
[COLOR=rgb(184, 49, 47)]В бланке ареста в "поле статьи" указать номер постановления.[/COLOR][/B][/SIZE]
[SIZE=5][B][COLOR=rgb(184, 49, 47)][IMG width="886px" alt="USMS.png"]https://imgur.com/AeiYwmY.png[/IMG][/COLOR][/B][/SIZE][/CENTER]
[RIGHT][B]
{prosecutorPosition} 
 Дата: {currentDate}[/B]
{prosecutorName}
{prosecutorSignatureFormatted}[/RIGHT]
[/TR]
[/TABLE]
`;

    const FINAL_TEMPLATE = `
[TABLE width="100%"]
[TR]
[td][IMG width="886px" alt="USMS.png"]https://imgur.com/F9gO8NW.png[/IMG]


[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/3HqLU38.png[/IMG]

[COLOR=rgb(41, 105, 176)][SIZE=6][B]Постановление Службы Маршалов[/B][/SIZE][/COLOR]
[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]
[B]Службой Маршалов было инициировано досудебное разбирательство, в ходе которого были выяснены следующие факты:[/B]
[/CENTER]
{finalFacts}
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/AeiYwmY.png[/IMG][/CENTER]
[RIGHT]
[B][COLOR=rgb(255, 255, 255)]{prosecutorPosition}
{prosecutorName}[/COLOR][/B]
[COLOR=rgb(255, 255, 255)][B]Дата: {currentDate}[/B][/COLOR]
[B][COLOR=rgb(255, 255, 255)]Подпись:[/COLOR]
{prosecutorSignatureFormatted}[/B]
[/RIGHT][/td]
[/TR]
[/TABLE]
`;

    const TYPE_TEMPLATES = {
        'Уведомление': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Уведомляю {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] о начатом досудебном разбирательстве.[/B]',
        'Боди-Камера': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Требую {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}], предоставить записи с боди-камеры за [COLOR=rgb(184, 49, 47)]{date_only}[/COLOR] с [COLOR=rgb(184, 49, 47)]{time_from}[/COLOR] по [COLOR=rgb(184, 49, 47)]{time_to}[/COLOR].[/B]',
        'Запрет на увольнение': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Уведомляю {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] об установленном [COLOR=rgb(184, 49, 47)]запрете на увольнение[/COLOR] на срок 72 часа.[/B]',
        'Отстранение': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Обязать [COLOR=rgb(41, 105, 176)]{supervisor_rank}[/COLOR] [COLOR=rgb(184, 49, 47)]{supervisor_name}[/COLOR] отстранить {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] и [COLOR=rgb(184, 49, 47)]понизить[/COLOR] его на первый порядковый ранг.[/B]',
        'Допрос': '[B][B][B]1. Обязать {role} [B][B][B][B][B][B][B][B][COLOR=rgb(41, 105, 176)][/COLOR]{faction}[/B][/B][/B][/B][/B][/B][/B][/B] [B][B][B][B][B][B][B][B][B][COLOR=rgb(184, 49, 47)]{name}[/COLOR][B] [№ Паспорта: {passport}][/B][/B][/B][/B][/B][/B][/B][/B][/B][/B] явиться в Капитолий {interrogationDate} в период с {interrogationTimeStart} до {interrogationTimeEnd} для прохождения допроса, перед этим согласовав удобное обеим сторонам время встречи официальным письмом на эл. почту сотрудника USMS.[/B][/B][/B]'
    };

    const FINAL_FACT_TYPES = [
        'Установить факт нарушения',
        'Провести расследование',
        'Собрать доказательства',
        'Опросить свидетелей',
        'Проверить документы',
        'Установить личность',
        'Провести экспертизу',
        'Найти пострадавших',
        'Подтвердить алиби',
        'Установить мотив',
        'Проверить показания',
        'Найти соучастников',
        'Изъять улики',
        'Составить протокол',
        'Направить запрос',
        'Другое'
    ];

    const SUPERVISOR_RANKS = {
        'LSPD': 'Шефа', 'LSSD': 'Шерифа', 'SANG': 'Генерала',
        'SASPA': 'Директора', 'FIB': 'Директора', 'GOV': 'Губернатора',
        'EMS LS': 'Главного врача', 'EMS SS': 'Главного врача',
        'Гражданин': 'Руководства (не требуется)'
    };

    // ============================================================
    // КЭШ DOM
    // ============================================================
    
    let DOM = null;
    
    function cacheDOM() {
        DOM = {
            outputDisplay: document.getElementById('outputDisplay'),
            progressFill: document.getElementById('progressFill'),
            progressPct: document.getElementById('progressPct'),
            actionsCount: document.getElementById('actionsCount'),
            wantedCount: document.getElementById('wantedCount'),
            finalCount: document.getElementById('finalCount'),
            obligationsContainer: document.getElementById('obligationsContainer'),
            wantedContainer: document.getElementById('wantedContainer'),
            finalContainer: document.getElementById('finalContainer'),
            appContainer: document.getElementById('appContainer')
        };
    }

    const $ = (id) => document.getElementById(id);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

    // ============================================================
    // СОСТОЯНИЕ
    // ============================================================
    
    const state = {
        currentTab: 'decree',
        obligationCounter: 0,
        wantedCounter: 0,
        finalCounter: 0
    };

    // ============================================================
    // УТИЛИТЫ
    // ============================================================
    
    function getMoscowDate() {
        const now = new Date();
        const moscowOffset = 3 * 60;
        const localOffset = now.getTimezoneOffset();
        const moscowTime = new Date(now.getTime() + (moscowOffset + localOffset) * 60000);
        const day = String(moscowTime.getDate()).padStart(2, '0');
        const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
        const year = moscowTime.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function declineTerm(number, word) {
        if (word === 'год') {
            if (number % 10 === 1 && number % 100 !== 11) return 'год';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'года';
            return 'лет';
        }
        if (word === 'месяц') {
            if (number % 10 === 1 && number % 100 !== 11) return 'месяц';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'месяца';
            return 'месяцев';
        }
        return word;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // ============================================================
    // ЗВУКИ
    // ============================================================
    
    let _audioCtx = null;
    function getAudioCtx() {
        if (!_audioCtx) {
            try {
                _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return null; }
        }
        if (_audioCtx.state === 'suspended') _audioCtx.resume();
        return _audioCtx;
    }

    function playSound(type) {
        const ctx = getAudioCtx();
        if (!ctx) return;
        try {
            const presets = {
                add: [523.25, 0.15, 0.12], delete: [293.66, 0.2, 0.1],
                toggle: [659.25, 0.08, 0.08], copy: [880, 0.12, 0.1],
                reset: [220, 0.3, 0.08], save: [783.99, 0.1, 0.1]
            };
            const [freq, dur, vol] = presets[type] || [440, 0.1, 0.08];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur);
        } catch (e) {}
    }

    // ============================================================
    // LOCALSTORAGE
    // ============================================================
    
    const STORAGE_FIELDS = [
        'prosecutorPosition', 'prosecutorName', 'prosecutorSignature',
        'prosecutorSignatureLink', 'prosecutorDiscord',
        'orderNumber', 'judgeName', 'judgeRank', 'courtType', 'caseId', 'faction', 'citizenName',
        'wantedOrderNumber', 'wantedJudgeName', 'wantedJudgeRank', 'wantedCourtType', 'wantedCaseId'
    ];

    let _saveTimer = null;
    function saveSettings() {
        if (_saveTimer) return;
        _saveTimer = setTimeout(() => {
            _saveTimer = null;
            try {
                const data = {};
                STORAGE_FIELDS.forEach(id => {
                    const el = $(id);
                    if (el) data[id] = el.value;
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {}
        }, 400);
    }

    function saveSettingsNow() {
        if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
        try {
            const data = {};
            STORAGE_FIELDS.forEach(id => {
                const el = $(id);
                if (el) data[id] = el.value;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return false;
            const data = JSON.parse(saved);
            STORAGE_FIELDS.forEach(id => {
                const el = $(id);
                if (el && data[id] !== undefined) el.value = data[id];
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    // ============================================================
    // ВАЛИДАЦИЯ
    // ============================================================
    
    function validateField(input) {
        const isRequired = input.dataset.required === 'true';
        if (!isRequired) return true;

        const value = input.value.trim();
        const isValid = value !== '';
        const errorEl = $(input.id + 'Error');
        
        input.classList.toggle('error', !isValid);
        input.classList.toggle('valid', isValid && value !== '');
        
        if (errorEl) {
            const touched = input.dataset.touched === 'true';
            errorEl.classList.toggle('field__error--show', !isValid && touched);
        }
        return isValid;
    }

    function validateSection(containerEl, badgeId) {
        if (!containerEl) return true;
        const inputs = $$('[data-required="true"]', containerEl);
        let valid = true;
        inputs.forEach(input => {
            if (!validateField(input)) valid = false;
        });
        const badge = $(badgeId);
        if (badge) {
            badge.textContent = valid ? '✅ Заполнено' : '⚠️ Частично';
            badge.className = 'badge ' + (valid ? 'badge--valid' : 'badge--partial');
        }
        return valid;
    }

    function validateActions() {
        const items = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)');
        const badge = $('actionsValidation');
        const valid = items.length > 0;
        if (badge) {
            badge.textContent = valid ? '✅ Добавлено' : '⚠️ Требуется';
            badge.className = 'badge ' + (valid ? 'badge--valid' : 'badge--partial');
        }
        return valid;
    }

    function validateWantedList() {
        const items = DOM.wantedContainer.querySelectorAll('.wanted-item');
        const badge = $('wantedListValidation');
        const valid = items.length > 0;
        if (badge) {
            badge.textContent = valid ? '✅ Добавлен' : '⚠️ Требуется';
            badge.className = 'badge ' + (valid ? 'badge--valid' : 'badge--partial');
        }
        return valid;
    }

    function validateFinalFacts() {
        const items = DOM.finalContainer.querySelectorAll('.final-item');
        const badge = $('finalFactsValidation');
        const valid = items.length > 0;
        if (badge) {
            badge.textContent = valid ? '✅ Добавлено' : '⚠️ Требуется';
            badge.className = 'badge ' + (valid ? 'badge--valid' : 'badge--partial');
        }
        return valid;
    }

    function validateAll() {
        validateSection($('decreeMainSection'), 'decreeMainValidation');
        validateActions();
        validateSection($('wantedSection'), 'wantedInfoValidation');
        validateWantedList();
        validateFinalFacts();
    }

    // ============================================================
    // ПРОГРЕСС
    // ============================================================
    
    function updateProgress() {
        let filled = 0;
        let total = 0;

        if (state.currentTab === 'decree') {
            const mainInputs = $$('#decreeMainSection [data-required="true"]');
            mainInputs.forEach(inp => {
                if (inp.value.trim()) filled++;
                total++;
            });
            if ($('factionSelect').value !== 'Гражданину') filled++;

            const actions = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)');
            if (actions.length > 0) filled++;
            total++;
        } else if (state.currentTab === 'wanted') {
            const infoInputs = $$('#wantedSection [data-required="true"]');
            infoInputs.forEach(inp => {
                if (inp.value.trim()) filled++;
                total++;
            });
            const wanted = DOM.wantedContainer.querySelectorAll('.wanted-item');
            if (wanted.length > 0) filled++;
            total++;
        } else {
            const facts = DOM.finalContainer.querySelectorAll('.final-item');
            if (facts.length > 0) filled++;
            total++;
        }

        const pct = total > 0 ? Math.min(Math.round((filled / total) * 100), 100) : 0;
        DOM.progressFill.style.width = pct + '%';
        DOM.progressPct.textContent = pct + '%';
    }

    // ============================================================
    // DRAG & DROP
    // ============================================================
    
    function initDragDrop(container) {
        if (!container) return;
        let draggedItem = null;

        container.addEventListener('dragstart', e => {
            const item = e.target.closest('.obligation-item, .wanted-item, .final-item');
            if (!item) return;
            draggedItem = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
        });

        container.addEventListener('dragend', e => {
            const item = e.target.closest('.obligation-item, .wanted-item, .final-item');
            if (item) item.classList.remove('dragging');
            container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        });

        container.addEventListener('dragover', e => {
            e.preventDefault();
            const item = e.target.closest('.obligation-item, .wanted-item, .final-item');
            if (item && item !== draggedItem) {
                container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                item.classList.add('drag-over');
            }
        });

        container.addEventListener('dragleave', e => {
            const item = e.target.closest('.obligation-item, .wanted-item, .final-item');
            if (item) item.classList.remove('drag-over');
        });

        container.addEventListener('drop', e => {
            e.preventDefault();
            const item = e.target.closest('.obligation-item, .wanted-item, .final-item');
            if (!item || !draggedItem || item === draggedItem) {
                container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                return;
            }
            const items = Array.from(container.children);
            const fromIdx = items.indexOf(draggedItem);
            const toIdx = items.indexOf(item);
            if (fromIdx < toIdx) container.insertBefore(draggedItem, item.nextSibling);
            else container.insertBefore(draggedItem, item);

            if (container.id === 'obligationsContainer') renumberObligations();
            else if (container.id === 'wantedContainer') renumberWanted();
            else if (container.id === 'finalContainer') renumberFinal();

            container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            draggedItem = null;
        });
    }

    // ============================================================
    // ДЕЙСТВИЯ (Постановление)
    // ============================================================
    
    function getSupervisorRank(faction) {
        return SUPERVISOR_RANKS[faction] || 'Руководство';
    }

    function getTypeClass(type) {
        return {
            'Уведомление': 'notice', 'Боди-Камера': '',
            'Запрет на увольнение': 'warning', 'Отстранение': 'danger',
            'Допрос': 'notice'
        }[type] || '';
    }

    function createObligationElement(data) {
        const div = document.createElement('div');
        div.className = 'obligation-item collapsed';
        div.draggable = true;
        const itemId = 'obligation_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        div.dataset.id = itemId;

        const typeOptions = ['Уведомление', 'Боди-Камера', 'Запрет на увольнение', 'Отстранение', 'Допрос'];
        const factionOptions = ['LSPD', 'LSSD', 'SANG', 'SASPA', 'FIB', 'GOV', 'EMS LS', 'EMS SS', 'Гражданин'];
        const currentType = data?.type || 'Уведомление';
        const typeClass = getTypeClass(currentType);

        div.innerHTML = `
            <div class="compact-content" onclick="USMS.toggleObligation(this.closest('.obligation-item'))">
                <span class="drag-handle">⠿</span>
                <span class="num">${String(state.obligationCounter + 1).padStart(2, '0')}</span>
                <span class="type-badge ${typeClass}">${currentType}</span>
                <span class="info">
                    <span class="hl">${data?.faction || '—'}</span>
                    <span>·</span>
                    <span>${data?.name || '—'}</span>
                </span>
                <span class="expand-icon">▼</span>
                <button class="del-btn" onclick="event.stopPropagation(); USMS.deleteObligation(this)">✕</button>
            </div>
            <div class="expanded-content">
                <div class="header-row">
                    <span class="title">
                        <span class="num-big">#${String(state.obligationCounter + 1).padStart(2, '0')}</span>
                        Действие
                    </span>
                    <span class="badge ${typeClass}" style="margin:0;">${currentType}</span>
                    <button class="collapse-btn" onclick="USMS.toggleObligation(this.closest('.obligation-item'))">▲ Свернуть</button>
                </div>
                <div class="field">
                    <label>Тип</label>
                    <select class="obligation-type">
                        ${typeOptions.map(t => `<option value="${t}" ${data?.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Имя Фамилия</label>
                    <input type="text" class="obligation-name" value="${data?.name || ''}" placeholder="Dante DeRosse">
                </div>
                <div class="field">
                    <label>Паспорт</label>
                    <input type="text" class="obligation-passport" value="${data?.passport || ''}" placeholder="380938">
                </div>
                <div class="obligation-extra"></div>
            </div>
        `;

        const typeSelect = div.querySelector('.obligation-type');
        const extraContainer = div.querySelector('.obligation-extra');

        function updateCompactView() {
            const type = typeSelect.value;
            const name = div.querySelector('.obligation-name').value || '—';
            const faction = div.querySelector('.obligation-faction')?.value || '—';
            const tc = getTypeClass(type);
            const badge = div.querySelector('.compact-content .type-badge');
            badge.textContent = type;
            badge.className = 'type-badge ' + tc;
            div.querySelector('.compact-content .info .hl').textContent = faction;
            const nameSpan = div.querySelector('.compact-content .info span:last-child');
            if (nameSpan) nameSpan.textContent = name;
            const eb = div.querySelector('.expanded-content .header-row .badge');
            eb.textContent = type;
            eb.className = 'badge ' + tc;
        }

        function updateExtraFields() {
            const type = typeSelect.value;
            let extraHtml = '';
            if (type === 'Уведомление' || type === 'Запрет на увольнение') {
                extraHtml = `
                    <div class="field">
                        <label>Фракция</label>
                        <select class="obligation-faction">
                            ${factionOptions.map(f => `<option value="${f}" ${data?.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (type === 'Боди-Камера') {
                extraHtml = `
                    <div class="field">
                        <label>Фракция</label>
                        <select class="obligation-faction">
                            ${factionOptions.map(f => `<option value="${f}" ${data?.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>
                    <div class="field">
                        <label>Дата</label>
                        <input type="date" class="obligation-date" value="${data?.date || ''}">
                    </div>
                    <div class="field">
                        <label>Время с</label>
                        <input type="time" class="obligation-time-from" value="${data?.time_from || ''}" step="60">
                    </div>
                    <div class="field">
                        <label>Время по</label>
                        <input type="time" class="obligation-time-to" value="${data?.time_to || ''}" step="60">
                    </div>
                `;
            } else if (type === 'Отстранение') {
                extraHtml = `
                    <div class="field">
                        <label>Фракция</label>
                        <select class="obligation-faction">
                            ${factionOptions.map(f => `<option value="${f}" ${data?.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>
                    <div class="field">
                        <label>Имя Фамилия руководства</label>
                        <input type="text" class="obligation-supervisor" value="${data?.supervisor || ''}" placeholder="Dante DeRosse">
                    </div>
                `;
            } else if (type === 'Допрос') {
                extraHtml = `
                    <div class="field">
                        <label>Фракция</label>
                        <select class="obligation-faction">
                            ${factionOptions.map(f => `<option value="${f}" ${data?.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>
                    <div class="field">
                        <label>Дата допроса</label>
                        <input type="date" class="obligation-interrogation-date" value="${data?.interrogation_date || ''}">
                    </div>
                    <div class="field">
                        <label>Время с</label>
                        <input type="time" class="obligation-interrogation-time-from" value="${data?.interrogation_time_from || ''}" step="60">
                    </div>
                    <div class="field">
                        <label>Время по</label>
                        <input type="time" class="obligation-interrogation-time-to" value="${data?.interrogation_time_to || ''}" step="60">
                    </div>
                `;
            }
            extraContainer.innerHTML = extraHtml;
            extraContainer.querySelectorAll('input, select').forEach(el => {
                el.addEventListener('input', () => { updateCompactView(); scheduleRegenerate(); });
                el.addEventListener('change', () => { updateCompactView(); scheduleRegenerate(); });
            });
            updateCompactView();
        }

        typeSelect.addEventListener('change', () => {
            updateExtraFields();
            updateCompactView();
            scheduleRegenerate();
        });

        div.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', () => { updateCompactView(); scheduleRegenerate(); });
        });

        updateExtraFields();
        return div;
    }

    function addObligation(data) {
        const el = createObligationElement(data || null);
        DOM.obligationsContainer.appendChild(el);
        state.obligationCounter = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)').length;
        DOM.actionsCount.textContent = state.obligationCounter;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    function deleteObligation(btn) {
        playSound('delete');
        btn.closest('.obligation-item').remove();
        renumberObligations();
    }

    function toggleObligation(el) {
        if (!el) return;
        el.classList.toggle('collapsed');
        playSound('toggle');
    }

    function renumberObligations() {
        const items = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)');
        items.forEach((item, i) => {
            item.querySelector('.compact-content .num').textContent = String(i + 1).padStart(2, '0');
            item.querySelector('.expanded-content .num-big').textContent = `#${String(i + 1).padStart(2, '0')}`;
        });
        state.obligationCounter = items.length;
        DOM.actionsCount.textContent = items.length;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    // ============================================================
    // РАЗЫСКИВАЕМЫЕ
    // ============================================================
    
    function createWantedElement(data) {
        const div = document.createElement('div');
        div.className = 'wanted-item collapsed';
        div.draggable = true;
        const itemId = 'wanted_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        div.dataset.id = itemId;

        const verdictOptions = ['УК СА', 'АК СА'];

        div.innerHTML = `
            <div class="compact-content" onclick="USMS.toggleWanted(this.closest('.wanted-item'))">
                <span class="drag-handle">⠿</span>
                <span class="num">${String(state.wantedCounter + 1).padStart(2, '0')}</span>
                <span class="type-badge wanted-badge">${data?.verdict || 'УК СА'}</span>
                <span class="info">
                    <span class="hl-danger">${data?.name || '—'}</span>
                    <span>·</span>
                    <span>${data?.passport || '—'}</span>
                </span>
                <span class="expand-icon">▼</span>
                <button class="del-btn" onclick="event.stopPropagation(); USMS.deleteWanted(this)">✕</button>
            </div>
            <div class="expanded-content">
                <div class="header-row">
                    <span class="title">
                        <span class="num-big">#${String(state.wantedCounter + 1).padStart(2, '0')}</span>
                        Разыскиваемый
                    </span>
                    <span class="badge wanted-badge" style="margin:0;">${data?.verdict || 'УК СА'}</span>
                    <button class="collapse-btn" onclick="USMS.toggleWanted(this.closest('.wanted-item'))">▲ Свернуть</button>
                </div>
                <div class="field">
                    <label>Имя Фамилия</label>
                    <input type="text" class="wanted-name" value="${data?.name || ''}" placeholder="Имя Фамилия">
                </div>
                <div class="field">
                    <label>Паспорт</label>
                    <input type="text" class="wanted-passport" value="${data?.passport || ''}" placeholder="серия номер">
                </div>
                <div class="field">
                    <label>Статьи обвинения</label>
                    <input type="text" class="wanted-articles" value="${data?.articles || ''}" placeholder="ст. 105, ст. 158">
                </div>
                <div class="field">
                    <label>Вид заключения</label>
                    <select class="wanted-verdict">
                        ${verdictOptions.map(t => `<option value="${t}" ${data?.verdict === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Срок</label>
                    <input type="number" class="wanted-term" value="${data?.term || ''}" placeholder="срок" min="1" style="max-width:120px;">
                    <span class="wanted-term-label" style="color:var(--text-muted); font-size:0.9rem;">${data?.verdict === 'УК СА' ? 'год(а/лет)' : 'месяц(ев/а)'}</span>
                </div>
            </div>
        `;

        const verdictSelect = div.querySelector('.wanted-verdict');
        const termInput = div.querySelector('.wanted-term');
        const termLabel = div.querySelector('.wanted-term-label');

        function updateView() {
            const name = div.querySelector('.wanted-name').value || '—';
            const passport = div.querySelector('.wanted-passport').value || '—';
            const verdict = verdictSelect.value;
            const term = parseInt(termInput.value) || 0;

            div.querySelector('.compact-content .hl-danger').textContent = name;
            div.querySelector('.compact-content .info span:last-child').textContent = passport;
            div.querySelector('.compact-content .type-badge').textContent = verdict;
            div.querySelector('.expanded-content .header-row .badge').textContent = verdict;
            termLabel.textContent = term > 0
                ? declineTerm(term, verdict === 'УК СА' ? 'год' : 'месяц')
                : (verdict === 'УК СА' ? 'год(а/лет)' : 'месяц(ев/а)');
        }

        [verdictSelect, termInput].forEach(el => {
            el.addEventListener('input', () => { updateView(); scheduleRegenerate(); });
            el.addEventListener('change', () => { updateView(); scheduleRegenerate(); });
        });
        div.querySelectorAll('.wanted-name, .wanted-passport, .wanted-articles').forEach(el => {
            el.addEventListener('input', () => { updateView(); scheduleRegenerate(); });
        });

        updateView();
        return div;
    }

    function addWanted(data) {
        const el = createWantedElement(data || null);
        DOM.wantedContainer.appendChild(el);
        state.wantedCounter = DOM.wantedContainer.querySelectorAll('.wanted-item').length;
        DOM.wantedCount.textContent = state.wantedCounter;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    function deleteWanted(btn) {
        playSound('delete');
        btn.closest('.wanted-item').remove();
        renumberWanted();
    }

    function toggleWanted(el) {
        if (!el) return;
        el.classList.toggle('collapsed');
        playSound('toggle');
    }

    function renumberWanted() {
        const items = DOM.wantedContainer.querySelectorAll('.wanted-item');
        items.forEach((item, i) => {
            item.querySelector('.compact-content .num').textContent = String(i + 1).padStart(2, '0');
            item.querySelector('.expanded-content .num-big').textContent = `#${String(i + 1).padStart(2, '0')}`;
        });
        state.wantedCounter = items.length;
        DOM.wantedCount.textContent = items.length;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    // ============================================================
    // ФАКТЫ (Итоговое)
    // ============================================================
    
    function createFinalElement(data) {
        const div = document.createElement('div');
        div.className = 'final-item obligation-item collapsed';
        div.draggable = true;
        const itemId = 'final_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        div.dataset.id = itemId;

        const status = data?.status || 'success';
        const statusText = status === 'success' ? 'Удалось' : 'Не удалось';
        const statusClass = status === 'success' ? 'status-badge--success' : 'status-badge--fail';

        div.innerHTML = `
            <div class="compact-content" onclick="USMS.toggleFinal(this.closest('.final-item'))">
                <span class="drag-handle">⠿</span>
                <span class="num">${String(state.finalCounter + 1).padStart(2, '0')}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
                <span class="info">
                    <span class="fact-text">${data?.fact || 'Новый факт'}</span>
                </span>
                <span class="expand-icon">▼</span>
                <button class="del-btn" onclick="event.stopPropagation(); USMS.deleteFinal(this)">✕</button>
            </div>
            <div class="expanded-content">
                <div class="header-row">
                    <span class="title">
                        <span class="num-big">#${String(state.finalCounter + 1).padStart(2, '0')}</span>
                        Факт разбирательства
                    </span>
                    <span class="status-badge ${statusClass}" style="margin:0;">${statusText}</span>
                    <button class="collapse-btn" onclick="USMS.toggleFinal(this.closest('.final-item'))">▲ Свернуть</button>
                </div>
                <div class="field">
                    <label>Статус</label>
                    <select class="final-status">
                        <option value="success" ${status === 'success' ? 'selected' : ''}>Удалось</option>
                        <option value="fail" ${status === 'fail' ? 'selected' : ''}>Не удалось</option>
                    </select>
                </div>
                <div class="field">
                    <label>Факт</label>
                    <select class="final-fact-select">
                        ${FINAL_FACT_TYPES.map(t => `<option value="${t}" ${data?.fact === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="field">
                    <label>Свой текст (если «Другое»)</label>
                    <input type="text" class="final-fact-custom" value="${data?.customFact || ''}" placeholder="Введите свой вариант...">
                </div>
            </div>
        `;

        const statusSelect = div.querySelector('.final-status');
        const factSelect = div.querySelector('.final-fact-select');
        const factCustom = div.querySelector('.final-fact-custom');

        function updateView() {
            const st = statusSelect.value;
            const stText = st === 'success' ? 'Удалось' : 'Не удалось';
            const stClass = st === 'success' ? 'status-badge--success' : 'status-badge--fail';
            
            const factValue = factSelect.value === 'Другое' ? (factCustom.value || 'Новый факт') : factSelect.value;
            
            div.querySelector('.compact-content .status-badge').textContent = stText;
            div.querySelector('.compact-content .status-badge').className = 'status-badge ' + stClass;
            div.querySelector('.compact-content .fact-text').textContent = factValue;
            
            const eb = div.querySelector('.expanded-content .header-row .status-badge');
            eb.textContent = stText;
            eb.className = 'status-badge ' + stClass;
        }

        [statusSelect, factSelect, factCustom].forEach(el => {
            el.addEventListener('input', () => { updateView(); scheduleRegenerate(); });
            el.addEventListener('change', () => { updateView(); scheduleRegenerate(); });
        });

        updateView();
        return div;
    }

    function addFinal(data) {
        const el = createFinalElement(data || null);
        DOM.finalContainer.appendChild(el);
        state.finalCounter = DOM.finalContainer.querySelectorAll('.final-item').length;
        DOM.finalCount.textContent = state.finalCounter;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    function deleteFinal(btn) {
        playSound('delete');
        btn.closest('.final-item').remove();
        renumberFinal();
    }

    function toggleFinal(el) {
        if (!el) return;
        el.classList.toggle('collapsed');
        playSound('toggle');
    }

    function renumberFinal() {
        const items = DOM.finalContainer.querySelectorAll('.final-item');
        items.forEach((item, i) => {
            item.querySelector('.compact-content .num').textContent = String(i + 1).padStart(2, '0');
            item.querySelector('.expanded-content .num-big').textContent = `#${String(i + 1).padStart(2, '0')}`;
        });
        state.finalCounter = items.length;
        DOM.finalCount.textContent = items.length;
        scheduleRegenerate();
        updateProgress();
        saveSettings();
        validateAll();
    }

    // ============================================================
    // СБОР ДАННЫХ
    // ============================================================
    
    function collectObligations() {
        const items = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)');
        const result = [];
        items.forEach(item => {
            const type = item.querySelector('.obligation-type')?.value || '';
            const name = item.querySelector('.obligation-name')?.value || '';
            const passport = item.querySelector('.obligation-passport')?.value || '';
            const extra = {};
            const faction = item.querySelector('.obligation-faction');
            if (faction) extra.faction = faction.value;
            const date = item.querySelector('.obligation-date');
            if (date) extra.date = date.value;
            const tf = item.querySelector('.obligation-time-from');
            if (tf) extra.time_from = tf.value;
            const tt = item.querySelector('.obligation-time-to');
            if (tt) extra.time_to = tt.value;
            const sup = item.querySelector('.obligation-supervisor');
            if (sup) extra.supervisor = sup.value;
            
            const idate = item.querySelector('.obligation-interrogation-date');
            if (idate) extra.interrogation_date = idate.value;
            const itf = item.querySelector('.obligation-interrogation-time-from');
            if (itf) extra.interrogation_time_from = itf.value;
            const itt = item.querySelector('.obligation-interrogation-time-to');
            if (itt) extra.interrogation_time_to = itt.value;
            
            result.push({ type, name, passport, ...extra });
        });
        return result;
    }

    function collectWanted() {
        const items = DOM.wantedContainer.querySelectorAll('.wanted-item');
        const result = [];
        items.forEach(item => {
            result.push({
                name: item.querySelector('.wanted-name')?.value || '',
                passport: item.querySelector('.wanted-passport')?.value || '',
                articles: item.querySelector('.wanted-articles')?.value || '',
                verdict: item.querySelector('.wanted-verdict')?.value || 'УК СА',
                term: item.querySelector('.wanted-term')?.value || ''
            });
        });
        return result;
    }

    function collectFinal() {
        const items = DOM.finalContainer.querySelectorAll('.final-item');
        const result = [];
        items.forEach(item => {
            const status = item.querySelector('.final-status')?.value || 'success';
            const factSelect = item.querySelector('.final-fact-select')?.value || '';
            const factCustom = item.querySelector('.final-fact-custom')?.value || '';
            const fact = factSelect === 'Другое' ? (factCustom || 'Не указано') : factSelect;
            result.push({ status, fact });
        });
        return result;
    }

    // ============================================================
    // РЕНДЕР
    // ============================================================
    
    function renderObligations(list) {
        if (!list.length) return '—';
        return list.map((ob, i) => {
            const index = i + 1;
            const template = TYPE_TEMPLATES[ob.type] || '{index}. {name}';
            const role = ob.faction === 'Гражданин' ? 'гражданина' : 'сотрудника';
            const data = {
                index, type: ob.type || 'Запрос', name: ob.name || '—',
                passport: ob.passport || '—', role
            };
            if (ob.type === 'Уведомление' || ob.type === 'Запрет на увольнение') {
                data.faction = ob.faction || '—';
            } else if (ob.type === 'Отстранение') {
                data.faction = ob.faction || '—';
                data.supervisor_name = ob.supervisor || '—';
                data.supervisor_rank = getSupervisorRank(ob.faction);
            } else if (ob.type === 'Боди-Камера') {
                data.faction = ob.faction || '—';
                data.date_only = formatDate(ob.date);
                data.time_from = ob.time_from || '—';
                data.time_to = ob.time_to || '—';
            } else if (ob.type === 'Допрос') {
                data.faction = ob.faction === 'Гражданин' ? '' : (ob.faction || '—');
                data.interrogationDate = formatDate(ob.interrogation_date);
                data.interrogationTimeStart = ob.interrogation_time_from || '—';
                data.interrogationTimeEnd = ob.interrogation_time_to || '—';
            }
            return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
        }).join('\n');
    }

    function renderWanted(list) {
        if (!list.length) return '—';
        return list.map((w, i) => {
            const index = i + 1;
            const term = parseInt(w.term) || 0;
            const declined = declineTerm(term, w.verdict === 'УК СА' ? 'год' : 'месяц');
            const articleWord = (w.articles && w.articles.includes(',')) ? 'статьям' : 'статье';
            const articlesText = w.articles || '—';
            const verdictText = w.verdict === 'УК СА'
                ? `[COLOR=rgb(41, 105, 176)]УК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${w.term || '—'} ${declined}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Федеральной Тюрьме Болингброук`
                : `[COLOR=rgb(41, 105, 176)]АК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${w.term || '—'} ${declined}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Региональном пенитенциарном учреждении`;
            return `[SIZE=4][B][COLOR=rgb(41, 105, 176)]${index}.[/COLOR] Объявить гражданина США [COLOR=rgb(184, 49, 47)]${w.name}[/COLOR] [№ Документа ${w.passport}] в федеральный розыск по [COLOR=rgb(41, 105, 176)]${articleWord} ${articlesText}[/COLOR] ${verdictText}.`;
        }).join('\n\n');
    }

    function renderFinal(list) {
        if (!list.length) return '—';
        return list.map((f, i) => {
            const index = i + 1;
            const statusText = f.status === 'success' ? 'Удалось' : 'Не удалось';
            return `[COLOR=rgb(41, 105, 176)][B]${index}. [/B][/COLOR][COLOR=rgb(255, 255, 255)][B]${statusText}[/B][/COLOR]`;
        }).join('\n');
    }

    // ============================================================
    // ГЕНЕРАЦИЯ
    // ============================================================
    
    let _regenRaf = null;
    function scheduleRegenerate() {
        if (_regenRaf) return;
        _regenRaf = requestAnimationFrame(() => {
            _regenRaf = null;
            regenerate();
        });
    }

    function regenerate() {
        const currentDate = getMoscowDate();
        let signatureFormatted = '';
        const sigLink = $('prosecutorSignatureLink').value.trim();
        const sigText = $('prosecutorSignature').value.trim();
        if (sigLink) signatureFormatted = `[IMG width="350px" size="1200x1079"]${sigLink}[/IMG]`;
        else if (sigText) signatureFormatted = sigText;

        let result = '';

        if (state.currentTab === 'wanted') {
            result = WANTED_TEMPLATE;
            const data = {
                wantedOrderNumber: $('wantedOrderNumber').value || '001',
                wantedJudgeName: $('wantedJudgeName').value || '—',
                wantedJudgeRank: $('wantedJudgeRank').value || 'Судьи',
                wantedCourtType: $('wantedCourtType').value || 'окружного',
                wantedCaseId: $('wantedCaseId').value || '—',
                currentDate,
                prosecutorPosition: $('prosecutorPosition').value || '—',
                prosecutorName: $('prosecutorName').value || '—',
                prosecutorSignatureFormatted: signatureFormatted,
                prosecutorDiscord: $('prosecutorDiscord').value || '—'
            };
            result = result.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
            result = result.replace(/\{wantedList\}/g, renderWanted(collectWanted()));
        } else if (state.currentTab === 'final') {
            result = FINAL_TEMPLATE;
            const data = {
                currentDate,
                prosecutorPosition: $('prosecutorPosition').value || '—',
                prosecutorName: $('prosecutorName').value || '—',
                prosecutorSignatureFormatted: signatureFormatted
            };
            result = result.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
            result = result.replace(/\{finalFacts\}/g, renderFinal(collectFinal()));
        } else {
            result = DEFAULT_TEMPLATE;
            const data = {
                orderNumber: $('orderNumber').value || '—',
                judgeName: $('judgeName').value || '—',
                judgeRank: $('judgeRank').value || 'Судьи',
                courtType: $('courtType').value || 'окружного',
                caseId: $('caseId').value || '—',
                faction: $('factionSelect').value || '—',
                citizen: $('citizenName').value || '',
                currentDate,
                prosecutorPosition: $('prosecutorPosition').value || '—',
                prosecutorName: $('prosecutorName').value || '—',
                prosecutorSignatureFormatted: signatureFormatted,
                prosecutorDiscord: $('prosecutorDiscord').value || '—'
            };
            result = result.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
            result = result.replace(/\{obligations\}/g, renderObligations(collectObligations()));
        }

        DOM.outputDisplay.textContent = result;
        return result;
    }

    // ============================================================
    // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
    // ============================================================
    
    function initTabs() {
        $$('.tabs__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.tabs__btn').forEach(b => b.classList.remove('tabs__btn--active'));
                btn.classList.add('tabs__btn--active');
                state.currentTab = btn.dataset.tab;

                const sections = { decree: 'decreeSection', wanted: 'wantedSection', final: 'finalSection' };
                Object.entries(sections).forEach(([key, id]) => {
                    $(id).style.display = key === state.currentTab ? 'flex' : 'none';
                });

                if (state.currentTab === 'wanted') {
                    DOM.appContainer.classList.add('wanted-mode');
                    document.body.style.background = '#0f1a26';
                } else {
                    DOM.appContainer.classList.remove('wanted-mode');
                    document.body.style.background = '#0b1622';
                }

                updateProgress();
                regenerate();
                saveSettings();
            });
        });
    }

    // ============================================================
    // МОДАЛКИ
    // ============================================================
    
    function openModal(modal) {
        modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    }
    function closeModal(modal) {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }

    function initModals() {
        $('openSettingsBtn').addEventListener('click', () => { playSound('save'); openModal($('settingsModal')); });
        $('closeSettingsBtn').addEventListener('click', () => closeModal($('settingsModal')));
        $('settingsModal').addEventListener('click', e => { if (e.target === $('settingsModal')) closeModal($('settingsModal')); });

        $('openHelpBtn').addEventListener('click', () => openModal($('helpModal')));
        $('closeHelpBtn').addEventListener('click', () => closeModal($('helpModal')));
        $('helpModal').addEventListener('click', e => { if (e.target === $('helpModal')) closeModal($('helpModal')); });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if ($('settingsModal').classList.contains('modal--active')) closeModal($('settingsModal'));
                if ($('helpModal').classList.contains('modal--active')) closeModal($('helpModal'));
            }
        });
    }

    // ============================================================
    // СОБЫТИЯ
    // ============================================================
    
    function initEvents() {
        $('addObligationBtn').addEventListener('click', () => { playSound('add'); addObligation(null); });
        $('addWantedBtn').addEventListener('click', () => { playSound('add'); addWanted(null); });
        $('addFinalBtn').addEventListener('click', () => { playSound('add'); addFinal(null); });

        $('resetTemplateBtn').addEventListener('click', () => {
            playSound('reset');
            ['orderNumber', 'judgeName', 'caseId', 'citizenName',
             'wantedOrderNumber', 'wantedJudgeName', 'wantedCaseId'].forEach(id => { $(id).value = ''; });
            $('judgeRank').value = 'окружного судьи';
            $('courtType').value = 'окружной';
            $('wantedJudgeRank').value = 'окружного судьи';
            $('wantedCourtType').value = 'окружного суда';
            DOM.obligationsContainer.innerHTML = '';
            DOM.wantedContainer.innerHTML = '';
            DOM.finalContainer.innerHTML = '';
            state.obligationCounter = 0;
            state.wantedCounter = 0;
            state.finalCounter = 0;
            DOM.actionsCount.textContent = '0';
            DOM.wantedCount.textContent = '0';
            DOM.finalCount.textContent = '0';
            saveSettingsNow();
            regenerate();
            updateProgress();
            validateAll();
        });

        $('saveSettingsBtn').addEventListener('click', () => {
            playSound('save');
            saveSettingsNow();
            regenerate();
            closeModal($('settingsModal'));
            updateProgress();
            validateAll();
        });

        $('copyBtn').addEventListener('click', async () => {
            const code = DOM.outputDisplay.textContent;
            if (!code || !code.trim()) { alert('Нет сгенерированного текста.'); return; }
            try {
                await navigator.clipboard.writeText(code);
                playSound('copy');
                const orig = $('copyBtn').innerText;
                $('copyBtn').innerText = '✅ Скопировано!';
                setTimeout(() => { $('copyBtn').innerText = orig; }, 1600);
            } catch (e) {
                alert('Ошибка копирования: ' + e.message);
            }
        });

        $('factionSelect').addEventListener('change', () => {
            $('citizenRow').classList.toggle('hidden', $('factionSelect').value !== 'Гражданину');
            updateProgress();
        });

        $$('input[data-required="true"], select[data-required="true"], textarea[data-required="true"]').forEach(inp => {
            inp.addEventListener('blur', () => {
                inp.dataset.touched = 'true';
                validateField(inp);
            });
        });

        document.addEventListener('input', (e) => {
            const t = e.target;
            if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') {
                if (t.dataset.required === 'true') t.dataset.touched = 'true';
                scheduleRegenerate();
                scheduleProgress();
                saveSettings();
                scheduleValidate();
            }
        });

        document.addEventListener('change', (e) => {
            const t = e.target;
            if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') {
                if (t.dataset.required === 'true') t.dataset.touched = 'true';
                scheduleRegenerate();
                scheduleProgress();
                saveSettings();
                scheduleValidate();
            }
        });
    }

    let _progressRaf = null;
    function scheduleProgress() {
        if (_progressRaf) return;
        _progressRaf = requestAnimationFrame(() => {
            _progressRaf = null;
            updateProgress();
        });
    }

    let _validateRaf = null;
    function scheduleValidate() {
        if (_validateRaf) return;
        _validateRaf = requestAnimationFrame(() => {
            _validateRaf = null;
            validateAll();
        });
    }

    // ============================================================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================================================
    
    function init() {
        cacheDOM();
        
        window.addEventListener('load', () => {
            $('loader').classList.add('loader--hidden');
        });

        loadSettings();
        $('citizenRow').classList.toggle('hidden', $('factionSelect').value !== 'Гражданину');

        initTabs();
        initModals();
        initEvents();
        initDragDrop(DOM.obligationsContainer);
        initDragDrop(DOM.wantedContainer);
        initDragDrop(DOM.finalContainer);

        regenerate();
        updateProgress();
        validateAll();

        setTimeout(() => {
            state.obligationCounter = DOM.obligationsContainer.querySelectorAll('.obligation-item:not(.final-item)').length;
            state.wantedCounter = DOM.wantedContainer.querySelectorAll('.wanted-item').length;
            state.finalCounter = DOM.finalContainer.querySelectorAll('.final-item').length;
            DOM.actionsCount.textContent = state.obligationCounter;
            DOM.wantedCount.textContent = state.wantedCounter;
            DOM.finalCount.textContent = state.finalCounter;
        }, 50);
    }

    window.USMS = {
        toggleObligation,
        toggleWanted,
        toggleFinal,
        deleteObligation,
        deleteWanted,
        deleteFinal,
        renumberObligations,
        renumberWanted,
        renumberFinal
    };

    init();
})();
