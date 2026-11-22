/* ======================================
   1. إعدادات الموقع
====================================== */

const letterMessage = `
كل سنة وإنتِ طيبة يا جني، ويا رب تكون سنة حلوة عليكي، مليانة فرحة وتحققي فيها كل حاجة نفسك فيها، وتفضلي دايمًا مبسوطة.

بصراحة أنا مش عارف أقول إيه، لأن فيه كلام كتير جوايا ونفسي أقولهولك، بس يمكن النهارده أحسن فرصة إني أعبّر عن جزء منه.

أنا بقالي 3 سنين بحبك، 3 سنين فيهم حاجات كتير اتغيرت، لكن إحساسي ناحيتك متغيرش بالعكس دا كان كل يوم حبي ليكي بيزيد ويمكن إنتِ متعرفيش قد إيه وجودك حتى من بعيد، فارق معايا، وقد إيه إنتِ ليكي مكانة خاصة عندي.

أنا مش عايز حبي ليكي يكون مجرد كلام، أنا نفسي في يوم أكون شخص ناجح وقادر يتحمل المسؤولية، وأجيلك من الباب وأطلبك بالحلال. دي أمنية بتمنى ربنا يحققها، وإنتِ واحدة من الأهداف اللي نفسي أوصلها، ولو فيها خير لينا ربنا يجمعنا على خير.

 وعايزك تعرفي إن هفضل احبك حتي لو مفيش بينا تواصل، وهفضل أحبك من بعيد لحد لما اجي اخبط علي باب بيتك وحتى لو ربنا ما كتبش إنك تكوني من نصيبي بعد الشر طبعا هتفضلي إنسانة ليها مكانة خاصة عندي وعمري ماهقدر انساكي بجد ياجني

أنا مش مستني منك أي حاجة، ولا عايز منك أي حاجة دلوقتي أنا بس حبيت تكوني عارفة اللي جوايا.

يمكن مش عارف الأيام مخبية إيه ولا ربنا كاتب لنا إيه، بس اللي أعرفه إني بتمنالك كل الخير، وبدعيلك تكوني أسعد واحدة وتوصلي لكل أحلامك.

وفي يوم ميلادك، أتمنى من قلبي إن كل أيامك الجاية تكون أحلى، وإن الضحكة متفارقش وشك أبدًا.

وكل سنة وإنتِ طيبة يا جني أو ياجنجونتي.

وياريت متوريش الموقع دا لحد من صحابك.
`;

const spotifyLink =
    "https://open.spotify.com/embed/track/4CoY8ObNGh8Ses7kzGiTfm";

const SUPABASE_URL =
    "https://tyykouygbwwnqjeucwkz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_to7wgEX5xqoHhl1V-0Fq6Q__6761fNH";

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}


/* ======================================
   2. عناصر الصفحات
====================================== */

const screens = {
    quiz: document.getElementById("quizScreen"),
    success: document.getElementById("successScreen"),
    music: document.getElementById("musicScreen"),
    envelope: document.getElementById("envelopeScreen"),
    message: document.getElementById("messageScreen"),
    ending: document.getElementById("endingScreen")
};


/* ======================================
   3. ظهور العناصر
====================================== */

function prepareReveal(screen) {
    if (!screen) return;

    const elements = screen.querySelectorAll(".reveal-item");

    elements.forEach((element, index) => {
        const delay = Math.min(index * 0.13, 1.3);
        element.style.setProperty("--delay", `${delay}s`);
    });
}

prepareReveal(screens.quiz);


/* ======================================
   4. الانتقال بين الصفحات
====================================== */

let changingScreen = false;

