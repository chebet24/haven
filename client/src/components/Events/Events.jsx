import React, { useState, useEffect } from 'react';
import styles from '../../styles/style';
import EventCard from './EventCard';
import axios from 'axios';

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/event/all');
        setAllEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {allEvents.length !== 0 ? (
              allEvents.map(event => (
                <EventCard key={event.id} data={event} />
              ))
            ) : (
              <h4>No Events have!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
