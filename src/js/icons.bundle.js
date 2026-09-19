document.addEventListener('DOMContentLoaded', function () {
    fetch('https://cdn.jsdelivr.net/npm/meteor-icons/variants/svg-sprite.svg').then(function (res) {
        return res.text();
    }).then(function (svgText) {
        var wrapper = document.createElement('div');
        wrapper.style.display = 'none';
        wrapper.innerHTML = svgText;
        document.body.insertBefore(wrapper, document.body.firstChild);

        // Paso 1: procesar íconos del menú (icono::Texto)
        document.querySelectorAll('.pages-link').forEach(function (link) {
        var parts = link.textContent.trim().split('::');
        if (parts.length === 2) {
            var iconName = parts[0].trim();
            var label = parts[1].trim();
            link.textContent = label;
            link.insertAdjacentHTML('afterbegin', '<svg class="i i-' + iconName + '"><use href="#' + iconName + '"></use></svg>');
        }
        });

        // Paso 2: agrupar submenús
        setupSubmenus();

        // Paso 3: convierte <i data-i="nombre"></i> en el ícono real
        document.querySelectorAll('i[data-i]').forEach(function (el) {
        var iconName = el.getAttribute('data-i');
        var extraClasses = el.className ? ' ' + el.className : '';
        el.insertAdjacentHTML('afterend', '<svg class="i i-' + iconName + extraClasses + '"><use href="#' + iconName + '"></use></svg>');
        el.remove();
        });
    }).catch(function (err) {
        console.error('No se pudo cargar el sprite de íconos:', err);
    });
    });

    function setupSubmenus() {
    var container = document.querySelector('.pages');
    if (!container) return;

    var allLinks = Array.from(container.querySelectorAll('.pages-link'));
    var childrenByParent = {};

    // Detecta hijos: "Categorías>Tecnología" -> padre "Categorías", hijo "Tecnología"
    allLinks.forEach(function (link) {
        var text = link.textContent.trim();
        var idx = text.indexOf('>');
        if (idx > -1) {
        var parentLabel = text.slice(0, idx).trim();
        var childLabel = text.slice(idx + 1).trim();
        link.textContent = childLabel;
        if (!childrenByParent[parentLabel]) childrenByParent[parentLabel] = [];
        childrenByParent[parentLabel].push(link);
        }
    });

    // Construye el submenú desplegable debajo del padre correspondiente
    Object.keys(childrenByParent).forEach(function (parentLabel) {
        var parentLink = allLinks.find(function (link) {
        return link.textContent.trim() === parentLabel;
        });
        if (!parentLink) return;

        parentLink.classList.add('has-submenu');
        parentLink.insertAdjacentHTML(
        'beforeend',
        '<svg class="i i-chevron-down submenu-arrow"><use href="#chevron-down"></use></svg>'
        );

        var submenu = document.createElement('div');
        submenu.className = 'submenu';
        childrenByParent[parentLabel].forEach(function (child) {
        submenu.appendChild(child);
        });
        var wrapper = document.createElement('div');
        wrapper.className = 'submenu-wrapper';
        parentLink.parentNode.insertBefore(wrapper, parentLink);
        wrapper.appendChild(parentLink);
        wrapper.appendChild(submenu);

        parentLink.addEventListener('click', function (e) {
        e.preventDefault();
        parentLink.classList.toggle('is-open');
        submenu.classList.toggle('is-open');
        });
    });
}