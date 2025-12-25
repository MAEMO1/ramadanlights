"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, X, ExternalLink, Globe, Facebook, Instagram } from "lucide-react";
import { type IftarLocation, formatFrequencyDisplay } from "@/lib/iftar-types";

interface IftarCalendarProps {
  locations: IftarLocation[];
}

type ViewMode = "3days" | "week" | "month";

// Ramadan 2026 dates (approximate - 17 Feb to 19 March 2026)
const RAMADAN_START = new Date(2026, 1, 17); // Feb 17, 2026
const RAMADAN_END = new Date(2026, 2, 19); // March 19, 2026

const DAY_NAMES = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const DAY_NAMES_FULL = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
const MONTH_NAMES = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

// Map day names to indices (Sunday = 0)
const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function getIftarsForDate(locations: IftarLocation[], date: Date): IftarLocation[] {
  const dayOfWeek = date.getDay();
  const dayName = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === dayOfWeek) || "";

  return locations.filter((loc) => {
    // Check date range
    const startDate = loc.start_date ? new Date(loc.start_date) : null;
    const endDate = loc.end_date ? new Date(loc.end_date) : null;

    if (!isDateInRange(date, startDate, endDate)) {
      return false;
    }

    // Check frequency
    switch (loc.frequency) {
      case "daily":
        return true;
      case "weekly":
      case "specific_days":
        return loc.days_of_week?.includes(dayName) || false;
      case "one_time":
        return startDate ? isSameDay(date, startDate) : false;
      default:
        return true;
    }
  });
}