function showScreen(name) {
    if (changingScreen) return;

    const nextScreen = screens[name];

    if (!nextScreen) return;

    const currentScreen = document.querySelector(".screen.active");

    if (currentScreen === nextScreen) return;

    changingScreen = true;

    if (currentScreen) {
        currentScreen.classList.add("leaving");

        setTimeout(() => {
            currentScreen.classList.remove("active", "leaving");
        }, 420);
    }

    prepareReveal(nextScreen);

    nextScreen.classList.remove("active");
    void nextScreen.offsetWidth;

    setTimeout(() => {
        nextScreen.classList.add("active");
        changingScreen = false;
    }, currentScreen ? 180 : 0);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ======================================
   5. بيانات الأسئلة
====================================== */

const attempts = {
    1: 0,
    2: 0,
    3: 0
};

const questionSolved = {
    1: false,
    2: false,
    3: false
};

const lockedQuestions = {
    1: false,
    2: false,
    3: false
};


/* ======================================
   6. شريط التقدم
====================================== */

const questionCounter =
    document.getElementById("questionCounter");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

function updateProgress(number) {
    const percentages = {
        1: 33.33,
        2: 66.66,
        3: 100
    };

    questionCounter.textContent = `السؤال ${number} من 3`;

    progressPercent.textContent =
        `${Math.round(percentages[number])}%`;

    progressFill.style.width =
        `${percentages[number]}%`;
}


/* ======================================
   7. عرض السؤال
====================================== */

function showQuestion(number) {
    document.querySelectorAll(".question-step").forEach(step => {
        step.classList.remove("active");
    });

    const question =
        document.getElementById(`question${number}`);

    if (!question) return;

    void question.offsetWidth;

    question.classList.add("active");

    updateProgress(number);
}


/* ======================================
   8. تحويل الأرقام
====================================== */

function normalizeNumbers(value) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";

    return value
        .replace(/[٠-٩]/g, digit => arabicNumbers.indexOf(digit))
        .replace(/[۰-۹]/g, digit => persianNumbers.indexOf(digit))
        .replace(/\s/g, "");
}


/* ======================================
   9. السؤال الأول: تاريخ الميلاد
====================================== */

const birthDay =
    document.getElementById("birthDay");

const birthMonth =
    document.getElementById("birthMonth");

const dateFeedback =
    document.getElementById("dateFeedback");

const dateButton =
    document.getElementById("dateButton");

[birthDay, birthMonth].forEach(input => {
    input.addEventListener("input", () => {
        input.value = normalizeNumbers(input.value)
            .replace(/\D/g, "")
            .slice(0, 2);
    });
});

birthDay.addEventListener("input", () => {
    if (birthDay.value.length === 2) {
        birthMonth.focus();
    }
});

dateButton.addEventListener("click", () => {
    if (lockedQuestions[1]) return;

    const day = normalizeNumbers(birthDay.value).padStart(2, "0");
    const month = normalizeNumbers(birthMonth.value).padStart(2, "0");

    if (!birthDay.value || !birthMonth.value) {
        dateFeedback.textContent = "اكتبي اليوم والشهر الأول ♡";
        dateFeedback.className = "feedback error";
        return;
    }

    attempts[1]++;

    if (day === "01" && month === "12") {
        questionSolved[1] = true;
        lockedQuestions[1] = true;

        dateFeedback.textContent = "إجابة صحيحة! ✦";
        dateFeedback.className = "feedback success";

        dateButton.disabled = true;

        setTimeout(() => {
            showQuestion(2);
        }, 1000);

    } else {
        if (attempts[1] < 2) {
            dateFeedback.textContent =
                "مش دي الإجابة، جربي مرة كمان ♡";
        } else {
            lockedQuestions[1] = true;

            dateFeedback.textContent =
                "خلصت المحاولتين!";

            dateButton.disabled = true;
        }

        dateFeedback.className = "feedback error";
    }
});


/* ======================================
   10. السؤال الثاني والثالث
====================================== */

function handleOptionClick(button) {
    const number = Number(button.dataset.question);
    const answer = button.dataset.answer;

    if (lockedQuestions[number]) return;

    const questionElement =
        document.getElementById(`question${number}`);

    const options =
        questionElement.querySelectorAll(".option");

    const feedback =
        document.getElementById(`feedback${number}`);

    const nextButton =
        document.getElementById(`next${number}`);

    attempts[number]++;

    if (answer === "correct") {
        questionSolved[number] = true;
        lockedQuestions[number] = true;

        options.forEach(option => {
            option.disabled = true;

            if (option.dataset.answer === "correct") {
                option.classList.add("correct");
                option.querySelector(".option-mark").textContent = "✓";
            }
        });

        feedback.textContent = "برافو! إجابة صحيحة ♡";
        feedback.className = "feedback success";

        nextButton.disabled = false;

    } else {
        button.classList.add("wrong");
        button.querySelector(".option-mark").textContent = "✕";
        button.disabled = true;

        const remaining = 2 - attempts[number];

        if (remaining > 0) {
            feedback.textContent =
                "مش دي الإجابة، جربي مرة كمان ♡";

            feedback.className = "feedback error";

            options.forEach(option => {
                if (option.dataset.answer === "correct") {
                    option.classList.add("correct");
                    option.querySelector(".option-mark").textContent = "✓";
                }
            });

            setTimeout(() => {
                if (lockedQuestions[number]) return;

                options.forEach(option => {
                    option.classList.remove("wrong", "correct");
                    option.querySelector(".option-mark").textContent = "";
                    option.disabled = false;
                });

            }, 1000);

        } else {
            lockedQuestions[number] = true;

            feedback.textContent = "خلصت المحاولتين!";
            feedback.className = "feedback error";

            options.forEach(option => {
                option.disabled = true;

                if (option.dataset.answer === "correct") {
                    option.classList.add("correct");
                    option.querySelector(".option-mark").textContent = "✓";
                }
            });
        }
    }
}

