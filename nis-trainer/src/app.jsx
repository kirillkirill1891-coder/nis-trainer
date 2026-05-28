import React, { useState, useEffect, useRef } from 'react';

// --- SOUND EFFECTS (Web Audio API) ---
const playSound = (type, soundOn) => {
  if (!soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180.00, ctx.currentTime); // Low Buzz
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.start();
      osc.frequency.linearRampToValueAtTime(130.56, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'badge') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4 Fanfare
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.08); 
      osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.16); 
      osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.24); 
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'timeout') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150.00, ctx.currentTime); 
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(100.00, ctx.currentTime + 0.2); 
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    console.log("Audio API is block/not supported");
  }
};

// --- VECTOR ICON CONTAINER ---
const Icon = ({ name, className = "w-5 h-5", size = 20 }) => {
  const icons = {
    trophy: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </svg>
    ),
    flame: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
    brain: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
      </svg>
    ),
    clock: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    lightbulb: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
    book: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    sparkles: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
        <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
      </svg>
    ),
    arrowRight: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    check: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    x: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    volume: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
    volumeX: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    ),
    rotate: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
    home: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    compass: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    star: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    gradCap: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    translate: (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    )
  };
  return icons[name] || null;
};

// --- EXPANDED QUESTION BANK WITH SYSTEMIC PEDAGOGICAL METADATA ---
const QUESTION_BANK = {
  math: [
    {
      id: "m1",
      type: "math",
      timeLimit: 90, // seconds
      question: "Вычислите значение числового выражения:",
      mathExpression: "3/8 * 3_1/9 - 2_1/2 : 3_3/4 + 5_1/3",
      options: [
        { text: "3 ½", isCorrect: false },
        { text: "5 ⅚", isCorrect: true },
        { text: "7 ⅙", isCorrect: false },
        { text: "7 ⅔", isCorrect: false }
      ],
      hint: "Выполняйте действия по порядку: сначала умножение и деление (переведя смешанные дроби в неправильные), затем вычитание и сложение.",
      explanation: "1) Превратим смешанные дроби в неправильные:\n3_1/9 = 28/9;\n2_1/2 = 5/2;\n3_3/4 = 15/4.\n\n2) Умножение: 3/8 * 28/9 = (3*28) / (8*9) = 84/72 = 7/6 = 1_1/6.\n\n3) Деление: 5/2 : 15/4 = 5/2 * 4/15 = (5*4) / (2*15) = 2/3.\n\n4) Вычитание и сложение:\n1_1/6 - 2/3 + 5_1/3 = 7/6 - 4/6 + 16/3 = 3/6 + 32/6 = 35/6 = 5_5/6."
    },
    {
      id: "m2",
      type: "math",
      timeLimit: 90,
      question: "Сравните значения выражений:\n\nM = |-7| - 4\nN = |-7 - 4|\nK = -7 - |-4|",
      options: [
        { text: "M < N < K", isCorrect: false },
        { text: "N < M < K", isCorrect: false },
        { text: "K < M < N", isCorrect: true },
        { text: "K < N < M", isCorrect: false }
      ],
      hint: "Помните, что модуль числа всегда неотрицателен: | -a | = a. Сначала найдите числовое значение для M, N и K.",
      explanation: "Вычислим каждое выражение:\n- M = |-7| - 4 = 7 - 4 = 3\n- N = |-7 - 4| = |-11| = 11\n- K = -7 - |-4| = -7 - 4 = -11\n\nСравниваем результаты: -11 < 3 < 11. Значит, K < M < N."
    },
    {
      id: "m3",
      type: "math",
      timeLimit: 90,
      question: "Точки А, В, С, D расположены на координатной прямой последовательно. Даны координаты точек А(16) и В(20). Найдите координату точки D, если |AB| = 2|BC| и |BC| = 2|CD|.",
      svgType: "coordinate",
      options: [
        { text: "23", isCorrect: true },
        { text: "24", isCorrect: false },
        { text: "28", isCorrect: false },
        { text: "44", isCorrect: false }
      ],
      hint: "Найдите длину отрезка AB через координаты. Из этого найдите длины BC и CD. Так как точки идут по порядку, прибавляйте длины к координатам.",
      explanation: "1) Длина отрезка |AB| = 20 - 16 = 4.\n2) По условию |AB| = 2|BC| => 4 = 2|BC| => |BC| = 2. Так как точки идут последовательно, координата C = 20 + 2 = 22.\n3) По условию |BC| = 2|CD| => 2 = 2|CD| => |CD| = 1. Значит, координата D = 22 + 1 = 23."
    },
    {
      id: "m4",
      type: "math",
      timeLimit: 90,
      question: "Сколько существует двузначных чисел, кратных 11, но не кратных 33?",
      options: [
        { text: "4", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "6", isCorrect: true },
        { text: "7", isCorrect: false }
      ],
      hint: "Выпишите все двузначные числа, кратные 11 (это 11, 22, 33 ...). Затем вычеркните те из них, которые делятся на 33 без остатка.",
      explanation: "Все двузначные числа, кратные 11: {11, 22, 33, 44, 55, 66, 77, 88, 99} — всего 9 чисел. Из них кратны 33: {33, 66, 99} — всего 3 числа. Исключаем их: 9 - 3 = 6 чисел (это 11, 22, 44, 55, 77, 88)."
    },
    {
      id: "m5",
      type: "math",
      timeLimit: 90,
      question: "Диаметр большого круга равен 1 м, а диаметр каждого из четырех малых кругов равен 0.4 м. Найдите площадь закрашенной фигуры. Число π округлите до сотых (3.14).",
      svgType: "circles",
      options: [
        { text: "0.2826 м²", isCorrect: true },
        { text: "0.6594 м²", isCorrect: false },
        { text: "1.1304 м²", isCorrect: false },
        { text: "2.6376 м²", isCorrect: false }
      ],
      hint: "Вычтите из общей площади большого круга сумму площадей 4 малых белых кругов.",
      explanation: "Радиус большого круга = 0.5м. Площадь = 3.14 * 0.25 = 0.785 м².\nРадиус малого круга = 0.2м. Площадь одного = 3.14 * 0.04 = 0.1256 м².\nСумма 4-х малых кругов = 4 * 0.1256 = 0.5024 м².\nРазность: 0.785 - 0.5024 = 0.2826 м²."
    }
  ],
  quant: [
    {
      id: "q1",
      type: "quant",
      timeLimit: 30, // seconds!
      question: "Сравните значения в колонках:",
      colA: "0.720 + 0.004",
      colB: "0.072 + 0.400",
      options: [
        { text: "А, если значение в колонке А больше", isCorrect: true },
        { text: "В, если значение в колонке В больше", isCorrect: false },
        { text: "С, если оба значения равны между собой", isCorrect: false },
        { text: "D, если недостаточно информации для сравнения", isCorrect: false }
      ],
      hint: "Сложите числа в столбик, обращая внимание на разряды после запятой.",
      explanation: "Величина А = 0.724. Величина Б = 0.472. Очевидно, что 0.724 > 0.472. Правильный ответ А."
    },
    {
      id: "q2",
      type: "quant",
      timeLimit: 30,
      question: "Сравните значения переменных:",
      colA: "Значение x, если: 3x - 1 = 14",
      colB: "Значение y, если: 2y + 1 = 11",
      options: [
        { text: "А, если значение в колонке А больше", isCorrect: false },
        { text: "В, если значение в колонке В больше", isCorrect: false },
        { text: "С, если оба значения равны между собой", isCorrect: true },
        { text: "D, если недостаточно информации для сравнения", isCorrect: false }
      ],
      hint: "Решите уравнения по отдельности.",
      explanation: "3x = 15 => x = 5.\n2y = 10 => y = 5.\n5 = 5. Значения абсолютно равны (С)."
    },
    {
      id: "q3",
      type: "quant",
      timeLimit: 30,
      question: "Дано условие: n < 8. Сравните значения:",
      colA: "Число n",
      colB: "Число 6",
      options: [
        { text: "А, если значение в колонке А больше", isCorrect: false },
        { text: "В, если значение в колонке В больше", isCorrect: false },
        { text: "С, если оба значения равны между собой", isCorrect: false },
        { text: "D, если недостаточно информации для сравнения", isCorrect: true }
      ],
      hint: "Проверьте граничные условия. Может ли n быть и больше, и меньше 6?",
      explanation: "Если n = 7 (что < 8), то А > В. Если n = 5, то А < В. Если n = 6, то они равны. Информации недостаточно (D)."
    }
  ],
  science: [
    {
      id: "s1",
      type: "science",
      timeLimit: 90,
      question: "Как именно парниковые газы (такие как углекислый газ, метан, водяной пар) влияют на климат нашей планеты?",
      options: [
        { text: "Повышают среднюю температуру Земли", isCorrect: true },
        { text: "Поглощают всю вредную солнечную энергию", isCorrect: false },
        { text: "Пропускают больше ультрафиолетового света сквозь атмосферу", isCorrect: false },
        { text: "Увеличивают общую концентрацию чистого кислорода в воздухе", isCorrect: false }
      ],
      hint: "Газы задерживают исходящее от нагретой Земли инфракрасное излучение.",
      explanation: "Парниковые газы создают эффект купола, задерживая тепловое излучение планеты и вызывая глобальное потепление."
    },
    {
      id: "s2",
      type: "science",
      timeLimit: 90,
      question: "Укажите правильную химическую формулу диоксида углерода (углекислого газа):",
      options: [
        { text: "CO", isCorrect: false },
        { text: "CO₂", isCorrect: true },
        { text: "O₂", isCorrect: false },
        { text: "H₂O", isCorrect: false }
      ],
      hint: "Приставка 'ди-' указывает на двойное содержание кислорода.",
      explanation: "Диоксид углерода содержит один атом углерода (C) и два атома кислорода (O), что соответствует формуле CO₂."
    },
    {
      id: "s3",
      type: "science",
      timeLimit: 90,
      question: "Рассмотрите схематичное изображение живой клетки. Как называется центральная органелла, обозначенная буквой X, которая хранит наследственную информацию (ДНК)?",
      svgType: "cell",
      options: [
        { text: "Вакуоль", isCorrect: false },
        { text: "Митохондрия", isCorrect: false },
        { text: "Цитоплазма", isCorrect: false },
        { text: "Ядро", isCorrect: true }
      ],
      hint: "Эта структура управляет всеми процессами клетки и имеет сферическую форму.",
      explanation: "Стрелка X указывает прямо на клеточное ядро, внутри которого находятся хромосомы, несущие ДНК."
    }
  ],
  russian: [
    {
      id: "r1",
      type: "russian",
      timeLimit: 120,
      textHeading: "Текст 1. Атсүйек беру",
      textContent: "По казахскому обычаю воину, оказавшемуся в затруднительном положении на поле боя, будь он даже незнакомцем, обязаны были помочь другие сарбазы (воины). Если кто-либо терял коня во время битвы и ему грозил плен, любой сарбаз обязан был усадить его на своего коня или уступить коня, жертвуя жизнью. К примеру, в XVIII веке во время битвы с джунгарами батыр Ботантай (из рода Аргын), увидев, что конь Абылай хана пал, не раздумывая уступил ему своего коня. Это и называлось «Атсүйек беру» - традиция, которой придерживались отважные и бескорыстные воины.",
      question: "Почему сарбаз так поступал по отношению к попавшему в беду товарищу? Потому что...",
      options: [
        { text: "друзья всегда помогают друг другу.", isCorrect: false },
        { text: "молодые должны почитать старших.", isCorrect: false },
        { text: "таков был воинский приказ.", isCorrect: false },
        { text: "таков был закон чести и благородства.", isCorrect: true }
      ],
      hint: "Прочитайте о бескорыстном самопожертвовании воинов. Речь идет не о простом приказе, а о глубоких внутренних ценностях Великой степи.",
      explanation: "Обычай «Атсүйек беру» отражал неписаный кодекс воинской чести и благородства Великой степи, требующий безусловной взаимопомощи сарбазов в бою вне зависимости от личного знакомства."
    },
    {
      id: "r2",
      type: "russian",
      timeLimit: 120,
      textHeading: "Текст 2. Дни рождения в истории",
      textContent: "Древние греки отмечали дни рождения своих богов 12 раз в год (так, день рождения Артемиды, богини Луны и охоты, праздновали шестого числа каждого месяца). Что же касается простых смертных, то такой привилегией пользовался только глава семьи — муж и отец, и то лишь один раз в году. На женщин и детей особого внимания не обращали. Но ни тогда, ни позже, в Средние века, дни рождения людей почти не отмечали. В основной своей массе человечество не пользовалось календарями. И жизнь каждого человека в отдельности ничего не значила.",
      question: "Какая важная информация отсутствует в данном тексте?",
      options: [
        { text: "Большинство людей обходилось без календарей.", isCorrect: false },
        { text: "В древности люди почитали жизнь каждого человека.", isCorrect: true },
        { text: "Женщины и дети не обладали особыми льготами.", isCorrect: false },
        { text: "Отец семейства имел право праздновать день рождения.", isCorrect: false }
      ],
      hint: "Ищите утверждение, которое прямо противоречит последней строчке текста: 'И жизнь каждого человека в отдельности ничего не значила'.",
      explanation: "В тексте утверждается обратное: в древности и Средневековье индивидуальная жизнь простого человека не имела высокого веса, поэтому информация о «почитании жизни каждого» отсутствует и противоречит смыслу."
    },
    {
      id: "r3",
      type: "russian",
      timeLimit: 120,
      textHeading: "Текст 3. Подводный Дайвинг",
      textContent: "[Абзац 1] Дайвинг — это прекрасное увлечение, благодаря которому можно увидеть множество подводных красот. Учиться нырять с аквалангом можно в реках или бассейнах, но такую красоту, как в настоящем море, в пресной воде не найти.\n\n[Абзац 2] На Мальдивских островах можно посмотреть на красивых звезд, безобидных акул, скатов и многих других представителей водного мира. На Мальте меньше красивых мест, но тут есть загадочные пещеры и каньоны. В южной части Мексики расположен остров Юкатан. Его окружают красивые подводные залы с воздушными куполами, сталагмитами и сталактитами.",
      question: "Какова логическая роль второго абзаца по отношению к первому?",
      options: [
        { text: "Он является его обоснованием (примером).", isCorrect: true },
        { text: "Он является его опровержением.", isCorrect: false },
        { text: "Он выступает в роли противопоставления.", isCorrect: false },
        { text: "Он представляет собой простое сравнение.", isCorrect: false }
      ],
      hint: "В первом абзаце заявлено о 'красотах настоящего моря'. Что делает второй абзац? Приводит конкретные географические примеры (Мальдивы, Мальта, Мексика).",
      explanation: "Второй абзац конкретизирует и обосновывает тезис первого о непревзойденном великолепии морских глубин, приводя примеры локаций с их уникальными особенностями."
    },
    {
      id: "r4",
      type: "russian",
      timeLimit: 120,
      textHeading: "Текст 4. Культура питания",
      textContent: "Если во время трапезы вы отвлекаетесь на постороннюю деятельность, то съедаете больше пищи, что ведет к перееданию. Ученые из Бристольского университета исследовали две группы испытуемых: представители первой ели не отвлекаясь, участники второй питались или играя на компьютере, или просматривая телепередачи. Как выяснилось, организм испытуемых из второй группы «забывал» про необходимость тщательно пережевывать пищу и оценивать уровень насыщения, поэтому люди «заглатывали» примерно вдвое больше пищи, чем те, кто питался без «внешних раздражителей».",
      question: "В каком именно значении в данном тексте использованы слова «внешние раздражители»?",
      options: [
        { text: "Громкая и ритмичная музыка.", isCorrect: false },
        { text: "Компьютерная игра и телепередача.", isCorrect: true },
        { text: "Окружающие вас шумные люди.", isCorrect: false },
        { text: "Приятный запах и аппетитный вид пищи.", isCorrect: false }
      ],
      hint: "Посмотрите, на что отвлекались участники второй группы из эксперимента Бристольского университета.",
      explanation: "Текст прямо связывает понятие «внешние раздражители» с факторами отвлечения второй группы — компьютерной игрой и просмотром телепередач."
    }
  ],
  kazakh: [
    {
      id: "k1",
      type: "kazakh",
      timeLimit: 120,
      textHeading: "1-мәтін. Жалқауларға арналған сағат",
      textContent: "Таңертең белгіленген уақытта ұйқыдан оятатын сағат әр үйде бар. Сағат шырылдаған кезде ұйқысын қимай, өшіре салып, әрі қарай ұйықтай беретін жалқаулар ортамызда аз емес. Осындайлар үшін жас инженерлер ұшатын қоңыраулы сағат ойлап тауыпты. Олар кәдімгі қоңыраулы сағатқа тікұшақтікіндей қанаттар орнатыпты. Қоңырау шырылдағанда, қанаттары айналып, сағатты төбеге көтеріп әкетеді. Кәдімгі екі кішкентай батареямен жұмыс істейтін сағат төбеде үш минут бойы шырылдап тұра алады.",
      question: "Мәтінде сипатталған бірегей сағаттың басты ерекшелігі неде?",
      options: [
        { text: "Әуезді ән айтып оятуында.", isCorrect: false },
        { text: "Батареядан қуат алып жұмыс істеуінде.", isCorrect: false },
        { text: "Кез келген үйде міндетті түрде болуында.", isCorrect: false },
        { text: "Қоңырау кезінде қанатымен ауада қалықтауында.", isCorrect: true }
      ],
      hint: "Мәтіндегі «ұшатын сағат», «қанаттары айналып төбеге көтеріп әкетеді» деген тіркестерге назар аударыңыз.",
      explanation: "Сағаттың басты техникалық ерекшелігі — шырылдаған кезде қанаттарының көмегімен төбеге ұшып (қалықтап) кетуінде."
    },
    {
      id: "k2",
      type: "kazakh",
      timeLimit: 120,
      textHeading: "2-мәтін. Кітап шығару сыры",
      textContent: "Кітап оқып, кітаппен дос болып өскен баланың қиялы ұшқыр, кез келген іске алғыр болады. Балаларға арнап шығарма жазу үлкендерге арнап жазғаннан гөрі қиын. «Кітап кішкентай баланың қолға ұстап көруіне қызық болуы керек. Көркем безендірілген, бояуы қанық кітаптар баланы көбірек қызықтырады. Балаларға арналған кітапты шығарар алдында маркетингтік зерттеу жүргіземіз. Балалар нені оқиды, қандай кітапқа қызығады, ата-ана қандай дүние іздейді — осының бәрін анықтаймыз. Қазіргі кітаптар мәтінмен ғана шектелмейді. Олар 3D панорама түрінде ашылады.",
      question: "Қай ақпарат мәтін мазмұнына толықтай сәйкес келеді?",
      options: [
        { text: "Балалар кітабын жазу кезінде тек ересектердің пікірі ескеріледі.", isCorrect: false },
        { text: "Балаларды қызықтыру мақсатында кітаптар суретсіз, тек мәтінмен шығарылады.", isCorrect: false },
        { text: "Балалар мен ата-аналардың қалауын зерттей отырып, кітаптар түрлі тартымды дизайнда (3D панорама) шығарылады.", isCorrect: true },
        { text: "Балаларға арналған кітап шығару ересектерге қарағанда әлдеқайда жеңіл.", isCorrect: false }
      ],
      hint: "Редактордың маркетингтік зерттеу және қазіргі 3D форматтағы заманауи безендірулер туралы сөздерін оқыңыз.",
      explanation: "Мәтінге сәйкес, баспагерлер зерттеу жүргізіп, балалар мен ата-аналардың қалауына сай 3D панорамалық қызықты кітаптар дайындайды."
    }
  ],
  english: [
    {
      id: "e1",
      type: "english",
      timeLimit: 120,
      textHeading: "Text 1. Monkey College in Boston",
      textContent: "Monkeys are like people in many ways. In fact, some of them even go to college! A 'monkey college' in Boston, Massachusetts, teaches the animals to become personal helpers for disabled people.\n\nThey chose capuchin monkeys to be their 'students' for a few reasons. Firstly, they are very small but have a large brain. This makes them very smart. And they have very short tails. So, unlike other monkeys, they use their hands just like people do. In addition, these monkeys can live for up to 40 years and get along well with humans.\n\nThe monkeys at the college begin their training when they are only a few months old. They start to learn simple things such as bringing food or picking things up. The training center is like a real house with a microwave, TV, and so on. When they can do more complicated things after several years of training, they 'graduate.' As each monkey has different talents, they are carefully matched with their new owners.",
      question: "Which statement is NOT mentioned as a reason for choosing capuchin monkeys to be students?",
      options: [
        { text: "They have a large brain relative to their body size.", isCorrect: false },
        { text: "They use their hands effectively like humans due to short tails.", isCorrect: false },
        { text: "They have a very long life expectancy (up to 40 years).", isCorrect: false },
        { text: "They have naturally strong physical health and resistance to diseases.", isCorrect: true }
      ],
      hint: "Read paragraph 2 carefully. It mentions size, brain, hands, and lifespan. Health resistance is not discussed.",
      explanation: "Paragraph 2 details intelligence (large brain), hand dexterity (short tail), and lifespan (40 years) as reasons. General 'resistance to diseases' is never mentioned."
    },
    {
      id: "e2",
      type: "english",
      timeLimit: 120,
      textHeading: "Text 2. School Library Notice",
      textContent: "Students are allowed to sign out three library books at a time from the fiction and non-fiction collections. This limit does not include textbooks. Students must present their library card when signing out books.\n\nWe ask that students do not sign out books for others because, if your friend or classmate loses the book, the person whose account was used will be held responsible. This can lead to hard feelings. Similarly, just as you wouldn't share your computer account, please avoid sharing your library account.",
      question: "What is the primary message of this school library notice?",
      options: [
        { text: "Students must not share their personal library accounts with others.", isCorrect: true },
        { text: "Textbooks count towards the three-book borrowing limit.", isCorrect: false },
        { text: "Students can sign out books without showing their library cards.", isCorrect: false },
        { text: "The library is closed for cleaning during the fiction collections update.", isCorrect: false }
      ],
      hint: "Look at the comparison: 'just as you wouldn't share your computer account, ...'",
      explanation: "The notice explicitly warns students against signing out books for other classmates using their accounts to prevent administrative issues and bad feelings."
    }
  ]
};

