import { CalendarEvent, Event } from "@/schemas/events";
import { DateTime } from "luxon";
import { RRule, Options as RRuleOptions, RRuleSet, rrulestr } from "rrule";
import { toast } from "sonner";

export function parseDuration(durationStr: string): number {
  if (!durationStr) return 3600000;

  const parts = durationStr.split(":").map((p) => parseInt(p, 10) || 0);
  const [hours, minutes, seconds] = [
    parts[0] || 0,
    parts[1] || 0,
    parts[2] || 0,
  ];

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export function generateCalendarEvents(events: Event[]): CalendarEvent[] {
  const calendarEvents: CalendarEvent[] = [];
  const now = new Date();
  const startRange = new Date(now);
  startRange.setMonth(now.getMonth() - 12);
  const endRange = new Date(now);
  endRange.setMonth(now.getMonth() + 12);

  events.forEach((event) => {
    try {
      if (!event.rrule) {
        return;
      }

      let rruleObj: RRule | RRuleSet | undefined = undefined;
      const rruleStringInput = event.rrule;
      const rruleKeywordIndex = rruleStringInput.indexOf("RRULE:");

      if (rruleKeywordIndex !== -1) {
        const dtstartPart = rruleStringInput
          .substring(0, rruleKeywordIndex)
          .trim();
        const rrulePart = rruleStringInput.substring(rruleKeywordIndex);

        const dtMatch = dtstartPart.match(
          /DTSTART(?:;TZID=([^:=]+))?[:=]([0-9]{8}T[0-9]{6})(Z)?/,
        );

        if (dtMatch) {
          const explicitTzid = dtMatch[1];
          const dateTimeStr = dtMatch[2];
          const isUTC = dtMatch[3] === "Z";

          let jsDateForRRule: Date;
          let tzidForRRuleOptions: string | undefined = undefined;

          if (explicitTzid) {
            const luxonDt = DateTime.fromISO(dateTimeStr, {
              zone: explicitTzid,
            });

            if (!luxonDt.isValid) {
              return;
            }

            jsDateForRRule = luxonDt.toJSDate();
            tzidForRRuleOptions = explicitTzid;
          } else if (isUTC) {
            const luxonDt = DateTime.fromISO(dateTimeStr, { zone: "utc" });
            if (!luxonDt.isValid) {
              return;
            }

            jsDateForRRule = luxonDt.toJSDate();
            tzidForRRuleOptions = "UTC";
          } else {
            const floatingLuxonDt = DateTime.fromISO(dateTimeStr);
            if (!floatingLuxonDt.isValid) {
              return;
            }

            jsDateForRRule = floatingLuxonDt.toJSDate();
            tzidForRRuleOptions = undefined;
          }

          const justTheRule = rrulePart.startsWith("RRULE:")
            ? rrulePart.substring(6)
            : rrulePart;
          const ruleOptionsFromStr = RRule.parseString(justTheRule);

          const finalRRuleOptions: Partial<RRuleOptions> = {
            ...ruleOptionsFromStr,
            dtstart: jsDateForRRule,
          };

          if (tzidForRRuleOptions) {
            finalRRuleOptions.tzid = tzidForRRuleOptions;
          }

          rruleObj = new RRule(finalRRuleOptions);
        } else {
          rruleObj = rrulestr(rruleStringInput, { forceset: true });
        }
      } else {
        rruleObj = rrulestr(rruleStringInput, { forceset: true });
      }

      if (!rruleObj) {
        return;
      }

      const durationMs = parseDuration(event.duration);
      const allDates = rruleObj.between(startRange, endRange, true);

      allDates.forEach((occurrence) => {
        const start = new Date(occurrence);
        const end = new Date(start.getTime() + durationMs);
        calendarEvents.push({
          id: event.id,
          title: event.title,
          start,
          end,
        });
      });
    } catch (error) {
      toast.error("Failed to add event to calendar");
    }
  });

  return calendarEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}