// Generate all days in Ramadan for month view
function getRamadanDays(): Date[] {
  const days: Date[] = [];
  const current = new Date(RAMADAN_START);
  while (current <= RAMADAN_END) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function IftarCalendar({ locations }: IftarCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedIftar, setSelectedIftar] = useState<IftarLocation | null>(null);
  const [startDate, setStartDate] = useState(() => {
    // Start with today if within Ramadan, otherwise start of Ramadan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today >= RAMADAN_START && today <= RAMADAN_END) {
      return today;
    }
    return new Date(RAMADAN_START);
  });

  const days = useMemo(() => {
    if (viewMode === "month") {
      return getRamadanDays();
    }
    const numDays = viewMode === "3days" ? 3 : 7;
    const result: Date[] = [];
    for (let i = 0; i < numDays; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      result.push(day);
    }
    return result;
  }, [startDate, viewMode]);

  const navigate = (direction: "prev" | "next") => {
    const offset = viewMode === "3days" ? 3 : 7;
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + (direction === "next" ? offset : -offset));
    setStartDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const selectedDayIftars = selectedDate ? getIftarsForDate(locations, selectedDate) : [];

  return (
    <section className="bg-[#f8fafa] section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-section mb-4"
          >
            Iftar planning
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-body"
          >
            Bekijk welke iftars beschikbaar zijn per dag
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6"
        >
          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("3days")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === "3days"
                  ? "bg-teal text-white"
                  : "bg-surface-soft text-text-secondary hover:bg-surface-soft/80"
              }`}
            >
              3 dagen
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === "week"
                  ? "bg-teal text-white"
                  : "bg-surface-soft text-text-secondary hover:bg-surface-soft/80"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === "month"
                  ? "bg-teal text-white"
                  : "bg-surface-soft text-text-secondary hover:bg-surface-soft/80"
              }`}
            >
              Maand
            </button>
          </div>

          {/* Navigation - only for 3days and week view */}
          {viewMode !== "month" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("prev")}
                className="p-2 rounded-full bg-surface-soft hover:bg-surface-soft/80 transition-colors"
                aria-label="Vorige"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={goToToday}
                className="px-4 py-2 rounded-full bg-surface-soft hover:bg-surface-soft/80 transition-colors text-sm font-medium"
              >
                Vandaag
              </button>

              <button
                onClick={() => navigate("next")}
                className="p-2 rounded-full bg-surface-soft hover:bg-surface-soft/80 transition-colors"
                aria-label="Volgende"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Date range display */}
          <div className="text-sm text-text-muted font-medium">
            {viewMode === "month"
              ? "Ramadan 2026"
              : `${formatDate(days[0])} - ${formatDate(days[days.length - 1])}`
            }
          </div>
        </motion.div>

        {/* Month View */}
        {viewMode === "month" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before Ramadan starts */}
              {Array.from({ length: RAMADAN_START.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Ramadan days */}
              {days.map((day) => {
                const iftarsForDay = getIftarsForDate(locations, day);
                const dayIsToday = isToday(day);
                const count = iftarsForDay.length;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-xl p-1 transition-all relative ${
                      dayIsToday
                        ? "bg-teal text-white ring-2 ring-teal ring-offset-2"
                        : count > 0
                        ? "bg-teal/10 hover:bg-teal/20"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${dayIsToday ? "text-white" : "text-text-primary"}`}>
                      {day.getDate()}
                    </div>
                    {count > 0 && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5`}>
                        {count <= 3 ? (
                          Array.from({ length: count }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${dayIsToday ? "bg-white" : "bg-teal"}`}
                            />
                          ))
                        ) : (
                          <span className={`text-[10px] font-bold ${dayIsToday ? "text-white" : "text-teal"}`}>
                            {count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-teal" />
                <span>Vandaag</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-teal/10" />
                <span>Heeft iftars</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                </div>
                <span>Aantal iftars</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3 Days / Week View */}
        {viewMode !== "month" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`grid gap-4 ${viewMode === "3days" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"}`}
          >
            {days.map((day) => {
              const iftarsForDay = getIftarsForDate(locations, day);
              const dayIsToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    dayIsToday
                      ? "border-teal bg-teal/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  {/* Day header */}
                  <div className="text-center mb-3 pb-3 border-b border-gray-100">
                    <div className={`text-xs font-medium uppercase tracking-wide ${dayIsToday ? "text-teal" : "text-text-muted"}`}>
                      {DAY_NAMES_FULL[day.getDay()]}
                    </div>
                    <div className={`text-2xl font-bold ${dayIsToday ? "text-teal" : "text-text-primary"}`}>
                      {day.getDate()}
                    </div>
                    <div className="text-xs text-text-muted">
                      {MONTH_NAMES[day.getMonth()]}
                    </div>
                  </div>

                  {/* Iftars for this day */}
                  <div className="space-y-2">
                    {iftarsForDay.length === 0 ? (
                      <p className="text-xs text-text-muted text-center py-2">
                        Geen iftars
                      </p>
                    ) : (
                      iftarsForDay.map((iftar) => (
                        <button
                          key={iftar.id}
                          onClick={() => setSelectedIftar(iftar)}
                          className="w-full p-2 bg-surface-soft rounded-lg text-xs text-left hover:bg-teal/10 hover:ring-1 hover:ring-teal/30 transition-all cursor-pointer"
                        >
                          <div className="font-semibold text-text-primary truncate">
                            {iftar.mosque_name}
                          </div>
                          <div className="flex items-center gap-1 text-text-muted mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{iftar.iftar_time || "Tijd onbekend"}</span>
                          </div>
                          {iftar.is_free && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">
                              Gratis
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Count badge */}
                  {iftarsForDay.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                      <span className="text-xs font-medium text-teal">
                        {iftarsForDay.length} iftar{iftarsForDay.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-text-muted"
        >
          <Calendar className="w-4 h-4 inline-block mr-1" />
          Ramadan 2026: 17 februari - 19 maart
        </motion.div>

        {/* Iftar Detail Modal (for 3days/week view) */}
        <AnimatePresence>
          {selectedIftar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedIftar(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-teal/5">
                  <div>
                    <div className="text-xl font-bold text-text-primary">
                      {selectedIftar.mosque_name}
                    </div>
                    <div className="text-sm text-text-muted">
                      {selectedIftar.address}, {selectedIftar.city}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIftar(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal content */}
                <div className="p-4 space-y-4">
                  {/* Time and frequency */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-teal/10 rounded-xl">
                      <Clock className="w-5 h-5 text-teal" />
                      <span className="font-semibold text-teal">
                        {selectedIftar.iftar_time || "Tijd onbekend"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        {formatFrequencyDisplay(selectedIftar.frequency, selectedIftar.days_of_week || [])}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedIftar.is_free && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Gratis
                      </span>
                    )}
                    {!selectedIftar.is_free && selectedIftar.price_info && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {selectedIftar.price_info}
                      </span>
                    )}
                    {selectedIftar.capacity && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {selectedIftar.capacity} personen
                      </span>
                    )}
                  </div>

                  {/* Accessibility */}
                  <div className="flex flex-wrap gap-2">
                    {selectedIftar.for_men && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        Mannen
                      </span>
                    )}
                    {selectedIftar.for_women && (
                      <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                        Vrouwen
                      </span>
                    )}
                    {selectedIftar.for_families && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                        Gezinnen
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {selectedIftar.description && (
                    <p className="text-sm text-text-muted">
                      {selectedIftar.description}
                    </p>
                  )}

                  {/* Links */}
                  {(selectedIftar.registration_url || selectedIftar.website_url || selectedIftar.facebook_url || selectedIftar.instagram_url) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      {selectedIftar.registration_url && (
                        <a
                          href={selectedIftar.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white text-sm rounded-full hover:bg-teal/90 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Inschrijven
                        </a>
                      )}
                      {selectedIftar.website_url && (
                        <a
                          href={selectedIftar.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {selectedIftar.facebook_url && (
                        <a
                          href={selectedIftar.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      )}
                      {selectedIftar.instagram_url && (
                        <a
                          href={selectedIftar.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-100 text-pink-700 text-sm rounded-full hover:bg-pink-200 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day Detail Modal (for month view) */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-text-muted">
                      {DAY_NAMES_FULL[selectedDate.getDay()]}
                    </div>
                    <div className="text-xl font-bold text-text-primary">
                      {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]} 2026
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                  {selectedDayIftars.length === 0 ? (
                    <p className="text-center text-text-muted py-8">
                      Geen iftars op deze dag
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayIftars.map((iftar) => (
                        <div
                          key={iftar.id}
                          className="p-4 bg-surface-soft rounded-xl"
                        >
                          <div className="font-semibold text-text-primary mb-2">
                            {iftar.mosque_name}
                          </div>
                          <div className="space-y-1 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-teal" />
                              <span>Iftar: {iftar.iftar_time}</span>
                            </div>
                            <div className="text-xs">
                              {iftar.address}, {iftar.city}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {iftar.is_free && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Gratis
                              </span>
                            )}
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                              {formatFrequencyDisplay(iftar.frequency, iftar.days_of_week || [])}
                            </span>
                          </div>
                          {/* Links */}
                          {(iftar.registration_url || iftar.website_url || iftar.facebook_url || iftar.instagram_url) && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                              {iftar.registration_url && (
                                <a
                                  href={iftar.registration_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-teal text-white text-xs rounded-full hover:bg-teal/90 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Inschrijven
                                </a>
                              )}
                              {iftar.website_url && (
                                <a
                                  href={iftar.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                </a>
                              )}
                              {iftar.facebook_url && (
                                <a
                                  href={iftar.facebook_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                                >
                                  <Facebook className="w-3 h-3" />
                                  Facebook
                                </a>
                              )}
                              {iftar.instagram_url && (
                                <a
                                  href={iftar.instagram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200 transition-colors"
                                >
                                  <Instagram className="w-3 h-3" />
                                  Instagram
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
