const apiUrl = 'https://api-jakefutbol.redpos.app/matches';

async function fetchEvents() {
    const response = await fetch(apiUrl);
    const events = await response.json();
    renderTable(events);
}

function renderTable(events) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.hour || 'N/A'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openModal('${event.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event.id}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function addLinkField(type = '', url = '') {
    const container = document.getElementById('linksContainer');
    const div = document.createElement('div');
    div.classList.add('d-flex', 'gap-2', 'mb-2');
    div.innerHTML = `
        <input type="text" class="form-control" placeholder="Tipo" value="${type}" />
        <input type="text" class="form-control" placeholder="URL" value="${url}" />
        <button class="btn btn-danger btn-sm" onclick="this.parentNode.remove()">X</button>
    `;
    container.appendChild(div);
}

async function openModal(id = null) {
    document.getElementById('linksContainer').innerHTML = '';
    if (id) {
        const response = await fetch(`${apiUrl}/${id}`);
        const event = await response.json();
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventHour').value = event.hour;
        event.links.forEach(link => addLinkField(link.type, link.url));
    } else {
        document.getElementById('eventId').value = '';
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventHour').value = '';
    }
    document.getElementById('eventModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

async function saveEvent() {
    const id = document.getElementById('eventId').value;
    const links = Array.from(document.getElementById('linksContainer').children).map(div => ({
        type: div.children[0].value,
        url: div.children[1].value
    }));

    const event = {
        title: document.getElementById('eventTitle').value,
        hour: document.getElementById('eventHour').value,
        links
    };
    
    const options = {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    };
    
    await fetch(id ? `${apiUrl}/${id}` : apiUrl, options);
    fetchEvents();
    closeModal();
}

async function deleteEvent(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchEvents();
}

document.addEventListener('DOMContentLoaded', fetchEvents);