// --- PRE-DEFINED EXPANDED BADGES ---
const BADGES = [
  { id: "first", title: "Первооткрыватель", desc: "Завершил первую тренировку", icon: "compass", color: "from-blue-400 to-indigo-500" },
  { id: "math_hero", title: "Юный Архимед", desc: "Решил идеально тест по Математике", icon: "brain", color: "from-green-400 to-emerald-600" },
  { id: "logic_expert", title: "Мастер Величин", desc: "Сравнил без ошибок колонки А и Б", icon: "trophy", color: "from-yellow-400 to-amber-500" },
  { id: "nature_keeper", title: "Хранитель Земли", desc: "Набрал максимум баллов по Естествознанию", icon: "star", color: "from-teal-400 to-cyan-500" },
  { id: "linguist", title: "Полиглот НИШ", desc: "Идеально прошёл Языковой День 2", icon: "translate", color: "from-purple-500 to-pink-600" }
];

export default function App() {
  const [screen, setScreen] = useState('welcome'); // welcome | dashboard | game | results | theory | tips | errors
  const [soundOn, setSoundOn] = useState(true);
  const [currentSection, setCurrentSection] = useState(null); // math | quant | science | russian | kazakh | english
  const [gameMode, setGameMode] = useState('practice'); // practice | exam
  
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom dialog notifications (replacing window.alert / window.confirm)
  const [customDialog, setCustomDialog] = useState(null); // { message, onConfirm, type }

  // Gamification & Progress state
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('nis_v2_xp') || '0', 10));
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    return JSON.parse(localStorage.getItem('nis_v2_badges') || '[]');
  });
  const [errorLog, setErrorLog] = useState(() => {
    return JSON.parse(localStorage.getItem('nis_v2_errors') || '[]');
  });

  // Timers (Question-specific countdown & Exam global countdown)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(120);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(600);
  const [isExamTimerActive, setIsExamTimerActive] = useState(false);

  const questionTimerRef = useRef(null);
  const examTimerRef = useRef(null);

  // Modal / Hints / Celebration UI States
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // correct | incorrect | timeout
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(null);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('nis_v2_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('nis_v2_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('nis_v2_errors', JSON.stringify(errorLog));
  }, [errorLog]);

  // Handle Individual Question Timer Countdown
  useEffect(() => {
    if (isQuestionTimerActive && questionTimeLeft > 0 && !isSubmitted) {
      questionTimerRef.current = setTimeout(() => {
        setQuestionTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (questionTimeLeft === 0 && isQuestionTimerActive && !isSubmitted) {
      handleTimeOut();
    }
    return () => clearTimeout(questionTimerRef.current);
  }, [questionTimeLeft, isQuestionTimerActive, isSubmitted]);

  // Handle Exam Global Timer
  useEffect(() => {
    if (isExamTimerActive && examTimeLeft > 0) {
      examTimerRef.current = setTimeout(() => {
        setExamTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && isExamTimerActive) {
      triggerDialog("Время комплексного экзамена истекло! Переходим к результатам.", () => {
        handleFinishQuiz();
      }, "info");
    }
    return () => clearTimeout(examTimerRef.current);
  }, [examTimeLeft, isExamTimerActive]);

  // Helper to trigger custom non-blocking modal dialog
  const triggerDialog = (message, onConfirm = null, type = "info") => {
    setCustomDialog({ message, onConfirm, type });
  };

  const handleTimeOut = () => {
    setIsQuestionTimerActive(false);
    setIsSubmitted(true);
    setFeedback("timeout");
    setStreak(0);
    playSound('timeout', soundOn);

    const currentQ = activeQuestions[currentIndex];
    if (!errorLog.includes(currentQ.id)) {
      setErrorLog(prev => [...prev, currentQ.id]);
    }
  };

  const awardBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      const badgeObj = BADGES.find(b => b.id === badgeId);
      setShowBadgeCelebration(badgeObj);
      playSound('badge', soundOn);
    }
  };

  // --- INITIATING QUIZ SESSION ---
  const startQuiz = (section, mode) => {
    let list = [];
    if (section === 'errors') {
      const allQ = [
        ...QUESTION_BANK.math, 
        ...QUESTION_BANK.quant, 
        ...QUESTION_BANK.science,
        ...QUESTION_BANK.russian,
        ...QUESTION_BANK.kazakh,
        ...QUESTION_BANK.english
      ];
      list = allQ.filter(q => errorLog.includes(q.id));
      if (list.length === 0) {
        triggerDialog("В твоей 'Работе над ошибками' пока пусто! Проходи тесты и совершай ошибки, чтобы практиковаться здесь.", null, "info");
        return;
      }
    } else {
      list = [...QUESTION_BANK[section]];
    }

    // Configure questions for Exam vs Practice
    if (mode === 'exam') {
      list = list.sort(() => 0.5 - Math.random()).slice(0, 5); // Take 5 questions for quick standard tests
      setExamTimeLeft(450); // 7.5 minutes total
      setIsExamTimerActive(true);
    } else {
      list = list.sort(() => 0.5 - Math.random());
    }

    setCurrentSection(section);
    setGameMode(mode);
    setActiveQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setScreen('game');
    
    // Set individual countdown for first question
    const firstLimit = list[0]?.timeLimit || 90;
    setQuestionTimeLeft(firstLimit);
    setIsQuestionTimerActive(true);
  };

  const handleSelectOption = (index) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    setIsQuestionTimerActive(false);
    const currentQ = activeQuestions[currentIndex];
    const isCorrect = currentQ.options[selectedOption].isCorrect;
    setIsSubmitted(true);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      
      // Educational calculation formula for reward scaling
      const baseReward = currentQ.type === 'quant' ? 10 : 15;
      const streakBonus = newStreak >= 3 ? 10 : 0;
      setXp(prev => prev + baseReward + streakBonus);
      
      setFeedback("correct");
      playSound('correct', soundOn);

      if (newStreak === 5) {
        awardBadge("streak_5");
      }

      // Automatically clean resolved error log
      if (currentSection === 'errors') {
        setErrorLog(prev => prev.filter(id => id !== currentQ.id));
      }
    } else {
      setStreak(0);
      setFeedback("incorrect");
      playSound('incorrect', soundOn);

      if (!errorLog.includes(currentQ.id)) {
        setErrorLog(prev => [...prev, currentQ.id]);
      }
    }
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowHint(false);
    setFeedback(null);

    if (currentIndex + 1 < activeQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextLimit = activeQuestions[nextIdx]?.timeLimit || 90;
      setQuestionTimeLeft(nextLimit);
      setIsQuestionTimerActive(true);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsQuestionTimerActive(false);
    setIsExamTimerActive(false);
    setScreen('results');

    awardBadge("first");

    const perfectScore = correctCount === activeQuestions.length;
    if (perfectScore && activeQuestions.length >= 3) {
      if (currentSection === 'math') awardBadge("math_hero");
      if (currentSection === 'quant') awardBadge("logic_expert");
      if (currentSection === 'science') awardBadge("nature_keeper");
      if (['russian', 'kazakh', 'english'].includes(currentSection)) awardBadge("linguist");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col transition-all selection:bg-teal-100">
      
      {/* --- PREMIUM HEADER --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          {/* Logo with interactive dashboard jump */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90" onClick={() => setScreen('welcome')}>
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-100 flex items-center justify-center">
              <Icon name="brain" className="w-6 h-6 animate-pulse" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">ИНТЕЛЛЕКТУМ-6</span>
              <span className="text-[10px] block text-emerald-600 font-bold uppercase tracking-wider -mt-1">Подготовка к НИШ v2.0</span>
            </div>
          </div>

          {/* Gamified Stats Panel */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 text-emerald-700 font-bold text-sm shadow-xs transition-transform hover:scale-105">
              <Icon name="sparkles" className="text-emerald-500 w-4 h-4" size={16} />
              <span>{xp} <span className="text-xs font-medium text-emerald-600">XP</span></span>
            </div>

            {screen === 'game' && streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 text-orange-600 font-bold text-sm animate-bounce">
                <Icon name="flame" className="text-orange-500 w-4 h-4" size={16} />
                <span>x{streak}</span>
              </div>
            )}

            <button 
              onClick={() => setSoundOn(!soundOn)} 
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title={soundOn ? "Выключить звук" : "Включить звук"}
            >
              <Icon name={soundOn ? "volume" : "volumeX"} className="w-5 h-5" size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* --- CONTENT WORKSPACE --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        
        {/* --- SCREEN 1: WELCOME INTRO --- */}
        {screen === 'welcome' && (
          <div className="grid md:grid-cols-12 gap-8 items-center py-6">
            
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 font-semibold px-3 py-1 rounded-full text-xs">
                <Icon name="translate" className="w-4 h-4 text-purple-700" size={14} />
                <span>ОБНОВЛЕНИЕ: Добавлен 2-й Языковой День и индивидуальные таймеры!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Интеллектуальная подготовка к <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-emerald-600">НИШ</span>
              </h1>
              
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                Комплексный образовательный тренажёр для отбора в 7-е классы Назарбаев Интеллектуальных школ. Программа охватывает два дня тестирования: Оценку математических и научных способностей, а также Языковой тест с развитием читательской грамотности.
              </p>

              {/* Navigation Options */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => setScreen('dashboard')} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-lg"
                >
                  <span>Открыть разделы тестов</span>
                  <Icon name="arrowRight" className="w-5 h-5" size={20} />
                </button>
                <button 
                  onClick={() => setScreen('theory')} 
                  className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold px-6 py-4 rounded-2xl transition-all flex items-center gap-2 text-lg"
                >
                  <Icon name="book" className="w-5 h-5 text-slate-500" size={20} />
                  <span>База знаний</span>
                </button>
              </div>

              {/* Professional Pedagogical block */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/60 flex gap-3 items-start">
                <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
                  <Icon name="lightbulb" size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Развитие функциональной грамотности:</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    В соответствии с международными стандартами Cito и Johns Hopkins CTY, задания проверяют не просто память, а навыки критического мышления, интерпретации графических данных и скорость принятия решений в условиях жесткого тайминга.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile & Achivements Panel */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 to-purple-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              
              <div className="relative z-10 space-y-4">
                <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-3 py-1 rounded-full">Профиль Ученика</span>
                <div className="flex items-center gap-3 mt-4">
                  <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 text-yellow-300">
                    <Icon name="trophy" size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl">Претендент НИШ</h3>
                    <p className="text-purple-200 text-sm">Уровень {Math.floor(xp / 100) + 1}</p>
                  </div>
                </div>
              </div>

              {/* Progress meters */}
              <div className="relative z-10 mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-purple-100">
                    <span>До следующего уровня</span>
                    <span>{xp % 100} / 100 XP</span>
                  </div>
                  <div className="w-full bg-indigo-950/40 rounded-full h-3 overflow-hidden p-0.5 border border-indigo-850/20">
                    <div className="bg-gradient-to-r from-yellow-400 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${xp % 100}%` }}></div>
                  </div>
                </div>

                {/* Achieved Badges panel */}
                <div className="pt-2 border-t border-purple-500/30">
                  <span className="text-xs font-bold block mb-2 text-purple-100">Твои достижения ({unlockedBadges.length} / {BADGES.length}):</span>
                  <div className="flex gap-2">
                    {BADGES.map(badge => {
                      const isUnlocked = unlockedBadges.includes(badge.id);
                      return (
                        <div 
                          key={badge.id} 
                          title={`${badge.title}: ${badge.desc}`}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${isUnlocked ? 'bg-white/20 border-white/40 text-yellow-300 shadow-sm' : 'bg-black/30 border-white/5 text-white/20'}`}
                        >
                          <Icon name={badge.icon} size={16} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- SCREEN 2: SUBJECT SELECT DASHBOARD --- */}
        {screen === 'dashboard' && (
          <div className="space-y-8 py-4 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950">Интерактивные Разделы Тестирования</h2>
                <p className="text-slate-500 mt-1">Выберите предметную область для комплексной тренировки по стандартам НИШ</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setScreen('tips')} className="bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
                  <Icon name="star" className="text-amber-500" size={16} />
                  <span>Советы НИШ</span>
                </button>
                <button onClick={() => setScreen('welcome')} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors">
                  <Icon name="home" size={16} />
                  <span>Главная</span>
                </button>
              </div>
            </div>

            {/* Subject Categories */}
            <div className="space-y-6">
              
              {/* Day 1 Section Heading */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">ДЕНЬ 1. Естественно-Математическое Направление</span>
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  
                  {/* Math */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-emerald-100 text-emerald-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <Icon name="brain" className="text-emerald-700" size={22} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-emerald-700 transition-colors">Математика</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Тесты на вычисление дробей, работу с последовательностями, процентами, масштабами и углами.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 90 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('math', 'practice')} className="flex-1 bg-white border border-emerald-600 text-emerald-700 font-bold py-2 rounded-xl text-xs hover:bg-emerald-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('math', 'exam')} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-emerald-700 transition-colors">Экзамен</button>
                    </div>
                  </div>

                  {/* Quantitative Comparisons */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-amber-100 text-amber-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <Icon name="trophy" className="text-amber-700" size={22} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-amber-700 transition-colors">Количественные</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Уникальные логические сравнения колонок А и Б. Развивают математическую интуицию.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 30 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('quant', 'practice')} className="flex-1 bg-white border border-amber-600 text-amber-700 font-bold py-2 rounded-xl text-xs hover:bg-amber-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('quant', 'exam')} className="flex-1 bg-amber-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-amber-600 transition-colors">Экзамен</button>
                    </div>
                  </div>

                  {/* Science */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-cyan-100 text-cyan-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <Icon name="compass" className="text-cyan-700" size={22} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-cyan-700 transition-colors">Естествознание</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Глобальное потепление, строение клеток эукариотов, теплофизика, экологические феномены.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 90 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('science', 'practice')} className="flex-1 bg-white border border-cyan-600 text-cyan-700 font-bold py-2 rounded-xl text-xs hover:bg-cyan-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('science', 'exam')} className="flex-1 bg-cyan-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-cyan-700 transition-colors">Экзамен</button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Day 2 Section Heading */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">ДЕНЬ 2. Языковой Тест (Читательская Грамотность)</span>
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  
                  {/* Russian (First language) */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-purple-100 text-purple-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <span className="font-black text-sm">РУС</span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-purple-700 transition-colors">Русский язык</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Разборы текстов о воинских законах сарбазов, подводном плавании и психологии отвлечения при трапезе.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 120 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('russian', 'practice')} className="flex-1 bg-white border border-purple-600 text-purple-700 font-bold py-2 rounded-xl text-xs hover:bg-purple-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('russian', 'exam')} className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-purple-700 transition-colors">Экзамен</button>
                    </div>
                  </div>

                  {/* Kazakh (Second language) */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-purple-100 text-purple-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <span className="font-black text-sm">ҚАЗ</span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-purple-700 transition-colors">Қазақ тілі</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Мәтінмен жұмыс: ұшатын сағат, 3D форматтағы балалар кітаптары мен музыканың адам миына әсері.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 120 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('kazakh', 'practice')} className="flex-1 bg-white border border-purple-600 text-purple-700 font-bold py-2 rounded-xl text-xs hover:bg-purple-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('kazakh', 'exam')} className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-purple-700 transition-colors">Экзамен</button>
                    </div>
                  </div>

                  {/* English */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="p-6 space-y-4">
                      <div className="bg-purple-100 text-purple-800 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xs">
                        <span className="font-black text-sm">ENG</span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg group-hover:text-purple-700 transition-colors">English Language</h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                          Reading comprehensions on Boston Monkey Helper College, libraries notices and ecological activities.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-md inline-block">Таймер: 120 сек / вопрос</span>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                      <button onClick={() => startQuiz('english', 'practice')} className="flex-1 bg-white border border-purple-600 text-purple-700 font-bold py-2 rounded-xl text-xs hover:bg-purple-50 transition-colors">Тренировка</button>
                      <button onClick={() => startQuiz('english', 'exam')} className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-purple-700 transition-colors">Экзамен</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Error Log Block & Statistics */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              
              {/* Active Error Log Container */}
              <div className="bg-slate-100/80 border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-700 p-1.5 rounded-xl">
                      <Icon name="rotate" size={16} />
                    </span>
                    <span>Работа над ошибками ({errorLog.length})</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Тренажер автоматически сохраняет задания с неверными ответами. Отработай их без ограничений по времени, чтобы повысить уверенность!
                  </p>
                </div>
                <button 
                  onClick={() => startQuiz('errors', 'practice')}
                  disabled={errorLog.length === 0}
                  className={`font-bold px-5 py-3 rounded-xl text-sm transition-all ${errorLog.length > 0 ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Запустить разбор ошибок
                </button>
              </div>

              {/* Stats overview */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900">Прогресс Интеллектуала:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-semibold">Набранный опыт:</span>
                      <span className="text-xl font-black text-emerald-600">{xp} XP</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-semibold">Достижения (Бейджи):</span>
                      <span className="text-xl font-black text-purple-600">{unlockedBadges.length} / {BADGES.length}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Версия платформы: 2026.2</span>
                  <button 
                    onClick={() => {
                      triggerDialog("Ты хочешь полностью сбросить свой прогресс?", () => {
                        setXp(0);
                        setUnlockedBadges([]);
                        setErrorLog([]);
                        localStorage.clear();
                      }, "confirm");
                    }}
                    className="text-slate-400 hover:text-rose-600 text-xs font-semibold underline cursor-pointer"
                  >
                    Сбросить результаты
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- SCREEN 3: ACTIVE TEST SESSION (WITH COUNTDOWN TIMER) --- */}
        {screen === 'game' && activeQuestions.length > 0 && (
          <div className="space-y-6 py-2 animate-fade-in max-w-3xl mx-auto">
            
            {/* Game session Header */}
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    triggerDialog("Вы действительно хотите покинуть текущую сессию тестирования?", () => {
                      setScreen('dashboard');
                    }, "confirm");
                  }}
                  className="bg-slate-200 hover:bg-slate-300 p-2 rounded-xl text-slate-700 transition-colors"
                >
                  <Icon name="x" size={16} />
                </button>
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-400">
                    {gameMode === 'exam' ? 'Экзаменационный режим' : 'Тренировка'} 
                  </span>
                  <h3 className="font-black text-slate-900 -mt-1">Вопрос {currentIndex + 1} из {activeQuestions.length}</h3>
                </div>
              </div>

              {/* Dual Timers (Global exam and individual question timers) */}
              <div className="flex items-center gap-2">
                
                {/* Individual Question Countdown */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm border shadow-xs ${questionTimeLeft <= 10 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                  <Icon name="clock" className="w-4 h-4" size={16} />
                  <span>{questionTimeLeft} сек</span>
                </div>

                {/* Global Exam Countdown */}
                {gameMode === 'exam' && (
                  <div className="bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono">
                    Экзамен: {Math.floor(examTimeLeft / 60)}:{String(examTimeLeft % 60).padStart(2, '0')}
                  </div>
                )}

              </div>
            </div>

            {/* Main Question Card with Reading Text if applicable */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
              
              {/* Text segment for language reading questions */}
              {activeQuestions[currentIndex].textHeading && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl max-h-72 overflow-y-auto space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <Icon name="book" className="text-purple-600" size={16} />
                    <span>{activeQuestions[currentIndex].textHeading}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-serif">
                    {activeQuestions[currentIndex].textContent}
                  </p>
                </div>
              )}

              {/* Question text */}
              <div className="space-y-3">
                <p className="text-slate-900 text-lg font-black leading-relaxed whitespace-pre-line">
                  {activeQuestions[currentIndex].question}
                </p>

                {activeQuestions[currentIndex].mathExpression && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center font-serif text-xl text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 mr-2">Выражение:</span>
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1.5 rounded-lg border border-emerald-100 font-mono text-sm tracking-wide">
                        {activeQuestions[currentIndex].mathExpression}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Visual SVG elements */}
              {activeQuestions[currentIndex].svgType === "coordinate" && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <svg width="100%" height="80" viewBox="0 0 500 80" className="max-w-md">
                    <line x1="20" y1="40" x2="480" y2="40" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                    <polygon points="480,40 470,35 470,45" fill="#334155" />
                    <circle cx="80" cy="40" r="4" fill="#059669" />
                    <text x="80" y="30" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#059669">A(16)</text>
                    <circle cx="160" cy="40" r="4" fill="#059669" />
                    <text x="160" y="30" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#059669">B(20)</text>
                    <circle cx="200" cy="40" r="4" fill="#94a3b8" stroke="#334155" />
                    <text x="200" y="30" fontSize="11" textAnchor="middle" fill="#64748b">C</text>
                    <circle cx="220" cy="40" r="4" fill="#94a3b8" stroke="#334155" />
                    <text x="220" y="30" fontSize="11" textAnchor="middle" fill="#64748b">D</text>
                    <path d="M 80 48 Q 120 60 160 48" fill="none" stroke="#059669" strokeDasharray="3,3" />
                    <text x="120" y="65" fontSize="10" textAnchor="middle" fill="#059669" fontWeight="bold">S = 4</text>
                  </svg>
                </div>
              )}

              {activeQuestions[currentIndex].svgType === "circles" && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="65" fill="#10b981" stroke="#047857" strokeWidth="2" />
                    <circle cx="45" cy="45" r="18" fill="#f8fafc" stroke="#047857" strokeWidth="1.5" />
                    <circle cx="95" cy="45" r="18" fill="#f8fafc" stroke="#047857" strokeWidth="1.5" />
                    <circle cx="45" cy="95" r="18" fill="#f8fafc" stroke="#047857" strokeWidth="1.5" />
                    <circle cx="95" cy="95" r="18" fill="#f8fafc" stroke="#047857" strokeWidth="1.5" />
                  </svg>
                </div>
              )}

              {activeQuestions[currentIndex].svgType === "cell" && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <rect x="15" y="15" width="130" height="130" rx="30" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" />
                    <ellipse cx="45" cy="60" rx="15" ry="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="45" y="63" fontSize="8" fill="#0284c7" textAnchor="middle">Вакуоль</text>
                    <circle cx="100" cy="95" r="24" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                    <circle cx="100" cy="95" r="6" fill="#ca8a04" />
                    <text x="100" y="113" fontSize="8" fill="#854d0e" textAnchor="middle" fontWeight="bold">Ядро</text>
                    <ellipse cx="115" cy="45" rx="8" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" />
                    <path d="M111,40 Q115,45 119,40 Q111,48 119,48" fill="none" stroke="#dc2626" strokeWidth="0.8" />
                    <line x1="145" y1="95" x2="115" y2="95" stroke="#000" strokeWidth="1.5" />
                    <text x="150" y="98" fontSize="12" fontWeight="black" fill="#000">X</text>
                  </svg>
                </div>
              )}

              {/* Quantitative Columns comparisons structure */}
              {activeQuestions[currentIndex].type === "quant" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border-2 text-center transition-all ${isSubmitted ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/40 border-emerald-500/20'}`}>
                    <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">Колонка А</span>
                    <p className="font-extrabold text-base text-slate-800 mt-2 whitespace-pre-line">{activeQuestions[currentIndex].colA}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border-2 text-center transition-all ${isSubmitted ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/40 border-blue-500/20'}`}>
                    <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Колонка Б</span>
                    <p className="font-extrabold text-base text-slate-800 mt-2 whitespace-pre-line">{activeQuestions[currentIndex].colB}</p>
                  </div>
                </div>
              )}

              {/* Interactive Options Choice Grid */}
              <div className="grid md:grid-cols-2 gap-3.5 pt-2">
                {activeQuestions[currentIndex].options.map((option, idx) => {
                  
                  let btnStyle = "bg-white border-slate-200 hover:border-slate-300 text-slate-800";
                  let checkIcon = null;

                  if (selectedOption === idx) {
                    btnStyle = "bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold";
                  }

                  if (isSubmitted) {
                    if (option.isCorrect) {
                      btnStyle = "bg-emerald-100 border-emerald-600 text-emerald-900 font-extrabold shadow-xs";
                      checkIcon = <Icon name="check" className="text-emerald-700 shrink-0" size={16} />;
                    } else if (selectedOption === idx) {
                      btnStyle = "bg-rose-100 border-rose-500 text-rose-900 font-semibold";
                      checkIcon = <Icon name="x" className="text-rose-600 shrink-0" size={16} />;
                    } else {
                      btnStyle = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-3 text-sm shadow-2xs ${btnStyle}`}
                    >
                      <span>{option.text}</span>
                      {checkIcon}
                    </button>
                  );
                })}
              </div>

              {/* Time out warning panel */}
              {feedback === 'timeout' && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-900 animate-bounce">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <h5 className="font-black">Время истекло!</h5>
                    <p className="text-xs">Вы не успели дать ответ в рамках среднего времени НИШ. Задание помечено неверным.</p>
                  </div>
                </div>
              )}

              {/* Interactive Hints and action triggers */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
                
                <div>
                  {gameMode === 'practice' && !isSubmitted && (
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <Icon name="lightbulb" size={14} />
                      <span>{showHint ? "Скрыть подсказку" : "Нужна подсказка?"}</span>
                    </button>
                  )}
                </div>

                <div>
                  {!isSubmitted ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleSubmitAnswer}
                      className={`font-black px-6 py-3 rounded-2xl text-xs transition-all flex items-center gap-2 shadow-xs ${selectedOption !== null ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      <span>Ответить</span>
                      <Icon name="arrowRight" size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-100 animate-pulse"
                    >
                      <span>{currentIndex + 1 === activeQuestions.length ? "Завершить и показать отчет" : "Продолжить"}</span>
                      <Icon name="arrowRight" size={14} />
                    </button>
                  )}
                </div>

              </div>

              {/* Hint output */}
              {showHint && !isSubmitted && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs leading-relaxed animate-slide-up flex gap-3">
                  <span className="text-xl">💡</span>
                  <p>{activeQuestions[currentIndex].hint}</p>
                </div>
              )}

              {/* Thorough pedagogical explanation outputs */}
              {isSubmitted && (
                <div className={`p-5 rounded-2xl border animate-slide-up space-y-3 ${activeQuestions[currentIndex].options[selectedOption]?.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                  <div className="flex items-center gap-2">
                    {activeQuestions[currentIndex].options[selectedOption]?.isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">Правильный выбор! +15 XP</span>
                    ) : (
                      <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">Неверный выбор</span>
                    )}
                    <span className="text-slate-500 font-bold text-xs uppercase">Разбор темы преподавателем:</span>
                  </div>
                  <p className="text-slate-700 text-xs whitespace-pre-line leading-relaxed pl-1 font-serif">
                    {activeQuestions[currentIndex].explanation}
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* --- SCREEN 4: RESULTS REPORT CARD --- */}
        {screen === 'results' && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-md animate-scale-up">
            
            <div className="bg-emerald-100 text-emerald-800 w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-md">
              <Icon name="trophy" size={40} className="text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-950">Тест завершен!</h2>
              <p className="text-slate-500 text-sm">Ты показал отличные результаты подготовки!</p>
            </div>

            {/* Performance Stats */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-bold">Правильных ответов:</span>
                <span className="text-2xl font-black text-emerald-600">{correctCount} из {activeQuestions.length}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-bold">Очки опыта:</span>
                <span className="text-2xl font-black text-amber-500">+{correctCount * 15} XP</span>
              </div>
            </div>

            {/* Score interpretation */}
            <div className="text-sm text-slate-600 px-4">
              {correctCount === activeQuestions.length ? (
                <p className="font-semibold text-emerald-700">🏆 Абсолютный рекорд! Ты готов покорять экзамены НИШ на 100%!</p>
              ) : correctCount / activeQuestions.length >= 0.7 ? (
                <p className="font-semibold text-slate-700">🎉 Великолепный результат! Твой проходной балл гарантирован.</p>
              ) : (
                <p className="text-slate-500">Неплохая попытка! Проработай ошибки и попробуй ещё раз в режиме Тренировки.</p>
              )}
            </div>

            {/* Control buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => setScreen('dashboard')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-100"
              >
                Вернуться на панель тем
              </button>
              <button 
                onClick={() => setScreen('theory')}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                Повторить теорию в учебнике
              </button>
            </div>

          </div>
        )}

        {/* --- SCREEN 5: THEORY COMPASS & FORMULAS --- */}
        {screen === 'theory' && (
          <div className="space-y-6 py-2 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Теоретический справочник НИШ</h2>
                <p className="text-slate-500 mt-1">Ключевые понятия и шпаргалки, необходимые для сдачи обоих дней экзамена</p>
              </div>
              <button onClick={() => setScreen('dashboard')} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Назад к темам
              </button>
            </div>

            {/* Theory blocks */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card 1: Math Fractions & Decimals */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs">Математика</span>
                <h3 className="font-extrabold text-lg text-slate-900">Периодические дроби и Пропорции</h3>
                <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Для перевода <strong>чистой периодической десятичной дроби</strong> в обыкновенную необходимо записать период дроби в числитель, а в знаменателе поставить столько девяток, сколько цифр в периоде.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl font-mono text-center border border-slate-100 text-slate-800 text-xs">
                    0.(42) = 42/99;  0.(3) = 3/9 = 1/3;  0.(123) = 123/999
                  </div>
                  <p>
                    <strong>Масштаб карты:</strong> это отношение длины отрезка на карте к реальной длине. Если масштаб 1 : 120 000 000, это означает, что в 1 см на карте скрывается 120 000 000 см (или 1 200 км) на местности.
                  </p>
                </div>
              </div>

              {/* Card 2: Column comparisons tips */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                <span className="bg-amber-100 text-amber-800 font-extrabold px-3 py-1 rounded-full text-xs">Количественные сравнения</span>
                <h3 className="font-extrabold text-lg text-slate-900">Как побеждать в Колонках А и Б?</h3>
                <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Этот блок проверяет способность быстро оценивать математические выражения без лишних расчетов:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Выбирай <strong>А</strong>, если величина А гарантированно больше величины Б при всех условиях.</li>
                    <li>Выбирай <strong>В</strong>, если величина Б гарантированно больше А.</li>
                    <li>Выбирай <strong>С</strong>, если величины точно равны.</li>
                    <li>Выбирай <strong>D</strong>, если при одних значениях переменных больше А, а при других — Б (недостаточно данных).</li>
                  </ul>
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl font-semibold">
                    💡 Совет: всегда подставляйте крайние числа (ноль, единицу, дроби, отрицательные числа), чтобы проверить стабильность ответа!
                  </p>
                </div>
              </div>

              {/* Card 3: Biology Cell organelles */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                <span className="bg-cyan-100 text-cyan-800 font-extrabold px-3 py-1 rounded-full text-xs">Биология и Естествознание</span>
                <h3 className="font-extrabold text-lg text-slate-900">Органеллы живой клетки</h3>
                <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Все живые эукариоты состоят из клеток. Сравнение царств часто встречается в НИШ тестах:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong>Ядро:</strong> Хранит генетическую информацию (ДНК), управляет клеткой. Есть у Растений, Животных и Грибов.</li>
                    <li><strong>Вакуоль:</strong> Резервуар с клеточным соком. Крупные вакуоли характерны для Растений и Грибов.</li>
                    <li><strong>Клеточная стенка (оболочка):</strong> Защитный жесткий слой. Есть у растений (из целлюлозы) и грибов (из хитина). У животных её НЕТ.</li>
                    <li><strong>Хлоропласты:</strong> Зеленые органеллы фотосинтеза. Есть только у Растений.</li>
                  </ul>
                </div>
              </div>

              {/* Card 4: Physics sound speed */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                <span className="bg-cyan-100 text-cyan-800 font-extrabold px-3 py-1 rounded-full text-xs">Физика и Земля</span>
                <h3 className="font-extrabold text-lg text-slate-900">Скорость звука и Тепловое расширение</h3>
                <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>Расчет расстояния грозы:</strong> Свет распространяется мгновенно (300 000 км/с). Звук движется медленнее — около 340 м/с. Поэтому мы видим вспышку сразу, а гром слышим с опозданием. Расстояние S = t_опоздания * V_звука.
                  </p>
                  <p>
                    <strong>Тепловое расширение:</strong> При нагревании молекулы вещества колеблются энергичнее. Расстояние между ними увеличивается, что приводит к увеличению объёма всего тела. Сами размеры молекул при этом НЕ меняются!
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- SCREEN 6: TIPS FROM NIS GRADUATES --- */}
        {screen === 'tips' && (
          <div className="space-y-6 py-2 animate-fade-in max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                <Icon name="gradCap" className="text-emerald-600" size={32} />
                <span>Лайфхаки от выпускников НИШ</span>
              </h2>
              <button onClick={() => setScreen('dashboard')} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Назад к темам
              </button>
            </div>

            <div className="space-y-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-extrabold">1</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Правило 40 секунд</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    На одно задание раздела «Количественные характеристики» в реальном тесте дается меньше минуты (60 заданий за 30 минут). Если задание не поддается за 40 секунд — ставь примерный ответ, делай отметку на полях и иди дальше. Не зависай!
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-extrabold">2</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Исключение невозможного</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Всегда отсекай заведомо ложные варианты. Если в задаче по физике скорость звука 340 м/с, а время задержки 8 секунд, расстояние никак не может быть 40 метров (это расстояние за сотую долю секунды) — этот вариант сразу можно исключить.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-extrabold">3</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Внимательно читай легенду карт</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    В вопросах естествознания часто дают карты или диаграммы (как с бегемотами). Ответы НА 100% заложены в графике и легенде обозначений, глубокие знания биологии там даже не требуются. Учись читать графики!
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-extrabold">4</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Постоянные тренировки</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Проходи «Экзамен» в этом тренажере каждый день. Это тренирует психологическую выносливость к таймеру и убирает страх перед настоящим компьютерным бланком.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER LOGO & COPYRIGHT --- */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-slate-400 text-xs">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-500">Разработано с заботой о будущем образовании Казахстана 🇰🇿</p>
          <p>© 2026 Интеллектум-6. Все права на методические материалы принадлежат соответствующим правообладателям.</p>
        </div>
      </footer>

      {/* --- CUSTOM DIALOG OVERLAY MODAL (REPLACING alert/confirm) --- */}
      {customDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 animate-scale-up">
            <h4 className="font-black text-lg text-slate-900">Подтвердите действие</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{customDialog.message}</p>
            <div className="flex gap-2">
              {customDialog.type === "confirm" ? (
                <>
                  <button 
                    onClick={() => {
                      if (customDialog.onConfirm) customDialog.onConfirm();
                      setCustomDialog(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Да, уверен
                  </button>
                  <button 
                    onClick={() => setCustomDialog(null)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    if (customDialog.onConfirm) customDialog.onConfirm();
                    setCustomDialog(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Хорошо
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- BADGE CELEBRATION OVERLAY MODAL --- */}
      {showBadgeCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full border border-slate-100 shadow-2xl relative space-y-4 animate-scale-up">
            
            <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${showBadgeCelebration.color} text-yellow-300 flex items-center justify-center shadow-lg shadow-emerald-100`}>
              <Icon name={showBadgeCelebration.icon} size={32} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block">Разблокировано новое достижение!</span>
              <h3 className="font-black text-xl text-slate-950">{showBadgeCelebration.title}</h3>
              <p className="text-xs text-slate-500">{showBadgeCelebration.desc}</p>
            </div>

            <button 
              onClick={() => setShowBadgeCelebration(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl text-sm transition-colors"
            >
              Отлично!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}