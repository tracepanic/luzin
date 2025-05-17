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
    events: [],
    calendarEvents: [],
    currentView: "dayGridMonth",

    updateCurrentView: (input) => {
      set({ currentView: input });
    },

    updateEvents: (input) => {
      const generatedEvents = generateCalendarEvents(input);
      set({
        events: input,
        calendarEvents: generatedEvents,
      });
    },
  }),
);

export { useAdminCalendarStore };
