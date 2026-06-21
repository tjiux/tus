// Tus - 首页逻辑

document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('subjectsContainer');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const searchInput = document.getElementById('searchInput');
    const gradeBtns = document.querySelectorAll('.grade-btn');

    let allSubjects = [];
    let activeGrade = '';

    // 年级筛选点击
    gradeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            gradeBtns.forEach(b => {
                b.className = 'grade-btn px-5 py-2.5 rounded-full text-sm font-medium border transition-all shadow-sm ' +
                    (b === this
                        ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 border-stone-800 dark:border-stone-200'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-stone-400 hover:text-stone-700');
            });
            activeGrade = this.dataset.grade;
            applyFilters();
        });
    });

    function applyFilters() {
        const keyword = searchInput.value.toLowerCase().trim();

        let filtered = allSubjects;

        // 年级筛选
        if (activeGrade) {
            filtered = filtered.filter(s => s.grade === activeGrade);
        }

        // 关键词搜索（按字匹配）
        if (keyword) {
            filtered = filtered.filter(s =>
                charMatch(s.name, keyword) ||
                charMatch(s.teacher || '', keyword) ||
                charMatch(s.description || '', keyword) ||
                charMatch(s.grade || '', keyword)
            );
        }

        renderSubjects(filtered);
    }

    // 搜索过滤
    searchInput.addEventListener('input', applyFilters);

    // 加载科目
    async function loadSubjects() {
        loadingState.classList.remove('hidden');
        emptyState.classList.add('hidden');
        errorState.classList.add('hidden');
        container.innerHTML = '';

        try {
            const subjects = await getSubjectsWithCount();
            allSubjects = subjects;

            loadingState.classList.add('hidden');

            if (subjects.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }

            applyFilters();
        } catch (e) {
            loadingState.classList.add('hidden');
            errorState.classList.remove('hidden');
            errorMessage.textContent = e.message || '加载失败，请检查网络连接';
        }
    }

    // 渲染科目卡片
    function renderSubjects(subjects) {
        if (subjects.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-10 text-stone-400">
                    无匹配科目
                </div>
            `;
            return;
        }

        container.innerHTML = subjects.map(function(subject) {
            var paperCount = subject.papers?.[0]?.count || 0;
            var gradeBadge = subject.grade ? '<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">' + subject.grade + '</span>' : '';
            return '<a href="subject-detail.html?id=' + subject.id + '" class="subject-card bg-white dark:bg-stone-800 rounded-xl shadow-sm p-5 border border-stone-100 dark:border-stone-700 block">'
                + '<div class="flex items-start justify-between mb-1">'
                    + '<h2 class="font-semibold text-stone-800 dark:text-stone-100 text-lg">' + subject.name + '</h2>'
                    + gradeBadge
                + '</div>'
                + (subject.teacher ? '<p class="text-stone-400 dark:text-stone-500 text-sm mb-2">' + subject.teacher + '</p>' : '')
                + (subject.description ? '<p class="text-stone-500 dark:text-stone-400 text-sm mb-3 line-clamp-2">' + subject.description + '</p>' : '')
                + '<div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">'
                    + '<span>' + paperCount + ' 份试卷</span>'
                + '</div>'
                + '</a>';
        }).join('');

        // 卡片入场动画：错开 60ms 依次显现
        requestAnimationFrame(function() {
            var cards = container.querySelectorAll('.subject-card');
            for (var ci = 0; ci < cards.length; ci++) {
                (function(idx, card) {
                    setTimeout(function() {
                        card.classList.add('card-visible');
                    }, idx * 60);
                })(ci, cards[ci]);
            }
        });
    }

    // 初始化
    await loadSubjects();
});