"use client";
import FullCalendar from '@fullcalendar/react'; // FullCalendar React component
import dayGridPlugin from '@fullcalendar/daygrid'; // dayGrid plugin for month view
import interactionPlugin from '@fullcalendar/interaction'; // Plugin for events interaction
import React, { useState } from 'react';
import AddAppointment from './AddAppointments'; // Import AddAppointment to display filtered slots

const FullCalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State for the selected date

  // Handle date click
  const handleDateClick = (info: { dateStr: string }) => {
    console.log("Selected date:", info.dateStr); // Log the selected date
    setSelectedDate(info.dateStr); // Save the selected date in state
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // Add the required plugins
          initialView="dayGridMonth" // Default view is month grid
          selectable={true} // Allow selecting dates
          editable={false} // Disable editing events
          eventColor="#378006" // Customize event color
          height="auto" // Allow full height for the calendar
          dateClick={handleDateClick} // Attach date click handler
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          contentHeight={450} // Adjust height to make it slightly smaller
        />

        {/* Pass selectedDate to AddAppointment to filter slots */}
        {selectedDate && <AddAppointment selectedDate={selectedDate} />}
      </div>
    </div>
  );
};

export default FullCalendarComponent;
