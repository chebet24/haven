import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import CircularProgress from "@mui/material/CircularProgress";

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/event/all");
        setAllEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents.length > 0 && (
            <EventCard active={true} data={allEvents[0]} />
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;
