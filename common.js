
(function () {
    function normalize(path) {
        return path.replace(/index\.html$/, '').replace(/\/+/g, '/');
    }

    const current = normalize(window.location.pathname);
    document.querySelectorAll('[data-nav]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const url = new URL(href, window.location.href);
        const target = normalize(url.pathname);
        if (target === current) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => history.back());
    });
})();
