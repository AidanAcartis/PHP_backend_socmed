'user client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 

export default function Agenda({ userId }) {
    const [events, setEvents] = useState([]); // Stocker les événements à afficher

    // Récupération des données de l'API
    useEffect(() => {
        async function fetchEvents() {
            try {
                // Correction : utiliser des backticks pour l'interpolation de la variable userId
                const response = await fetch(`http://localhost:3003/api/events?userId=${userId}`); // Modifier avec l'ID utilisateur correct
                const data = await response.json();
                const formattedEvents = data.map(event => ({
                    title: event.new_step, // Affiche 'new_step' comme titre
                    date: event.change_date, // 'change_date' pour la date
                }));
                console.log('data event:', data);
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Erreur lors de la récupération des événements :', error);
            }
        }
        fetchEvents();
    }, [userId]); 
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
            <div className="container mx-auto py-10 px-5">
                <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow-lg">
                    Agenda Futuriste
                </h1>
                <div className="rounded-lg shadow-lg bg-white/10 p-5 w-full">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locale="fr"
                        editable={false}
                        eventContent={(eventInfo) => (
                            <div
                                className="bg-indigo-600 text-white px-2 py-1 rounded shadow-md text-sm truncate hover:scale-105 transform transition-all"
                            >
                                {eventInfo.event.title}
                            </div>
                        )}
                        eventMouseEnter={(mouseEnterInfo) => {
                            // Créer une infobulle contenant le titre et la date
                            const tooltip = document.createElement('div');
                            tooltip.className =
                                'absolute bg-gray-800 text-white p-2 rounded shadow-lg text-sm z-50';
                            tooltip.innerHTML = `
                                <strong>${mouseEnterInfo.event.title}</strong><br />
                                ${mouseEnterInfo.event.start.toLocaleDateString('fr-FR')} ${
                                mouseEnterInfo.event.start.toLocaleTimeString('fr-FR')
                            }
                            `;
                            tooltip.style.position = 'absolute';
                            tooltip.style.zIndex = '9999';
                            tooltip.style.pointerEvents = 'none'; // Éviter que la souris interagisse avec l'infobulle
                            document.body.appendChild(tooltip);
                        
                            // Positionner l'infobulle par rapport à la souris
                            const updateTooltipPosition = (x, y) => {
                                tooltip.style.left = `${x + 10}px`;
                                tooltip.style.top = `${y + 10}px`;
                            };
                        
                            // Position initiale
                            updateTooltipPosition(mouseEnterInfo.jsEvent.pageX, mouseEnterInfo.jsEvent.pageY);
                        
                            // Mettre à jour la position si la souris se déplace sur l'événement
                            mouseEnterInfo.jsEvent.target.addEventListener('mousemove', (e) => {
                                updateTooltipPosition(e.pageX, e.pageY);
                            });
                        
                            // Identifier l'infobulle pour suppression plus tard
                            tooltip.setAttribute('data-tooltip-id', mouseEnterInfo.event.id);
                        }}
                        
                        eventMouseLeave={(mouseLeaveInfo) => {
                            // Supprimer l'infobulle lorsque la souris quitte l’événement
                            const tooltip = document.querySelector(
                                `[data-tooltip-id="${mouseLeaveInfo.event.id}"]`
                            );
                            if (tooltip) tooltip.remove();
                        }}
                        
                        moreLinkClick="popover" // Utiliser une popover pour le bouton "Voir plus"
                        eventDidMount={(info) => {
                            // Ajouter la date à côté de chaque événement dans le cadre "Voir plus"
                            if (info.view.type === 'dayGridMonth') {
                                const eventEl = info.el;
                                const date = info.event.start.toLocaleDateString('fr-FR');
                                const eventTitleEl = eventEl.querySelector('.fc-event-title');
                                if (eventTitleEl) {
                                    eventTitleEl.innerHTML += ` <span class="text-gray-400 text-xs">(${date})</span>`;
                                }
                            }
                        }}
                        dayMaxEventRows={3} // Limite d’affichage des événements par jour
                        moreLinkText="Voir plus" // Texte pour les événements supplémentaires
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay',
                        }}
                        buttonText={{
                            today: "Aujourd'hui",
                            month: 'Mois',
                            week: 'Semaine',
                            day: 'Jour',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