document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
        handleOptionClick(button);
    });
});


/* ======================================
   11. الانتقال بين الأسئلة
====================================== */

document.getElementById("next2").addEventListener("click", () => {
    if (questionSolved[2]) {
        showQuestion(3);
    }
});

document.getElementById("next3").addEventListener("click", () => {
    if (questionSolved[3]) {
        showScreen("success");
    }
});


/* ======================================
   12. صفحة الترحيب
====================================== */

document.getElementById("startButton").addEventListener("click", () => {
    showScreen("music");
});


/* ======================================
   13. إعداد Spotify
====================================== */

const musicPagePlayer =
    document.getElementById("musicPagePlayer");

const miniPlayerFrame =
    document.getElementById("miniPlayerFrame");

if (musicPagePlayer) {
    musicPagePlayer.removeAttribute("loading");
    musicPagePlayer.src = spotifyLink;

    // ننقل المشغل مرة واحدة بس وهو لسه بيحمّل، وبعدها مبنحركوش أبدًا عشان الأغنية متقفلش
    miniPlayerFrame.appendChild(musicPagePlayer);
    musicPagePlayer.style.width = "100%";
    musicPagePlayer.style.display = "block";
    musicPagePlayer.setAttribute("height", "152");
}

let musicStaged = false;

function placeStage() {
    if (!musicStaged) return;

    const holder = document.querySelector("#musicScreen .spotify-wrapper");

    if (holder) {
        const r = holder.getBoundingClientRect();
        const mm = document.getElementById("miniMusic");
        mm.style.left = r.left + "px";
        mm.style.top = r.top + "px";
        mm.style.width = r.width + "px";
        mm.style.right = "auto";
        mm.style.bottom = "auto";
    }

    requestAnimationFrame(placeStage);
}

function stageMusicPlayer() {
    if (musicStaged) return;
    musicStaged = true;
    const mm = document.getElementById("miniMusic");
    mm.classList.add("stage");
    mm.classList.remove("hidden");
    musicPagePlayer.setAttribute("height", "152");
    placeStage();
}

function dockMusicPlayer() {
    musicStaged = false;
    const mm = document.getElementById("miniMusic");
    mm.classList.remove("stage", "hidden");
    ["left", "top", "width", "right", "bottom"].forEach(p => { mm.style[p] = ""; });
    musicPagePlayer.setAttribute("height", "80");
    document.getElementById("showMiniMusic").classList.remove("visible");
}


/* ======================================
   14. نقل مشغل Spotify
====================================== */

document.getElementById("musicContinue").addEventListener("click", () => {
    dockMusicPlayer();
    showScreen("envelope");
});


/* ======================================
   15. فتح الظرف
====================================== */

const envelopeButton =
    document.getElementById("envelopeButton");

const envelope =
    document.getElementById("envelope");

const tapHint =
    document.getElementById("tapHint");

let envelopeOpened = false;

envelopeButton.addEventListener("click", () => {
    if (envelopeOpened) return;

    envelopeOpened = true;

    envelope.classList.add("open");

    tapHint.textContent = "الرسالة ليكي وحدك ♡";

    setTimeout(() => {
        showScreen("message");
        startMessage();
    }, 1500);
});


/* ======================================
   16. عرض الرسالة
====================================== */

const miniMusic =
    document.getElementById("miniMusic");

function startMessage() {
    const messageBody =
        document.getElementById("messageBody");

    messageBody.textContent =
        letterMessage.trim();

    miniMusic.classList.remove("hidden");
}


/* ======================================
   17. إخفاء وإظهار المشغل
====================================== */

const closeMiniMusic =
    document.getElementById("closeMiniMusic");

const showMiniMusic =
    document.getElementById("showMiniMusic");

