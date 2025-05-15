"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CurrentCalendarViewType } from "@/schemas/events";
import { adminGetEvents } from "@/server/events";
import { useAdminCalendarStore } from "@/store/calendar.store";
import "@/styles/calendar.css";
import {
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Page() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const { calendarEvents, updateEvents, currentView, updateCurrentView } =
    useAdminCalendarStore();

  const { data, isSuccess, isFetching } = useQuery({
    queryKey: ["admin-events"],
    queryFn: adminGetEvents,
    meta: { showError: true },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (isSuccess && data) {
      updateEvents(data);
    }
  }, [isSuccess, data, updateEvents]);

  const handleEventClick = (info: EventClickArg) => {
    console.log("Clicked");
  };

  function updateCalendarCurrentView(type: CurrentCalendarViewType) {
    calendarRef.current!.getApi().changeView(type);
    updateCurrentView(type);
  }

  function goBackToToday() {
    calendarRef.current!.getApi().today();
  }

  function goToNext() {
    calendarRef.current!.getApi().next();
  }

  function goToPrevious() {
    calendarRef.current!.getApi().prev();
  }

  const EventItem = ({ info }: { info: EventContentArg }) => {
    return (
      <>
        {info.view.type === "dayGridMonth" && (
          <div className="bg-primary/10 border border-primary/80 py-0.5 truncate tracking-wider w-full text-primary line-clamp-1 px-2">
            {info.event.title}
          </div>
        )}
        {info.view.type === "timeGridWeek" && (
          <div className="bg-primary/10 w-full h-full border border-primary/80 py-0.5 tracking-wider backdrop-blur-3xl text-primary px-2">
            {info.event.title}
          </div>
        )}
        {info.view.type === "timeGridDay" && (
          <div className="bg-primary/10 w-full h-full border border-primary/80 py-0.5 tracking-wider backdrop-blur-3xl text-primary px-2">
            {info.event.title}
          </div>
        )}
      </>
    );
  };

  const DayHeader = ({ info }: { info: DayHeaderContentArg }) => {
    const [weekday] = info.text.split(" ");

    return (
      <div className="flex items-center h-full overflow-hidden">
        {info.view.type == "timeGridDay" && (
          <div className="flex flex-col rounded-sm">
            <p>
              {info.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}
        {info.view.type == "timeGridWeek" && (
          <div className="flex flex-col space-y-0.5 rounded-sm items-center w-full text-xs sm:text-sm md:text-md">
            <p className="flex font-semibold">{weekday}</p>
            {info.isToday ? (
              <div className="flex bg-foreground h-6 w-6 rounded-full items-center justify-center text-xs sm:text-sm md:text-md">
                <p className="font-light text-background">
                  {info.date.getDate()}
                </p>
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full items-center justify-center">
                <p className="font-light">{info.date.getDate()}</p>
              </div>
            )}
          </div>
        )}
        {info.view.type === "dayGridMonth" && (
          <div className="flex flex-col rounded-sm">
            <p>{weekday}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <Card>
        <CardHeader className="w-full flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-3 md:gap-5">
          <div className="flex items-center gap-4">
            <Button className="w-28" onClick={() => goBackToToday()}>
              {currentView === "timeGridDay"
                ? "Today"
                : currentView === "timeGridWeek"
                  ? "This Week"
                  : currentView === "dayGridMonth"
                    ? "This Month"
                    : null}
            </Button>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPrevious()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {currentView === "timeGridDay"
                        ? "Yesterday"
                        : currentView === "timeGridWeek"
                          ? "Last Week"
                          : currentView === "dayGridMonth"
                            ? "Last Month"
                            : null}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToNext()}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {currentView === "timeGridDay"
                        ? "Tomorror"
                        : currentView === "timeGridWeek"
                          ? "Next Week"
                          : currentView === "dayGridMonth"
                            ? "Next Month"
                            : null}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isFetching && (
              <RefreshCw className="animate-spin text-muted-foreground" />
            )}
          </div>
          <div>
            <Select
              value={currentView}
              onValueChange={(value) =>
                updateCalendarCurrentView(value as CurrentCalendarViewType)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeGridDay">Day</SelectItem>
                <SelectItem value="timeGridWeek">Week</SelectItem>
                <SelectItem value="dayGridMonth">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            eventContent={(eventInfo) => <EventItem info={eventInfo} />}
            dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo} />}
            eventClick={(eventInfo) => handleEventClick(eventInfo)}
            events={calendarEvents}
            height="80vh"
            allDaySlot={false}
            windowResizeDelay={0}
            expandRows
            editable
            selectable
          />
        </CardContent>
      </Card>
    </div>
  );
}
