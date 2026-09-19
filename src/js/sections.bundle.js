(function () {
    function renderCard(entry) {
        var title = entry.title ? entry.title.$t : 'Sin título';
        var url = '#';
        (entry.link || []).forEach(function (l) { if (l.rel === 'alternate') url = l.href; });

        var thumb = entry.media$thumbnail
            ? entry.media$thumbnail.url.replace(/\/s72-c\//, '/s600/')
            : (function () {
                var body = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
                var match = body.match(/<img[^>]+src=["']([^"']+)["']/i);
                return match ? match[1] : '';
            })();

        var category = (entry.category && entry.category[0]) ? entry.category[0].term : '';
        var authorImg = entry.author && entry.author[0] && entry.author[0].gd$image
            ? entry.author[0].gd$image.src
            : '';
        var date = entry.published
            ? new Date(entry.published.$t).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : '';

        var rawContent = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : '');
        var plainText = rawContent.replace(/<[^>]*>?/g, '').trim();
        var snippet = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

        return '' +
            '<article class="card">' +
            '<a class="card-content" href="' + url + '">' +
                (category ? '<span class="card-category">' + category + '</span>' : '') +
                '<img class="card-image" src="' + thumb + '" alt="' + title + '" loading="lazy"/>' +
                '<div class="ctn-card">' +
                '<h2 class="card-title">' + title + '</h2>' +
                '<div class="card-meta">' +
                    (snippet ? '<p class="card-snippet">' + snippet + '</p>' : '') +
                    (authorImg ? '<img class="m-card-avatar" src="' + authorImg + '" alt=""/>' : '') +
                    '<span class="card-date">' + date + '</span>' +
                '</div>' +
                '</div>' +
            '</a>' +
            '</article>';
        }

    document.addEventListener('DOMContentLoaded', function () {
        var blocks = document.querySelectorAll('.section-block[data-tag]');
        blocks.forEach(function (block, i) {
        var tag = block.getAttribute('data-tag');
        var results = block.getAttribute('data-results') || 6;
        var cbName = 'sectionCb' + i;

        window[cbName] = function (data) {
            var entries = (data.feed.entry || []);
            var container = block.querySelector('.section-block-cards');
            container.innerHTML = entries.length
            ? entries.map(renderCard).join('')
            : '<p>No hay entradas en esta sección.</p>';
        };

        var script = document.createElement('script');
        script.src = '/feeds/posts/summary/-/' + encodeURIComponent(tag) +
            '?max-results=' + results + '&alt=json-in-script&callback=' + cbName;
        document.body.appendChild(script);
        });
    });
})();