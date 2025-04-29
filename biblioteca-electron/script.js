const { shell, ipcRenderer } = require('electron');

document.getElementById('mostrarFormularioBtn').addEventListener('click', () => {
    const form = document.getElementById('nuevoLibroForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('agregarLibroBtn').addEventListener('click', () => {
    const libro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        descripcion: document.getElementById('descripcion').value,
        categoria: document.getElementById('categoria').value,
        ruta: document.getElementById('ruta').value,
        imagen: document.getElementById('imagen').value
    };

    ipcRenderer.send('guardar-libro', libro);
    mostrarLibro(libro);
    document.getElementById('nuevoLibroForm').reset();
});

function mostrarLibro(libro) {
    const libroDiv = document.createElement('div');
    libroDiv.classList.add('libro');

    const portadaHTML = libro.imagen
        ? `<img src="${libro.imagen}" alt="Portada del libro">`
        : '';

    libroDiv.innerHTML = `
        ${portadaHTML}
        <h3>${libro.titulo}</h3>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Categoría:</strong> ${libro.categoria}</p>
        <p>${libro.descripcion}</p>
        <div class="botones">
            <button class="abrirBtn">Abrir</button>
            <button class="editarBtn">Editar</button>
        </div>
    `;

    libroDiv.querySelector('.abrirBtn').addEventListener('click', () => {
        const confirmacion = confirm("¿Abrir con Foxit Reader?\nCancelar = navegador predeterminado.");
        if (confirmacion) {
            ipcRenderer.send('abrir-con-foxit', libro.ruta);
        } else {
            shell.openPath(libro.ruta);
        }
    });

    libroDiv.querySelector('.editarBtn').addEventListener('click', () => {
        document.getElementById('titulo').value = libro.titulo;
        document.getElementById('autor').value = libro.autor;
        document.getElementById('descripcion').value = libro.descripcion;
        document.getElementById('categoria').value = libro.categoria;
        document.getElementById('ruta').value = libro.ruta;
        document.getElementById('imagen').value = libro.imagen;

        libroDiv.remove();
    });

    document.getElementById('librosContainer').appendChild(libroDiv);
}

// Cargar libros desde JSON al iniciar
window.addEventListener('DOMContentLoaded', async () => {
    const libros = await ipcRenderer.invoke('leer-libros');
    libros.forEach(libro => mostrarLibro(libro));
});


#moduloBusquedas {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

#searchResults li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

#searchResults li:last-child {
    border-bottom: none;
}