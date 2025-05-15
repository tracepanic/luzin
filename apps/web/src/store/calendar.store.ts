import { generateCalendarEvents } from "@/lib/events";
import {
  CalendarEvent,
  CurrentCalendarViewType,
  Event,
} from "@/schemas/events";
import { create } from "zustand";

interface AdminCalendarState {
  events: Event[];
  calendarEvents: CalendarEvent[];
  currentView: CurrentCalendarViewType;
}

interface AdminCalendarAction {
  updateEvents: (input: Event[]) => void;
  updateCurrentView: (input: CurrentCalendarViewType) => void;
}

const useAdminCalendarStore = create<AdminCalendarState & AdminCalendarAction>(
  (set) => ({
    // Removed 'get' as it's not needed in the revised updateEvents
    events: [],
    calendarEvents: [],
    currentView: "dayGridMonth",

    updateCurrentView: (input) => {
      set({ currentView: input });
    },

    updateEvents: (input) => {
      // Assuming 'input' is the complete and fresh list of events
      const generatedEvents = generateCalendarEvents(input);
      set({
        events: input, // Set events to the new input
        calendarEvents: generatedEvents, // Set calendarEvents based on the new input
      });
    },
  }),
);

export { useAdminCalendarStore };
