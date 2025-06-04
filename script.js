document.addEventListener('DOMContentLoaded', () => {
    // --- Contador de Días ---
    const startDate = new Date('2025-04-29T00:00:00'); // Establece la fecha de inicio
    const daysCounterElement = document.getElementById('days-counter');

    function updateDaysCounter() {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysCounterElement.textContent = diffDays;
    }

    updateDaysCounter();
    setInterval(updateDaysCounter, 1000 * 60 * 60); // Actualiza cada hora, o menos si quieres más precisión


    // --- Hora Local (Bolivia - La Paz) ---
    const localTimeElement = document.getElementById('local-time');

    function updateLocalTime() {
        // Opciones para formatear la hora a la zona horaria de La Paz (GMT-4)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Formato AM/PM
            timeZone: 'America/La_Paz'
        };
        const formatter = new Intl.DateTimeFormat('es-BO', options);
        const currentTime = formatter.format(new Date());
        localTimeElement.textContent = currentTime;
    }

    updateLocalTime();
    setInterval(updateLocalTime, 1000); // Actualiza cada segundo

    // --- Navegación entre Secciones ---
    const iconItems = document.querySelectorAll('.icon-item');
    const contentSections = document.querySelectorAll('.content-section');
    const backButtons = document.querySelectorAll('.back-button');
    const mainContent = document.querySelector('.container'); // Para el overflow

    function showSection(sectionId) {
        // Oculta todas las secciones con animación
        contentSections.forEach(section => {
            if (!section.classList.contains('hidden')) {
                section.classList.add('leaving');
                section.addEventListener('animationend', function handler() {
                    section.classList.add('hidden');
                    section.classList.remove('leaving');
                    section.removeEventListener('animationend', handler);
                });
            }
        });

        // Muestra la sección deseada con animación
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('entering');
            targetSection.addEventListener('animationend', function handler() {
                targetSection.classList.remove('entering');
                targetSection.removeEventListener('animationend', handler);
            });
            // Ocultar contenido principal
            document.querySelector('header').classList.add('hidden');
            document.querySelector('.info-section:nth-of-type(1)').classList.add('hidden');
            document.querySelector('.info-section:nth-of-type(2)').classList.add('hidden');
            document.querySelector('.gif-section').classList.add('hidden');
            document.querySelector('.icon-navigation').classList.add('hidden'); // Ocultar barra de navegación si la quieres dentro de cada sección

            // Asegurar que el scroll esté en la sección de contenido
            mainContent.scrollTop = 0;
            // Desactivar scroll del body si el contenido de la sección no necesita scroll, o activar si sí
            // document.body.style.overflow = 'hidden';
        }
    }

    function hideSections() {
        contentSections.forEach(section => {
            if (!section.classList.contains('hidden')) {
                section.classList.add('leaving');
                section.addEventListener('animationend', function handler() {
                    section.classList.add('hidden');
                    section.classList.remove('leaving');
                    section.removeEventListener('animationend', handler);
                });
            }
        });
        // Mostrar contenido principal
        document.querySelector('header').classList.remove('hidden');
        document.querySelector('.info-section:nth-of-type(1)').classList.remove('hidden');
        document.querySelector('.info-section:nth-of-type(2)').classList.remove('hidden');
        document.querySelector('.gif-section').classList.remove('hidden');
        document.querySelector('.icon-navigation').classList.remove('hidden');
        // document.body.style.overflow = 'auto'; // Restaurar scroll del body
    }

    iconItems.forEach(icon => {
        icon.addEventListener('click', () => {
            const section = icon.dataset.section;
            showSection(`${section}-section`);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', hideSections);
    });

    // --- Galería de Imágenes (Modal) ---
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalButton = document.querySelector('.close-button');

    galleryThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            modalImage.src = thumbnail.dataset.fullSrc;
            galleryModal.classList.remove('hidden');
        });
    });

    closeModalButton.addEventListener('click', () => {
        galleryModal.classList.add('hidden');
    });

    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.classList.add('hidden');
        }
    });


    // --- Calendario Interactivo con Eventos ---
    const calendarDaysGrid = document.getElementById('calendar-days');
    const currentMonthYearElement = document.getElementById('currentMonthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('event-title');
    const addEventButton = document.getElementById('add-event-button');
    const eventsUl = document.getElementById('events-ul');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || []; // Cargar eventos

    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    function renderCalendar() {
        calendarDaysGrid.innerHTML = ''; // Limpiar días anteriores
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDayIndex = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Lunes, etc.

        currentMonthYearElement.textContent = new Date(currentYear, currentMonth).toLocaleString('es-BO', { month: 'long', year: 'numeric' });

        // Días vacíos al inicio del mes
        for (let i = 0; i < startDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty-day');
            calendarDaysGrid.appendChild(emptyDay);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;

            const fullDate = new Date(currentYear, currentMonth, day);
            const today = new Date();
            if (fullDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('current-day');
            }

            const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === formattedDate);

            if (dayEvents.length > 0) {
                dayElement.classList.add('has-event');
                const eventDot = document.createElement('span');
                eventDot.classList.add('event-dot');
                dayElement.appendChild(eventDot);
            }

            dayElement.dataset.date = formattedDate; // Guardar la fecha en el dataset
            dayElement.addEventListener('click', (e) => {
                // Al hacer clic en un día del calendario, seleccionar la fecha en el input de evento
                if (!dayElement.classList.contains('empty-day')) {
                    eventDateInput.value = formattedDate;
                    displayEventsForDate(formattedDate);
                }
            });

            calendarDaysGrid.appendChild(dayElement);
        }
        displayEventsForDate(eventDateInput.value || new Date().toISOString().slice(0, 10)); // Mostrar eventos del día actual al cargar
    }

    function addEvent() {
        const date = eventDateInput.value;
        const title = eventTitleInput.value.trim();

        if (date && title) {
            events.push({ date, title });
            saveEvents();
            eventTitleInput.value = ''; // Limpiar input
            renderCalendar(); // Volver a renderizar el calendario para mostrar el evento
            displayEventsForDate(date); // Mostrar el nuevo evento en la lista
        } else {
            alert('Por favor, selecciona una fecha y un título para el evento.');
        }
    }

    function deleteEvent(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            const dateOfDeletedEvent = events[index].date;
            events.splice(index, 1);
            saveEvents();
            renderCalendar(); // Volver a renderizar para quitar el marcador de evento
            displayEventsForDate(dateOfDeletedEvent); // Actualizar la lista de eventos para esa fecha
        }
    }

    function displayEventsForDate(selectedDate) {
        eventsUl.innerHTML = ''; // Limpiar lista
        const filteredEvents = events.filter(event => event.date === selectedDate);

        if (filteredEvents.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No hay eventos para esta fecha.';
            eventsUl.appendChild(li);
        } else {
            filteredEvents.forEach((event, index) => {
                // Encontrar el índice original del evento para borrarlo correctamente
                const originalIndex = events.findIndex(e => e.date === event.date && e.title === event.title);

                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${event.title}</span>
                    <button class="delete-event" data-index="${originalIndex}">&times;</button>
                `;
                eventsUl.appendChild(li);
            });

            // Añadir event listeners a los botones de eliminar
            document.querySelectorAll('.delete-event').forEach(button => {
                button.addEventListener('click', (e) => {
                    const indexToDelete = parseInt(e.target.dataset.index);
                    deleteEvent(indexToDelete);
                });
            });
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    addEventButton.addEventListener('click', addEvent);

    // Inicializar calendario al cargar
    renderCalendar();
    // Establecer la fecha actual en el input del evento por defecto
    eventDateInput.value = new Date().toISOString().slice(0, 10);
});


