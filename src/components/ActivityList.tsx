"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  GraduationCap,
  Wrench,
  Heart,
  Users,
  Sparkles,
  Dumbbell,
  ShoppingBag,
  LayoutGrid,
  type LucideIcon
} from "lucide-react";
import type { Activity, ActivityType, ActivityLanguage } from "@/lib/activity-types";
import { activityTypeLabels, languageLabels, isActivityToday, isActivityThisWeekend } from "@/lib/activity-types";
import { Languages } from "lucide-react";
import { ActivityCard } from "./ActivityCard";

// Eventbrite-style activity type icons with colors
const activityTypeConfig: Record<"all" | ActivityType, { icon: LucideIcon; color: string; bgColor: string }> = {
  all: { icon: LayoutGrid, color: "text-gray-600", bgColor: "bg-gray-100" },
  lecture: { icon: GraduationCap, color: "text-blue-600", bgColor: "bg-blue-100" },
  workshop: { icon: Wrench, color: "text-purple-600", bgColor: "bg-purple-100" },
  charity: { icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
  community: { icon: Users, color: "text-teal-600", bgColor: "bg-teal-100" },
  youth: { icon: Sparkles, color: "text-orange-600", bgColor: "bg-orange-100" },
  sports: { icon: Dumbbell, color: "text-green-600", bgColor: "bg-green-100" },
  shopping: { icon: ShoppingBag, color: "text-pink-600", bgColor: "bg-pink-100" },
  other: { icon: Calendar, color: "text-gray-600", bgColor: "bg-gray-100" },
};

interface ActivityListProps {
  activities: Activity[];
  embedded?: boolean;
}

type DateFilter = "all" | "today" | "weekend" | "week" | "month";

export function ActivityList({ activities, embedded = false }: ActivityListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all" as "all" | ActivityType,
    date: "all" as DateFilter,
    for_youth: false,
    language: "all" as "all" | ActivityLanguage,
  });

  // Check if any filter is active
  const hasActiveFilters =
    filters.type !== "all" || filters.date !== "all" || filters.for_youth || filters.language !== "all";

  // Filter activities
  const filteredActivities = useMemo(() => {
    let result = activities;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.location_name.toLowerCase().includes(query) ||
          activity.address.toLowerCase().includes(query) ||
          activity.city.toLowerCase().includes(query) ||
          (activity.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((activity) => activity.activity_type === filters.type);
    }

    // Date filter
    if (filters.date !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((activity) => {
        const activityDate = new Date(activity.event_date);
        activityDate.setHours(0, 0, 0, 0);

        switch (filters.date) {
          case "today":
            return isActivityToday(activity.event_date);
          case "weekend":
            return isActivityThisWeekend(activity.event_date);
          case "week": {
            const oneWeekFromNow = new Date(today);
            oneWeekFromNow.setDate(today.getDate() + 7);
            return activityDate >= today && activityDate <= oneWeekFromNow;
          }
          case "month": {
            const oneMonthFromNow = new Date(today);
            oneMonthFromNow.setMonth(today.getMonth() + 1);
            return activityDate >= today && activityDate <= oneMonthFromNow;
          }
          default:
            return true;
        }
      });
    }

    // Youth filter
    if (filters.for_youth) {
      result = result.filter((activity) => activity.for_youth);
    }

    // Language filter
    if (filters.language !== "all") {
      result = result.filter((activity) => activity.language === filters.language);
    }

    // Sort by date
    result = [...result].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

    return result;
  }, [activities, searchQuery, filters]);

  const clearFilters = () => {
    setFilters({
      type: "all",
      date: "all",
      for_youth: false,
    });
    setSearchQuery("");
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">Nog geen activiteiten beschikbaar</p>
      </div>
    );
  }

  const content = (
    <div ref={ref}>
      {/* Search & Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Zoek op naam, locatie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? "bg-teal text-white"
              : "bg-gray-100 text-text-secondary hover:bg-gray-200"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-white text-teal text-xs font-bold rounded-full flex items-center justify-center">
              {(filters.type !== "all" ? 1 : 0) +
                (filters.date !== "all" ? 1 : 0) +
                (filters.for_youth ? 1 : 0)}
            </span>
          )}
        </button>
      </motion.div>

      {/* Date Filter Chips (always visible) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {(
          [
            { value: "all", label: "Alle datums" },
            { value: "today", label: "Vandaag" },
            { value: "weekend", label: "Dit weekend" },
            { value: "week", label: "Deze week" },
            { value: "month", label: "Deze maand" },
          ] as { value: DateFilter; label: string }[]
        ).map((option) => (
          <button
            key={option.value}
            onClick={() => setFilters({ ...filters, date: option.value })}
            className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              filters.date === option.value
                ? "bg-teal text-white font-medium"
                : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {option.label}
          </button>
        ))}
      </motion.div>

      {/* Eventbrite-style Category Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {(["all", ...Object.keys(activityTypeLabels)] as Array<"all" | ActivityType>).map((type) => {
            const config = activityTypeConfig[type];
            const Icon = config.icon;
            const isActive = filters.type === type;
            const label = type === "all" ? "Alles" : activityTypeLabels[type as ActivityType];

            return (
              <button
                key={type}
                onClick={() => setFilters({ ...filters, type })}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-teal text-white ring-4 ring-teal/30 scale-105"
                      : `${config.bgColor} ${config.color} hover:scale-105 hover:shadow-md`
                  }`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    isActive ? "text-teal" : "text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Filter Panel (Additional filters) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-2xl p-5 mb-6"
        >
          <div className="space-y-4">
            {/* Youth filter */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">
                Extra filters
              </p>
              <button
                onClick={() => setFilters({ ...filters, for_youth: !filters.for_youth })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  filters.for_youth
                    ? "bg-orange-500 text-white font-medium"
                    : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Voor Jeugd
              </button>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-teal hover:underline">
                Alle filters wissen
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Results count */}
      {(searchQuery || hasActiveFilters) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-text-muted mb-6"
        >
          {filteredActivities.length} resultaat
          {filteredActivities.length !== 1 ? "en" : ""} gevonden
        </motion.p>
      )}

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            {searchQuery || hasActiveFilters
              ? "Geen activiteiten gevonden met de huidige filters"
              : "Geen activiteiten beschikbaar"}
          </p>
          {(searchQuery || hasActiveFilters) && (
            <button onClick={clearFilters} className="mt-4 text-teal hover:underline">
              Filters wissen
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section id="activities" className="bg-off-white section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="heading-section mb-4"
          >
            Activiteiten
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-body"
          >
            {activities.length} activiteit{activities.length !== 1 ? "en" : ""} gepland
          </motion.p>
        </div>
        {content}
      </div>
    </section>
  );
}
