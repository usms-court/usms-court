document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // ЗВУКИ (Инициализация при первом взаимодействии)
    // ============================================================
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    document.addEventListener('click', initAudioContext, { once: true });

    function playSound(type) {
        if (!audioCtx) return;
        try {
            let frequency = 440, duration = 0.1, volume = 0.15;
            switch(type) {
                case 'add': frequency = 523.25; duration = 0.15; volume = 0.12; break;
                case 'delete': frequency = 293.66; duration = 0.2; volume = 0.1; break;
                case 'toggle': frequency = 659.25; duration = 0.08; volume = 0.08; break;
                case 'copy': frequency = 880; duration = 0.12; volume = 0.1; break;
                case 'reset': frequency = 220; duration = 0.3; volume = 0.08; break;
                case 'save': frequency = 783.99; duration = 0.1; volume = 0.1; break;
            }
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) { /* Игнорируем ошибки воспроизведения */ }
    }

    // ========== УПРАВЛЕНИЕ ЗАГРУЗКОЙ ==========
    document.getElementById('loader').classList.add('hidden');

    // ========== DOM-ЭЛЕМЕНТЫ ==========
    const orderInput = document.getElementById('orderNumber');
    const judgeInput = document.getElementById('judgeName');
    const judgeRank = document.getElementById('judgeRank');
    const courtType = document.getElementById('courtType');
    const caseInput = document.getElementById('caseId');
    const factionSelect = document.getElementById('factionSelect');
    const citizenInput = document.getElementById('citizenName');
    const citizenRow = document.getElementById('citizenRow');
    const outputDisplay = document.getElementById('outputDisplay');
    const obligationsContainer = document.getElementById('obligationsContainer');
    const addBtn = document.getElementById('addObligationBtn');
    const resetTemplateBtn = document.getElementById('resetTemplateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const helpModal = document.getElementById('helpModal');
    const actionsCount = document.getElementById('actionsCount');

    // Interrogation
    const interrogationName = document.getElementById('interrogationName');
    const interrogationPassport = document.getElementById('interrogationPassport');
    const interrogationDate = document.getElementById('interrogationDate');
    const interrogationTimeStart = document.getElementById('interrogationTimeStart');
    const interrogationTimeEnd = document.getElementById('interrogationTimeEnd');
    const interrogationPlace = document.getElementById('interrogationPlace');
    const interrogationPresent = document.getElementById('interrogationPresent');
    const interrogationSummary = document.getElementById('interrogationSummary');

    // Progress & Wanted
    const progressFill = document.getElementById('progressFill');
    const progressPct = document.getElementById('progressPct');
    const wantedContainer = document.getElementById('wantedContainer');
    const addWantedBtn = document.getElementById('addWantedBtn');
    const wantedCount = document.getElementById('wantedCount');
    const wantedOrderNumber = document.getElementById('wantedOrderNumber');
    const wantedJudgeName = document.getElementById('wantedJudgeName');
    const wantedJudgeRank = document.getElementById('wantedJudgeRank');
    const wantedCourtType = document.getElementById('wantedCourtType');
    const wantedCaseId = document.getElementById('wantedCaseId');

    // Settings
    const prosecutorPosition = document.getElementById('prosecutorPosition');
    const prosecutorName = document.getElementById('prosecutorName');
    const prosecutorSignature = document.getElementById('prosecutorSignature');
    const prosecutorSignatureLink = document.getElementById('prosecutorSignatureLink');
    const prosecutorDiscord = document.getElementById('prosecutorDiscord');

    // Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const subTabBtns = document.querySelectorAll('#decreeSubTabs .sub-tab-btn');
    const decreeSection = document.getElementById('decreeSection');
    const wantedSection = document.getElementById('wantedSection');
    const finalSection = document.getElementById('finalSection');
    const decreeMainSection = document.getElementById('decreeMainSection');
    const decreeInterrogationSection = document.getElementById('decreeInterrogationSection');
    const container = document.getElementById('appContainer');

    let currentTab = 'decree';
    let obligationCounter = 0;
    let wantedCounter = 0;

    // ========== СОХРАНЕНИЕ / ЗАГРУЗКА ==========
    function loadSettings() {
        try {
            const saved = localStorage.getItem('usms_generator_settings');
            if (saved) {
                const data = JSON.parse(saved);
                const fields = [
                    'prosecutorPosition', 'prosecutorName', 'prosecutorSignature', 'prosecutorSignatureLink', 
                    'prosecutorDiscord', 'orderNumber', 'judgeName', 'judgeRank', 'courtType', 'caseId', 
                    'faction', 'citizenName', 'wantedOrderNumber', 'wantedJudgeName', 'wantedJudgeRank', 
                    'wantedCourtType', 'wantedCaseId', 'interrogationName', 'interrogationPassport', 
                    'interrogationDate', 'interrogationTimeStart', 'interrogationTimeEnd', 'interrogationPlace', 
                    'interrogationPresent', 'interrogationSummary'
                ];
                
                fields.forEach(field => {
                    const el = document.getElementById(field) || factionSelect; // fallback for specific fields
                    if (el && data[field]) el.value = data[field];
                });
                return true;
            }
        } catch (e) {
            console.warn('Ошибка загрузки настроек:', e);
        }
        return false;
    }

    function saveSettings() {
        try {
            const data = {
                prosecutorPosition: prosecutorPosition.value,
                prosecutorName: prosecutorName.value,
                prosecutorSignature: prosecutorSignature.value,
                prosecutorSignatureLink: prosecutorSignatureLink.value,
                prosecutorDiscord: prosecutorDiscord.value,
                orderNumber: orderInput.value,
                judgeName: judgeInput.value,
                judgeRank: judgeRank.value,
                courtType: courtType.value,
                caseId: caseInput.value,
                faction: factionSelect.value,
                citizenName: citizenInput.value,
                wantedOrderNumber: wantedOrderNumber.value,
                wantedJudgeName: wantedJudgeName.value,
                wantedJudgeRank: wantedJudgeRank.value,
                wantedCourtType: wantedCourtType.value,
                wantedCaseId: wantedCaseId.value,
                interrogationName: interrogationName.value,
                interrogationPassport: interrogationPassport.value,
                interrogationDate: interrogationDate.value,
                interrogationTimeStart: interrogationTimeStart.value,
                interrogationTimeEnd: interrogationTimeEnd.value,
                interrogationPlace: interrogationPlace.value,
                interrogationPresent: interrogationPresent.value,
                interrogationSummary: interrogationSummary.value,
            };
            localStorage.setItem('usms_generator_settings', JSON.stringify(data));
        } catch (e) {
            console.warn('Ошибка сохранения настроек:', e);
        }
    }

    // ========== ВАЛИДАЦИЯ ==========
    function validateField(input) {
        const isRequired = input.dataset.required === 'true';
        const value = input.value.trim();
        const isValid = !isRequired || (isRequired && value !== '');
        
        if (isRequired) {
            const errorEl = document.getElementById(input.id + 'Error');
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('valid');
                if (errorEl) errorEl.classList.remove('show');
            } else {
                input.classList.remove('valid');
                input.classList.add('error');
                if (errorEl) errorEl.classList.add('show');
            }
        }
        return isValid;
    }

    function validateSection(containerEl, validationBadgeId) {
        const inputs = containerEl.querySelectorAll('[data-required="true"]');
        let valid = true;
        inputs.forEach(input => { if (!validateField(input)) valid = false; });
        
        const badge = document.getElementById(validationBadgeId);
        if (badge) {
            badge.textContent = valid ? '✅ Заполнено' : '⚠️ Частично';
            badge.className = valid ? 'validation-badge valid' : 'validation-badge partial';
        }
        return valid;
    }

    function validateList(containerEl, badgeId) {
        const items = containerEl.children;
        const valid = items.length > 0;
        const badge = document.getElementById(badgeId);
        if (badge) {
            badge.textContent = valid ? '✅ Добавлено' : '⚠️ Требуется';
            badge.className = valid ? 'validation-badge valid' : 'validation-badge partial';
        }
        return valid;
    }

    function validateAll() {
        validateSection(decreeMainSection, 'decreeMainValidation');
        validateSection(decreeInterrogationSection, 'interrogationValidation');
        validateList(obligationsContainer, 'actionsValidation');
        validateSection(wantedSection, 'wantedInfoValidation');
        validateList(wantedContainer, 'wantedListValidation');
        updateFinalChecklist();
    }

    // ========== ФИНАЛЬНАЯ ПРОВЕРКА ==========
    function updateFinalChecklist() {
        const checks = {
            decree: validateSection(decreeMainSection, 'decreeMainValidation'),
            interrogation: validateSection(decreeInterrogationSection, 'interrogationValidation'),
            wanted: validateSection(wantedSection, 'wantedInfoValidation'),
            actions: validateList(obligationsContainer, 'actionsValidation'),
            wantedList: validateList(wantedContainer, 'wantedListValidation')
        };

        const checkIds = {
            decree: 'finalDecreeCheck', interrogation: 'finalInterrogationCheck',
            wanted: 'finalWantedCheck', actions: 'finalActionsCheck', wantedList: 'finalWantedListCheck'
        };

        let total = 0, validCount = 0;
        for (const [key, valid] of Object.entries(checks)) {
            const el = document.getElementById(checkIds[key]);
            if (el) {
                el.textContent = valid ? '✅' : '⬜';
                if (valid) validCount++;
                total++;
            }
        }

        const pct = total > 0 ? Math.round((validCount / total) * 100) : 0;
        document.getElementById('finalProgressFill').style.width = pct + '%';
        document.getElementById('finalProgressPct').textContent = pct + '%';
        document.getElementById('finalValidCount').textContent = validCount;
        document.getElementById('finalTotalCount').textContent = total;
        document.getElementById('finalInvalidCount').textContent = total - validCount;
    }

    // ========== ДЕЛЕГИРОВАНИЕ СОБЫТИЙ (Accordion & Delete) ==========
    function handleListInteractions(container, countEl, renumberFunc) {
        container.addEventListener('click', function(e) {
            const delBtn = e.target.closest('.del-btn');
            if (delBtn) {
                e.stopPropagation();
                playSound('delete');
                delBtn.closest('.obligation-item, .wanted-item').remove();
                renumberFunc();
                return;
            }
            
            const compactHeader = e.target.closest('.compact-content');
            const collapseBtn = e.target.closest('.collapse-btn');
            if (compactHeader || collapseBtn) {
                playSound('toggle');
                const item = (compactHeader || collapseBtn).closest('.obligation-item, .wanted-item');
                item.classList.toggle('collapsed');
            }
        });
    }

    function renumberObligations() {
        const items = obligationsContainer.querySelectorAll('.obligation-item');
        items.forEach((item, index) => {
            const numText = String(index + 1).padStart(2, '0');
            const num = item.querySelector('.compact-content .num');
            const numBig = item.querySelector('.expanded-content .num-big');
            if (num) num.textContent = numText;
            if (numBig) numBig.textContent = `#${numText}`;
        });
        obligationCounter = items.length;
        actionsCount.textContent = obligationCounter;
        generateAndDisplay();
        updateProgress();
        saveSettings();
        validateAll();
    }

    function renumberWanted() {
        const items = wantedContainer.querySelectorAll('.wanted-item');
        items.forEach((item, index) => {
            const numText = String(index + 1).padStart(2, '0');
            const num = item.querySelector('.compact-content .num');
            const numBig = item.querySelector('.expanded-content .num-big');
            if (num) num.textContent = numText;
            if (numBig) numBig.textContent = `#${numText}`;
        });
        wantedCounter = items.length;
        wantedCount.textContent = wantedCounter;
        generateAndDisplay();
        updateProgress();
        saveSettings();
        validateAll();
    }

    handleListInteractions(obligationsContainer, actionsCount, renumberObligations);
    handleListInteractions(wantedContainer, wantedCount, renumberWanted);

    // ========== ШАБЛОНЫ (TEMPLATE LITERALS) ==========
    const TYPE_TEMPLATES = {
        'Уведомление': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Уведомляю {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] о начатом досудебном разбирательстве.[/B]',
        'Боди-Камера': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Требую {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}], предоставить записи с боди-камеры за [COLOR=rgb(184, 49, 47)]{date_only}[/COLOR] с [COLOR=rgb(184, 49, 47)]{time_from}[/COLOR] по [COLOR=rgb(184, 49, 47)]{time_to}[/COLOR].[/B]',
        'Запрет на увольнение': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Уведомляю {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] об установленном [COLOR=rgb(184, 49, 47)]запрете на увольнение[/COLOR] на срок 72 часа.[/B]',
        'Отстранение': '[COLOR=rgb(41, 105, 176)]{index}.[/COLOR] [B]Обязать [COLOR=rgb(41, 105, 176)]{supervisor_rank}[/COLOR] [COLOR=rgb(184, 49, 47)]{supervisor_name}[/COLOR] отстранить {role} [COLOR=rgb(41, 105, 176)]{faction}[/COLOR] [COLOR=rgb(184, 49, 47)]{name}[/COLOR] [№ Паспорта: {passport}] и [COLOR=rgb(184, 49, 47)]понизить[/COLOR] его на первый порядковый ранг.[/B]'
    };

    function generateDecreeTemplate(data, obligationsText) {
        return `[TABLE width="100%"]
[TR]
[td][IMG width="886px" alt="USMS.png"]https://imgur.com/F9gO8NW.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/zQNkkZU.png[/IMG] [B][SIZE=6][COLOR=rgb(41, 105, 176)]ПОСТАНОВЛЕНИЕ MSLR-№${data.orderNumber}[/COLOR][/SIZE]
Руководствуясь своими полномочиями, предоставленными статьей 2.13 и 2.14 главы V Закона "О United States Marshals Service" и постановлением [COLOR=rgb(184, 49, 47)]${data.judgeRank} ${data.judgeName}[/COLOR] о принятии искового заявления[COLOR=rgb(184, 49, 47)] №${data.caseId}[/COLOR] в [COLOR=rgb(255, 255, 255)]${data.courtType} суд[/COLOR] штата Сан-Андреас постановляю: 
Кому: [COLOR=rgb(41, 105, 176)]${data.faction} ${data.citizen}[/COLOR][IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG] 

${obligationsText}


[IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG]
[B][COLOR=rgb(184, 49, 47)]1.[/COLOR] В случае невозможности исполнения какого-либо из пункстов настоящего постановления соответствующее уведомление с указанием причин направить на указанную ниже почту;

[COLOR=rgb(184, 49, 47)]2.[/COLOR] Доказательства исполнения предоставить на указанную ниже почту; 

[COLOR=rgb(184, 49, 47)]3.[/COLOR] Адрес электронной почты Службы Маршалов: ${data.prosecutorDiscord}

[COLOR=rgb(184, 49, 47)]4.[/COLOR] Постановление вступает в законную силу с момента публикации.

[COLOR=rgb(184, 49, 47)]5.[/COLOR] Срок исполнения постановления установить равным 24 часам. [/B] [IMG width="886px" alt="USMS.png"]https://imgur.com/T0zf5dm.png[/IMG][/CENTER]
[RIGHT][B]    Директор USMS
${data.prosecutorPosition} 
 Дата: ${data.currentDate}[/B]
${data.prosecutorName}
${data.prosecutorSignatureFormatted}[/RIGHT]
[/TR]
[/TABLE]`;
    }

    function generateWantedTemplate(data, wantedText) {
        return `[TABLE width="100%"]
[TR]
[td][IMG width="862px" alt="USMS.png"]https://imgur.com/3sEdzED.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/3HqLU38.png[/IMG]

[COLOR=rgb(41, 105, 176)][SIZE=6][B]Постановление о федеральном розыске MSFS-${data.wantedOrderNumber}[/B][/SIZE][/COLOR]

[B]Руководствуясь пунктом [B]3 статьи 42 главы X Процессуального кодекса[/B] Штата San Andreas, а так же
на основании постановления [B]${data.wantedJudgeRank}[/B] [B][B][COLOR=rgb(184, 49, 47)]${data.wantedJudgeName}[/COLOR][/B][/B] по иску [COLOR=rgb(184, 49, 47)]№${data.wantedCaseId}[/COLOR] ${data.wantedCourtType}[/B]

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]


${wantedText}

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]
[SIZE=4][B]Срок: [COLOR=rgb(41, 105, 176)]до исполнения.[/COLOR]
[COLOR=rgb(184, 49, 47)]В бланке ареста в "поле статьи" указать номер постановления.[/COLOR][/B][/SIZE]
[SIZE=5][B][COLOR=rgb(184, 49, 47)][IMG width="886px" alt="USMS.png"]https://imgur.com/AeiYwmY.png[/IMG][/COLOR][/B][/SIZE][/CENTER]
[RIGHT][B]
${data.prosecutorPosition} 
 Дата: ${data.currentDate}[/B]
${data.prosecutorName}
${data.prosecutorSignatureFormatted}[/RIGHT]
[/TR]
[/TABLE]`;
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    function getMoscowDate() {
        const now = new Date();
        const moscowTime = new Date(now.getTime() + (3 * 60 + now.getTimezoneOffset()) * 60000);
        return `${String(moscowTime.getDate()).padStart(2, '0')}.${String(moscowTime.getMonth() + 1).padStart(2, '0')}.${moscowTime.getFullYear()}`;
    }

    function declineTerm(number, word) {
        if (word === 'год') {
            if (number % 10 === 1 && number % 100 !== 11) return 'год';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'года';
            return 'лет';
        } else if (word === 'месяц') {
            if (number % 10 === 1 && number % 100 !== 11) return 'месяц';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'месяца';
            return 'месяцев';
        }
        return word;
    }

    // ========== СОЗДАНИЕ ДЕЙСТВИЙ (Создание элементов через DOM API) ==========
    function getTypeClass(type) {
        const map = { 'Уведомление': 'notice', 'Боди-Камера': '', 'Запрет на увольнение': 'warning', 'Отстранение': 'danger' };
        return map[type] || '';
    }

    function createObligationElement(data) {
        const div = document.createElement('div');
        div.className = 'obligation-item collapsed';
        div.draggable = true;
        const itemId = 'obligation_' + Date.now();
        div.dataset.id = itemId;

        const currentType = data?.type || 'Уведомление';
        const typeClass = getTypeClass(currentType);
        
        div.innerHTML = `
            <div class="compact-content">
                <span class="drag-handle">⠿</span>
                <span class="num">${String(obligationCounter + 1).padStart(2, '0')}</span>
                <span class="type-badge ${typeClass}">${currentType}</span>
                <span class="info">
                    <span class="hl">${data?.faction || '—'}</span> · <span>${data?.name || '—'}</span>
                </span>
                <span class="expand-icon">▼</span>
                <button class="del-btn">✕</button>
            </div>
            <div class="expanded-content">
                <div class="header-row">
                    <span class="title"><span class="num-big">#${String(obligationCounter + 1).padStart(2, '0')}</span> Действие</span>
                    <span class="badge ${typeClass}">${currentType}</span>
                    <button class="collapse-btn">▲ Свернуть</button>
                </div>
                <div class="row">
                    <label>Тип</label>
                    <select class="obligation-type">
                        ${['Уведомление', 'Боди-Камера', 'Запрет на увольнение', 'Отстранение'].map(t => `<option value="${t}" ${data && data.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="row">
                    <label>Имя Фамилия</label>
                    <input type="text" class="obligation-name" value="${data ? data.name : ''}" placeholder="Dante DeRosse">
                </div>
                <div class="row">
                    <label>Паспорт</label>
                    <input type="text" class="obligation-passport" value="${data ? data.passport : ''}" placeholder="380938">
                </div>
                <div class="row extra-fields-container"></div>
                <div class="template-editor">
                    <textarea class="type-template">${data ? data.customTemplate || TYPE_TEMPLATES[data.type] || '' : ''}</textarea>
                </div>
            </div>
        `;

        const typeSelect = div.querySelector('.obligation-type');
        const extraContainer = div.querySelector('.extra-fields-container');
        const templateTextarea = div.querySelector('.type-template');

        function updateExtraFields() {
            const type = typeSelect.value;
            const factionOptions = ['LSPD', 'LSSD', 'SANG', 'SASPA', 'FIB', 'GOV', 'EMS LS', 'EMS SS', 'Гражданин'];
            let extraHtml = '';
            
            if (['Уведомление', 'Запрет на увольнение', 'Боди-Камера', 'Отстранение'].includes(type)) {
                extraHtml += `
                    <div class="row" style="margin-top:4px;">
                        <label>Фракция</label>
                        <select class="obligation-faction">
                            ${factionOptions.map(f => `<option value="${f}" ${data && data.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>`;
            }
            if (type === 'Боди-Камера') {
                extraHtml += `
                    <div class="row" style="margin-top:4px;"><label>Дата</label><input type="date" class="obligation-date" value="${data ? data.date : ''}"></div>
                    <div class="row" style="margin-top:4px;"><label>Время с:</label><input type="time" class="obligation-time-from" value="${data ? data.time_from : ''}" step="60"></div>
                    <div class="row" style="margin-top:4px;"><label>Время по:</label><input type="time" class="obligation-time-to" value="${data ? data.time_to : ''}" step="60"></div>`;
            } else if (type === 'Отстранение') {
                extraHtml += `<div class="row" style="margin-top:4px;"><label>Имя Фамилия руководства</label><input type="text" class="obligation-supervisor" value="${data ? data.supervisor : ''}"></div>`;
            }
            extraContainer.innerHTML = extraHtml;
            extraContainer.querySelectorAll('input, select').forEach(el => el.addEventListener('input', triggerUpdate));
        }

        function triggerUpdate() {
            const type = typeSelect.value;
            div.querySelector('.compact-content .type-badge').textContent = type;
            div.querySelector('.compact-content .info .hl').textContent = div.querySelector('.obligation-faction')?.value || '—';
            div.querySelector('.compact-content .info span:last-child').textContent = div.querySelector('.obligation-name').value || '—';
            generateAndDisplay();
            updateProgress();
        }

        typeSelect.addEventListener('change', function() {
            updateExtraFields();
            if (!templateTextarea.value.trim() || Object.values(TYPE_TEMPLATES).includes(templateTextarea.value.trim())) {
                templateTextarea.value = TYPE_TEMPLATES[this.value] || '';
            }
            triggerUpdate();
        });

        div.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', triggerUpdate));
        updateExtraFields();
        return div;
    }

    function createWantedElement(data) {
        const div = document.createElement('div');
        div.className = 'wanted-item collapsed';
        div.draggable = true;
        
        div.innerHTML = `
            <div class="compact-content">
                <span class="drag-handle">⠿</span>
                <span class="num">${String(wantedCounter + 1).padStart(2, '0')}</span>
                <span class="type-badge wanted-badge">${data?.verdict || 'УК СА'}</span>
                <span class="info"><span class="hl-danger">${data?.name || '—'}</span> · <span>${data?.passport || '—'}</span></span>
                <span class="expand-icon">▼</span>
                <button class="del-btn">✕</button>
            </div>
            <div class="expanded-content">
                <div class="header-row">
                    <span class="title"><span class="num-big">#${String(wantedCounter + 1).padStart(2, '0')}</span> Разыскиваемый</span>
                    <span class="badge wanted-badge">${data?.verdict || 'УК СА'}</span>
                    <button class="collapse-btn">▲ Свернуть</button>
                </div>
                <div class="row"><label>Имя Фамилия</label><input type="text" class="wanted-name" value="${data ? data.name : ''}"></div>
                <div class="row"><label>Паспорт</label><input type="text" class="wanted-passport" value="${data ? data.passport : ''}"></div>
                <div class="row"><label>Статьи обвинения</label><input type="text" class="wanted-articles" value="${data ? data.articles : ''}"></div>
                <div class="row">
                    <label>Вид заключения</label>
                    <select class="wanted-verdict">
                        ${['УК СА', 'АК СА'].map(t => `<option value="${t}" ${data && data.verdict === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="row">
                    <label>Срок</label>
                    <input type="number" class="wanted-term" value="${data ? data.term : ''}" min="1" style="flex:0 0 120px;">
                    <span class="wanted-term-label" style="color:#8bb0cc; font-size:0.9rem;">${data?.verdict === 'УК СА' ? 'год(а/лет)' : 'месяц(ев/а)'}</span>
                </div>
            </div>
        `;

        const verdictSelect = div.querySelector('.wanted-verdict');
        const termInput = div.querySelector('.wanted-term');
        const termLabel = div.querySelector('.wanted-term-label');

        function triggerUpdate() {
            div.querySelector('.compact-content .type-badge').textContent = verdictSelect.value;
            div.querySelector('.compact-content .hl-danger').textContent = div.querySelector('.wanted-name').value || '—';
            
            const term = parseInt(termInput.value) || 0;
            const word = verdictSelect.value === 'УК СА' ? 'год' : 'месяц';
            termLabel.textContent = term > 0 ? declineTerm(term, word) : (word === 'год' ? 'год(а/лет)' : 'месяц(ев/а)');
            
            generateAndDisplay();
            updateProgress();
        }

        div.querySelectorAll('input, select').forEach(el => el.addEventListener('input', triggerUpdate));
        return div;
    }

    // ========== ГЕНЕРАЦИЯ И СБОР ДАННЫХ ==========
    function generateAndDisplay() {
        const currentDate = getMoscowDate();
        let signatureFormatted = prosecutorSignatureLink.value.trim() ? `[IMG width="350px" size="1200x1079"]${prosecutorSignatureLink.value.trim()}[/IMG]` : prosecutorSignature.value.trim();

        if (currentTab === 'wanted') {
            const wantedList = Array.from(wantedContainer.querySelectorAll('.wanted-item')).map(item => {
                const term = parseInt(item.querySelector('.wanted-term')?.value) || 0;
                const verdict = item.querySelector('.wanted-verdict')?.value || 'УК СА';
                const articles = item.querySelector('.wanted-articles')?.value || '—';
                return `[SIZE=4][B][COLOR=rgb(41, 105, 176)]1.[/COLOR] Объявить гражданина США [COLOR=rgb(184, 49, 47)]${item.querySelector('.wanted-name')?.value || '—'}[/COLOR] [№ Документа ${item.querySelector('.wanted-passport')?.value || '—'}] в федеральный розыск по [COLOR=rgb(41, 105, 176)]${articles.includes(',') ? 'статьям' : 'статье'} ${articles}[/COLOR] ` +
                       (verdict === 'УК СА' ? `[COLOR=rgb(41, 105, 176)]УК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${term} ${declineTerm(term, 'год')}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Федеральной Тюрьме Болингброук` 
                                            : `[COLOR=rgb(41, 105, 176)]АК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${term} ${declineTerm(term, 'месяц')}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Региональном пенитенциарном учреждении`) + `.`;
            }).join('\n\n');

            outputDisplay.textContent = generateWantedTemplate({
                wantedOrderNumber: wantedOrderNumber.value || '001', wantedJudgeName: wantedJudgeName.value || '—',
                wantedJudgeRank: wantedJudgeRank.value || 'Судьи', wantedCourtType: wantedCourtType.value || 'окружного',
                wantedCaseId: wantedCaseId.value || '—', prosecutorPosition: prosecutorPosition.value || '—',
                prosecutorName: prosecutorName.value || '—', prosecutorSignatureFormatted: signatureFormatted, currentDate
            }, wantedList);
            return;
        }

        const obligations = Array.from(obligationsContainer.querySelectorAll('.obligation-item')).map((item, idx) => {
            const type = item.querySelector('.obligation-type')?.value;
            let result = item.querySelector('.type-template')?.value || TYPE_TEMPLATES[type] || '';
            const data = {
                index: idx + 1, type,
                name: item.querySelector('.obligation-name')?.value || '—',
                passport: item.querySelector('.obligation-passport')?.value || '—',
                role: item.querySelector('.obligation-faction')?.value === 'Гражданин' ? 'гражданина' : 'сотрудника',
                faction: item.querySelector('.obligation-faction')?.value || '—',
                supervisor_name: item.querySelector('.obligation-supervisor')?.value || '—',
                supervisor_rank: 'Руководства',
                date_only: item.querySelector('.obligation-date')?.value ? new Date(item.querySelector('.obligation-date').value).toLocaleDateString('ru-RU') : '—',
                time_from: item.querySelector('.obligation-time-from')?.value || '—',
                time_to: item.querySelector('.obligation-time-to')?.value || '—'
            };
            for (const [key, value] of Object.entries(data)) {
                result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
            }
            return result;
        }).join('\n');

        outputDisplay.textContent = generateDecreeTemplate({
            orderNumber: orderInput.value || '—', judgeName: judgeInput.value || '—', judgeRank: judgeRank.value || 'Судьи',
            courtType: courtType.value || 'окружного', caseId: caseInput.value || '—', faction: factionSelect.value || '—',
            citizen: citizenInput.value || '', prosecutorPosition: prosecutorPosition.value || '—',
            prosecutorName: prosecutorName.value || '—', prosecutorSignatureFormatted: signatureFormatted,
            prosecutorDiscord: prosecutorDiscord.value || '—', currentDate
        }, obligations);
    }

    function updateProgress() {
        // Логика расчета прогресса остается без изменений
        let filled = 0, total = 0;
        if (currentTab === 'decree') {
            total = document.querySelectorAll('#decreeMainSection [data-required="true"]').length + 
                    document.querySelectorAll('#decreeInterrogationSection [data-required="true"]').length + 1;
            document.querySelectorAll('#decreeMainSection [data-required="true"], #decreeInterrogationSection [data-required="true"]').forEach(i => { if(i.value.trim()) filled++; });
            if (obligationsContainer.children.length > 0) filled++;
        } else if (currentTab === 'wanted') {
            total = document.querySelectorAll('#wantedSection .section:first-child [data-required="true"]').length + 1;
            document.querySelectorAll('#wantedSection .section:first-child [data-required="true"]').forEach(i => { if(i.value.trim()) filled++; });
            if (wantedContainer.children.length > 0) filled++;
        }
        const pct = total > 0 ? Math.min(Math.round((filled / total) * 100), 100) : 0;
        progressFill.style.width = pct + '%';
        progressPct.textContent = pct + '%';
    }

    // ========== СОБЫТИЯ И ИНИЦИАЛИЗАЦИЯ ==========
    factionSelect.addEventListener('change', () => {
        citizenRow.classList.toggle('hidden', factionSelect.value !== 'Гражданину');
        updateProgress();
    });

    addBtn.addEventListener('click', () => { playSound('add'); obligationsContainer.appendChild(createObligationElement()); renumberObligations(); });
    addWantedBtn.addEventListener('click', () => { playSound('add'); wantedContainer.appendChild(createWantedElement()); renumberWanted(); });

    tabBtns.forEach(btn => btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.dataset.tab;
        
        decreeSection.style.display = currentTab === 'decree' ? 'block' : 'none';
        wantedSection.style.display = currentTab === 'wanted' ? 'block' : 'none';
        finalSection.style.display = currentTab === 'final' ? 'block' : 'none';
        
        container.classList.toggle('wanted-mode', currentTab === 'wanted');
        document.body.style.background = currentTab === 'wanted' ? '#0f1a26' : '#0b1622';
        generateAndDisplay(); updateProgress();
    }));

    subTabBtns.forEach(btn => btn.addEventListener('click', function() {
        subTabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        decreeMainSection.style.display = this.dataset.sub === 'decree-main' ? 'block' : 'none';
        decreeInterrogationSection.style.display = this.dataset.sub === 'decree-interrogation' ? 'block' : 'none';
    }));

    document.querySelectorAll('input, select, textarea').forEach(inp => {
        inp.addEventListener('input', () => { generateAndDisplay(); updateProgress(); saveSettings(); validateAll(); });
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputDisplay.textContent);
            playSound('copy');
            const orig = copyBtn.innerText;
            copyBtn.innerText = '✅ Скопировано!';
            setTimeout(() => copyBtn.innerText = orig, 1600);
        } catch (e) { alert('Ошибка копирования: ' + e.message); }
    });

    resetTemplateBtn.addEventListener('click', () => {
        playSound('reset');
        document.querySelectorAll('input, textarea').forEach(i => i.value = '');
        obligationsContainer.innerHTML = ''; wantedContainer.innerHTML = '';
        renumberObligations(); renumberWanted();
    });

    // Модальные окна
    const openModal = m => { m.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeModal = m => { m.classList.remove('active'); document.body.style.overflow = ''; };
    
    document.getElementById('openSettingsBtn').addEventListener('click', () => { playSound('save'); openModal(settingsModal); });
    document.getElementById('closeSettingsBtn').addEventListener('click', () => closeModal(settingsModal));
    document.getElementById('openHelpBtn').addEventListener('click', () => openModal(helpModal));
    document.getElementById('closeHelpBtn').addEventListener('click', () => closeModal(helpModal));
    
    [settingsModal, helpModal].forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m); }));

    // Запуск
    loadSettings();
    factionSelect.dispatchEvent(new Event('change'));
    generateAndDisplay();
    updateProgress();
    validateAll();
});
