'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

interface Appointment {
  id: number;
  schedule_id: number;
  customer_name: string;
  customer_email: string;
  service: string;
  doctor: string;
  notes: string;
  date: string; // From bookingdentis
  time: string;
  booked: boolean;
  guests: string;
  schedule_date: string; // From appointments_schedule
  schedule_time_slot: string;
}

const AppointmentsTable = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointmentstable');
        const data: Appointment[] = await response.json();

        const sortedAppointments = data.sort((a, b) => {
          return new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime();
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <p className="text-center text-red-500">Please log in to view your appointments.</p>;
  }

  const filteredAppointments = appointments.filter((appt) =>
    appt.schedule_date.includes(searchDate)
  );

  const startIndex = currentPage * rowsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">📅 Appointments</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Date (YYYY-MM-DD)"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-center text-red-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Service</th>
                <th className="py-2 px-4 text-left">Doctor</th>
                <th className="py-2 px-4 text-left">Notes</th>
                <th className="py-2 px-4 text-left">Booking Date</th>
                <th className="py-2 px-4 text-left">Booking Time</th>
                <th className="py-2 px-4 text-left">Scheduled Date</th>
                <th className="py-2 px-4 text-left">Scheduled Time</th>
                <th className="py-2 px-4 text-left">Guests</th>
                <th className="py-2 px-4 text-left">Booked</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appt) => (
                <tr key={appt.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2 px-4">{appt.id}</td>
                  <td className="py-2 px-4">{appt.customer_name}</td>
                  <td className="py-2 px-4">{appt.customer_email}</td>
                  <td className="py-2 px-4">{appt.service}</td>
                  <td className="py-2 px-4">{appt.doctor}</td>
                  <td className="py-2 px-4">{appt.notes || 'N/A'}</td>
                  <td className="py-2 px-4">{appt.date}</td>
                  <td className="py-2 px-4">{appt.time}</td>
                  <td className="py-2 px-4">{appt.schedule_date}</td>
                  <td className="py-2 px-4">{appt.schedule_time_slot}</td>
                  <td className="py-2 px-4">{appt.guests}</td>
                  <td className="py-2 px-4">{appt.booked ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              ◀ Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={startIndex + rowsPerPage >= filteredAppointments.length}
              className={`px-4 py-2 rounded-lg ${
                startIndex + rowsPerPage >= filteredAppointments.length
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;