closeMiniMusic.addEventListener("click", () => {
    miniMusic.classList.add("hidden");
    showMiniMusic.classList.add("visible");
});

showMiniMusic.addEventListener("click", () => {
    miniMusic.classList.remove("hidden");
    showMiniMusic.classList.remove("visible");
});


/* ======================================
   18. سحب المشغل بالماوس واللمس
====================================== */

(function makePlayerDraggable() {
    const player =
        document.getElementById("miniMusic");

    const header =
        player.querySelector(".mini-music-header");

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let originalLeft = 0;
    let originalTop = 0;

    header.addEventListener("pointerdown", event => {
        if (event.target.closest("button")) return;

        dragging = true;

        const rect = player.getBoundingClientRect();

        startX = event.clientX;
        startY = event.clientY;

        originalLeft = rect.left;
        originalTop = rect.top;

        player.style.left = `${rect.left}px`;
        player.style.top = `${rect.top}px`;

        player.style.right = "auto";
        player.style.bottom = "auto";

        player.classList.add("dragging");

        header.setPointerCapture(event.pointerId);
    });

    header.addEventListener("pointermove", event => {
        if (!dragging) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        const maxLeft =
            window.innerWidth - player.offsetWidth;

        const maxTop =
            window.innerHeight - player.offsetHeight;

        const newLeft = Math.max(
            0,
            Math.min(maxLeft, originalLeft + dx)
        );

        const newTop = Math.max(
            0,
            Math.min(maxTop, originalTop + dy)
        );

        player.style.left = `${newLeft}px`;
        player.style.top = `${newTop}px`;
    });

    function stopDragging() {
        dragging = false;
        player.classList.remove("dragging");
    }

    header.addEventListener("pointerup", stopDragging);
    header.addEventListener("pointercancel", stopDragging);

    window.addEventListener("resize", () => {
        if (player.classList.contains("hidden")) return;

        const rect = player.getBoundingClientRect();

        const left = Math.max(
            0,
            Math.min(window.innerWidth - player.offsetWidth, rect.left)
        );

        const top = Math.max(
            0,
            Math.min(window.innerHeight - player.offsetHeight, rect.top)
        );

        player.style.left = `${left}px`;
        player.style.top = `${top}px`;
    });
})();


/* ======================================
   19. إرسال رد جني إلى Supabase
====================================== */

const jojoReply =
    document.getElementById("jojoReply");

const sendReply =
    document.getElementById("sendReply");

const replyFeedback =
    document.getElementById("replyFeedback");

sendReply.addEventListener("click", async() => {
    const reply = jojoReply.value.trim();

    if (!reply) {
        replyFeedback.textContent =
            "اكتبي ردك الأول ♡";

        replyFeedback.className =
            "reply-feedback error";

        return;
    }

    if (reply.length > 2000) {
        replyFeedback.textContent =
            "الرد طويل جدًا.";

        replyFeedback.className =
            "reply-feedback error";

        return;
    }

    if (!supabaseClient) {
        replyFeedback.textContent =
            "حصلت مشكلة في الاتصال، جربي تاني.";

        replyFeedback.className =
            "reply-feedback error";

        return;
    }

    sendReply.disabled = true;
    sendReply.textContent = "جاري إرسال ردك...";

    try {
        const { error } = await supabaseClient
            .from("jojo_replies")
            .insert({ reply });

        if (error) {
            throw error;
        }

        replyFeedback.textContent =
            "وصل ردك بنجاح، شكرًا ليكي ♡";

        replyFeedback.className =
            "reply-feedback success";

        jojoReply.value = "";
        jojoReply.disabled = true;

        sendReply.textContent = "تم إرسال الرد ♡";

    } catch (error) {
        console.error("Reply error:", error);

        replyFeedback.textContent =
            "مقدرتش أبعت الرد دلوقتي. حاولي مرة تانية.";

        replyFeedback.className =
            "reply-feedback error";

        sendReply.disabled = false;
        sendReply.textContent = "إرسال الرد ♡";
    }
});


/* ======================================
   20. نهاية الرسالة
====================================== */

document.getElementById("readButton").addEventListener("click", () => {
    showScreen("ending");
    createPetals(24);
});


/* ======================================
   21. البتلات
====================================== */

