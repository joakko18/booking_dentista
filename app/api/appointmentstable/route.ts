import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient'; // Ensure this path is correct

export async function GET() {
    try {
      // Fetch bookings first
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookingdentis')
        .select('id, customer_name, customer_email, service, doctor, notes, date, time, booked, guests, schedule_id');
  
      if (bookingsError) {
        return NextResponse.json({ error: bookingsError.message }, { status: 500 });
      }
  
      // Extract schedule_ids
      const scheduleIds = bookings.map(booking => booking.schedule_id);
  
      // Fetch schedules separately
      const { data: schedules, error: schedulesError } = await supabase
        .from('appointments_schedule')
        .select('id, date, time_slot')
        .in('id', scheduleIds);
  
      if (schedulesError) {
        return NextResponse.json({ error: schedulesError.message }, { status: 500 });
      }
  
      // Merge schedules with bookings
      const combinedData = bookings.map(booking => {
        const schedule = schedules.find(sched => sched.id === booking.schedule_id);
        return {
          ...booking,
          schedule_date: schedule?.date || 'N/A',
          schedule_time_slot: schedule?.time_slot || 'N/A',
        };
      });
  
      return NextResponse.json(combinedData);
    } catch (error: unknown) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
  }
  