function createPetals(count) {
    const container =
        document.getElementById("petals");

    const symbols = ["✿", "❀", "♡", "✧"];

    for (let i = 0; i < count; i++) {
        const petal = document.createElement("span");

        petal.className = "petal";

        petal.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        petal.style.left = `${Math.random() * 100}%`;

        petal.style.fontSize =
            `${12 + Math.random() * 14}px`;

        petal.style.animationDuration =
            `${6 + Math.random() * 8}s`;

        petal.style.animationDelay =
            `${Math.random() * 3}s`;

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 16000);
    }
}


/* ======================================
   22. بتلات الخلفية
====================================== */

setInterval(() => {
    const container =
        document.getElementById("petals");

    const petal = document.createElement("span");

    const symbols = ["✿", "❀", "♡", "✧"];

    petal.className = "petal";

    petal.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

    petal.style.left = `${Math.random() * 100}%`;

    petal.style.fontSize =
        `${10 + Math.random() * 9}px`;

    petal.style.animationDuration =
        `${9 + Math.random() * 6}s`;

    container.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 16000);

}, 2200);

/* =====================================================
   تأثيرات الاحتفال الكاملة
===================================================== */
(function() {
    var reduce = false;
    var COLORS = ["#bd8493", "#c7a16c", "#713b50", "#f5c6d0", "#e8b4a0", "#9fb8a5", "#fff2c9", "#e86f8f"];
    var NS = "http://www.w3.org/2000/svg";
    var $ = function(id) { return document.getElementById(id); };
    var rnd = function(a, b) { return a + Math.random() * (b - a); };
    var pick = function() { return COLORS[Math.floor(Math.random() * COLORS.length)]; };

    /* ---- أشعة ضوء + أعلام ---- */
    var rays = document.createElement("div");
    rays.className = "rays";
    rays.setAttribute("aria-hidden", "true");
    document.body.prepend(rays);

    var bunting = document.createElement("div");
    bunting.className = "bunting";
    bunting.setAttribute("aria-hidden", "true");
    var flags = "";
    for (var i = 0; i < 16; i++) {
        var fx = 20 + i * 62,
            fy = 10 + Math.sin(i / 15 * Math.PI) * 26;
        flags += '<polygon class="flag" style="animation-delay:' + ((i % 5) * .3) + 's" points="' + (fx - 20) + "," + fy + " " + (fx + 20) + "," + fy + " " + fx + "," + (fy + 36) + '" fill="' + COLORS[i % 5] + '" opacity=".92"/>';
    }
    bunting.innerHTML = '<svg viewBox="0 0 1000 80" preserveAspectRatio="none"><path d="M0,10 Q500,64 1000,10" fill="none" stroke="#713b50" stroke-width="1.5" opacity=".5"/>' + flags + "</svg>";
    document.body.prepend(bunting);

    if (!reduce) {
        for (i = 0; i < 16; i++) {
            var b = document.createElement("span");
            b.className = "balloon";
            b.style.cssText = "left:" + (3 + i * 6.2) + "%;--c:" + COLORS[i % 5] + ";--d:" + rnd(16, 26) + "s;--w:" + (-rnd(0, 20)) + "s;--x:" + rnd(-30, 30) + "px";
            document.body.appendChild(b);
        }
        for (i = 0; i < 28; i++) {
            var s = document.createElement("span");
            s.className = "star";
            s.textContent = i % 3 ? "✦" : "✧";
            s.style.cssText = "left:" + rnd(0, 98) + "%;top:" + rnd(8, 95) + "%;font-size:" + rnd(8, 18) + "px;--t:" + rnd(2, 5) + "s;--w:" + (-rnd(0, 5)) + "s";
            document.body.appendChild(s);
        }
        ["🎁", "🎂", "🎈", "🎉", "🧁", "🕯️", "💝", "🎀"].forEach(function(e, n) {
            var p = document.createElement("span");
            p.className = "party-icon";
            p.textContent = e;
            p.style.cssText = "left:" + ((n * 13 + 4) % 92) + "%;top:" + rnd(14, 82) + "%;font-size:" + rnd(22, 36) + "px;--d:" + rnd(6, 11) + "s;--w:" + (-rnd(0, 6)) + "s;--x:" + rnd(-40, 40) + "px;--y:" + rnd(-50, 50) + "px";
            document.body.appendChild(p);
        });
    }

    /* ---- Canvas: كونفيتي + شرائط + ألعاب نارية ---- */
    var cv = document.createElement("canvas");
    cv.id = "confetti";
    cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    var ctx = cv.getContext("2d");
    var W = 0,
        H = 0,
        bits = [],
        running = false;

    function fit() { W = cv.width = innerWidth;
        H = cv.height = innerHeight; }
    fit();
    addEventListener("resize", fit);

    function add(p) { bits.push(p); if (!running) { running = true;
            requestAnimationFrame(tick); } }

    function burst(x, y, n) {
        if (reduce) return;
        for (var k = 0; k < (n || 80); k++) {
            var a = rnd(0, 6.283),
                sp = rnd(4, 12);
            add({ t: "c", x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, w: rnd(6, 13), h: rnd(4, 9), r: rnd(0, 6), vr: rnd(-.18, .18), c: pick(), g: .22, d: .985, life: 0, max: 420 });
        }
    }

    function ribbon(x, y, vx, vy, g) {
        add({ t: "r", x: x, y: y, vx: vx, vy: vy, len: rnd(30, 70), ph: rnd(0, 6), vph: rnd(.08, .16), amp: rnd(5, 11), lw: rnd(3, 5.5), c: pick(), g: g || .07, d: .975, life: 0, max: 700 });
    }

    function streamers(n) {
        if (reduce) return;
        for (var k = 0; k < n; k++) ribbon(rnd(0, W), rnd(-H * .5, -20), rnd(-1, 1), rnd(1, 3), .05);
    }

    function cannon(side, n) {
        if (reduce) return;
        var x = side === "l" ? 0 : W,
            dir = side === "l" ? 1 : -1;
        for (var k = 0; k < (n || 70); k++) {
            var a = -Math.PI / 2 + dir * rnd(.15, .85),
                sp = rnd(10, 22);
            if (k % 3 === 0) ribbon(x, H, Math.cos(a) * sp * .8, Math.sin(a) * sp * .8, .16);
            else add({ t: "c", x: x, y: H, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: rnd(6, 12), h: rnd(4, 8), r: rnd(0, 6), vr: rnd(-.2, .2), c: pick(), g: .25, d: .985, life: 0, max: 420 });
        }
    }

    function firework(x, y) {
        if (reduce) return;
        var col = pick(),
            n = 46;
        for (var k = 0; k < n; k++) {
            var a = k / n * 6.283,
                sp = rnd(3, 7.5);
            add({ t: "s", x: x, y: y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: k % 4 === 0 ? "#fff2c9" : col, g: .09, d: .965, life: 0, max: 75 });
        }
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
        bits = bits.filter(function(p) { return p.y < H + 80 && p.life < p.max; });
        for (var k = 0; k < bits.length; k++) {
            var p = bits[k];
            p.life++;
            p.vy += p.g;
            p.vx *= p.d;
            if (p.t === "r") { p.vy = Math.min(p.vy, 4.2);
                p.ph += p.vph; }
            if (p.t === "s") { p.px = p.x;
                p.py = p.y; }
            p.x += p.vx;
            p.y += p.vy;
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
            if (p.t === "c") {
                p.r += p.vr;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.r);
                ctx.fillStyle = p.c;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else if (p.t === "r") {
                ctx.strokeStyle = p.c;
                ctx.lineWidth = p.lw;
                ctx.lineCap = "round";
                ctx.beginPath();
                for (var j = 0; j <= p.len; j += 6) {
                    var px = p.x + Math.sin(p.ph + j * .13) * p.amp,
                        py = p.y - j;
                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
            } else {
                ctx.globalCompositeOperation = "lighter";
                ctx.strokeStyle = p.c;
                ctx.lineWidth = 2.2;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(p.px, p.py);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
            ctx.restore();
        }
        if (bits.length) requestAnimationFrame(tick);
        else { running = false;
            ctx.clearRect(0, 0, W, H); }
    }

    function fromEl(el, n) { var r = el.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, n); }

    function fireworks(count, gap) {
        for (var k = 0; k < count; k++) setTimeout(function() { firework(rnd(.12, .88) * innerWidth, rnd(.12, .5) * innerHeight); }, k * gap);
    }

    /* ---- قلوب طايرة ---- */
    function hearts(x, y, n) {
        if (reduce) return;
        for (var k = 0; k < n; k++)(function(k) {
            setTimeout(function() {
                var h = document.createElement("span");
                h.className = "flyheart";
                h.textContent = ["♡", "♥", "✿", "✦"][k % 4];
                h.style.cssText = "left:" + (x + rnd(-30, 30)) + "px;top:" + y + "px;font-size:" + rnd(14, 30) + "px;--d:" + rnd(2.5, 4.5) + "s;--x:" + rnd(-120, 120) + "px;--r:" + rnd(-40, 40) + "deg";
                document.body.appendChild(h);
                setTimeout(function() { h.remove(); }, 4600);
            }, k * 90);
        })(k);
    }

    /* ---- بانر Happy Birthday ---- */
    function partyBanner() {
        if (reduce) return;
        var wrap = document.createElement("div");
        wrap.className = "party-banner";
        wrap.setAttribute("aria-hidden", "true");
        var letters = "HAPPY BIRTHDAY".split("").map(function(c, n) {
            return c === " " ? '<span class="pb-l" style="width:.4em"></span>' : '<span class="pb-l" style="animation-delay:' + (.3 + n * .07) + 's">' + c + "</span>";
        }).join("");
        wrap.innerHTML = '<div class="pb-emoji">🎉🎂🎈</div><div class="pb-ribbon">' + letters + '</div><div class="pb-sub">يا جني ♡</div>';
        document.body.appendChild(wrap);
        setTimeout(function() { wrap.remove(); }, 4800);
    }

    /* ---- كيكة ---- */
    var welcome = document.querySelector("#successScreen .welcome-card");
    if (welcome) {
        var cake = document.createElementNS(NS, "svg");
        cake.setAttribute("viewBox", "0 0 150 130");
        cake.setAttribute("class", "cake");
        cake.setAttribute("aria-hidden", "true");
        cake.innerHTML = '<ellipse cx="75" cy="122" rx="62" ry="6" fill="#713b50" opacity=".15"/><rect x="18" y="78" width="114" height="42" rx="10" fill="#bd8493"/><path d="M18 92 q9 12 19 0 t19 0 t19 0 t19 0 t19 0 t19 0 v-14 h-114z" fill="#fffaf6"/><rect x="34" y="50" width="82" height="32" rx="9" fill="#c7a16c"/><path d="M34 62 q8 10 16 0 t16 0 t16 0 t16 0 t18 0 v-12 h-82z" fill="#fffaf6"/><g fill="#f5e4e8"><rect x="56" y="30" width="7" height="22" rx="2"/><rect x="71.5" y="30" width="7" height="22" rx="2"/><rect x="87" y="30" width="7" height="22" rx="2"/></g><ellipse class="glow" cx="75" cy="22" rx="30" ry="14" fill="#ffd98a"/><g fill="#ffb84d"><path class="flame" d="M59.5 29 q-5-8 0-15 q5 7 0 15z"/><path class="flame" d="M75 29 q-5-8 0-15 q5 7 0 15z"/><path class="flame" d="M90.5 29 q-5-8 0-15 q5 7 0 15z"/></g><circle cx="40" cy="106" r="3" fill="#fffaf6"/><circle cx="75" cy="108" r="3" fill="#fffaf6"/><circle cx="110" cy="106" r="3" fill="#fffaf6"/>';
        var eb0 = welcome.querySelector(".eyebrow");
        if (eb0) eb0.after(cake);
    }

    /* ---- Happy Birthday بحروف ملونة بتنط ---- */
    var hb = document.querySelector("#envelopeScreen .main-title");
    if (hb) {
        hb.classList.add("wave");
        hb.innerHTML = hb.textContent.trim().split("").map(function(c, n) {
            return c === " " ? " " : '<span style="color:' + COLORS[n % COLORS.length] + ";animation-delay:" + (n * .09) + 's">' + c + "</span>";
        }).join("");
    }

    /* ---- الرسالة فقرة فقرة ---- */
    var body = $("messageBody");
    if (body) {
        var busy = false;
        new MutationObserver(function() {
            if (busy || !body.textContent.trim() || body.querySelector(".msg-p")) return;
            busy = true;
            var parts = body.textContent.trim().split(/\n\s*\n/);
            body.replaceChildren.apply(body, parts.map(function(t, n) {
                var p = document.createElement("span");
                p.className = "msg-p";
                p.textContent = t.trim();
                p.style.animationDelay = (1.2 + n * .9) + "s";
                return p;
            }));
            busy = false;
        }).observe(body, { childList: true, characterData: true, subtree: true });
    }

    /* ---- ربط الأحداث ---- */
    ["dateFeedback", "feedback2", "feedback3"].forEach(function(id) {
        var el = $(id);
        if (!el) return;
        new MutationObserver(function() { if (el.classList.contains("success")) { fromEl(el, 60);
                    cannon("l", 25);
                    cannon("r", 25); } })
            .observe(el, { attributes: true, attributeFilter: ["class"] });
    });

    function onActive(id, fn) {
        var el = $(id);
        if (!el) return;
        new MutationObserver(function() { if (el.classList.contains("active")) setTimeout(fn, 350); })
            .observe(el, { attributes: true, attributeFilter: ["class"] });
    }
    onActive("successScreen", function() { cannon("l", 80);
        cannon("r", 80);
        fireworks(4, 500); });
    onActive("musicScreen", function() { streamers(14); });
    onActive("messageScreen", function() {
        partyBanner();
        cannon("l", 110);
        cannon("r", 110);
        streamers(36);
        fireworks(6, 600);
        [.2, .5, .8].forEach(function(f, n) { setTimeout(function() { hearts(innerWidth * f, innerHeight * .9, 8); }, n * 700); });
    });
    onActive("endingScreen", function() {
        var n = 0;
        var t = setInterval(function() {
            streamers(14);
            cannon(n % 2 ? "l" : "r", 40);
            fireworks(3, 300);
            if (++n > 7) clearInterval(t);
        }, 1800);
    });

    var envBtn = $("envelopeButton");
    if (envBtn) envBtn.addEventListener("click", function() {
        fromEl(envBtn, 90);
        var r = envBtn.getBoundingClientRect();
        hearts(r.left + r.width / 2, r.top + r.height / 2, 22);
        setTimeout(function() { cannon("l", 50);
            cannon("r", 50); }, 700);
    });
    var startBtn = $("startButton");
    if (startBtn) startBtn.addEventListener("click", function() { fromEl(startBtn, 50); });

    /* ---- ريبل + فرقعة صغيرة عند أي ضغطة ---- */
    document.addEventListener("click", function(e) {
        if (reduce) return;
        var bt = e.target.closest ? e.target.closest(".primary-button,.reply-submit") : null;
        if (bt) {
            var r = bt.getBoundingClientRect(),
                d = Math.max(r.width, r.height) / 2;
            var rp = document.createElement("span");
            rp.className = "ripple";
            rp.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
            bt.appendChild(rp);
            setTimeout(function() { rp.remove(); }, 650);
        }
        if (!(e.target.closest && e.target.closest("textarea,input,iframe"))) burst(e.clientX, e.clientY, 16);
    });

    /* ---- ميلان 3D + لمعة ---- */
    var last = 0;
    addEventListener("pointermove", function(e) {
        if (reduce) return;
        if (e.pointerType !== "touch") {
            var card = document.querySelector(".screen.active .content-card");
            if (card) card.style.transform = "perspective(900px) rotateY(" + ((e.clientX / innerWidth - .5) * 7) + "deg) rotateX(" + (-(e.clientY / innerHeight - .5) * 7) + "deg)";
        }
        if (e.timeStamp - last < 70) return;
        last = e.timeStamp;
        var sp = document.createElement("span");
        sp.className = "spark";
        sp.textContent = ["✦", "✧", "♡"][Math.floor(Math.random() * 3)];
        sp.style.cssText = "left:" + e.clientX + "px;top:" + e.clientY + "px;font-size:" + rnd(9, 18) + "px;--dx:" + rnd(-20, 20) + "px;--dy:" + rnd(20, 50) + "px";
        document.body.appendChild(sp);
        setTimeout(function() { sp.remove(); }, 900);
    }, { passive: true });

    /* ---- حركة مستمرة في الموقع كله ---- */
    onActive("musicScreen", function() { if (typeof stageMusicPlayer === "function") stageMusicPlayer(); });
    setInterval(function() {
        streamers(3);
        for (var k = 0; k < 6; k++) add({ t: "c", x: rnd(0, W), y: -10, vx: rnd(-1, 1), vy: rnd(1, 3), w: rnd(6, 11), h: rnd(4, 8), r: rnd(0, 6), vr: rnd(-.15, .15), c: pick(), g: .03, d: .99, life: 0, max: 600 });
    }, 1600);
    setInterval(function() { firework(rnd(.1, .9) * innerWidth, rnd(.1, .45) * innerHeight); }, 5000);
    setInterval(function() { hearts(rnd(.1, .9) * innerWidth, innerHeight - 10, 4); }, 3000);
    setTimeout(function() { cannon("l", 40);
        cannon("r", 40); }, 600);
})();
