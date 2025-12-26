"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Globe,
  Facebook,
  Instagram,
  GraduationCap,
  Wrench,
  Heart,
  Baby,
  Dumbbell,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";
import type { Activity, ActivityType } from "@/lib/activity-types";
import {
  activityTypeLabels,
  formatActivityDate,
  formatActivityTime,
  isActivityToday,
} from "@/lib/activity-types";

// Icon map for activity types
const activityTypeIconMap: Record<ActivityType, LucideIcon> = {
  lecture: GraduationCap,
  workshop: Wrench,
  charity: Heart,
  community: Users,
  youth: Baby,
  sports: Dumbbell,
  shopping: ShoppingBag,
  other: Calendar,
};

interface ActivityCardProps {
  activity: Activity;
  index?: number;
  isInView?: boolean;
}

export function ActivityCard({
  activity,
  index = 0,
  isInView = true,
}: ActivityCardProps) {
  const isToday = isActivityToday(activity.event_date);
  const TypeIcon = activityTypeIconMap[activity.activity_type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="card hover:shadow-lg transition-shadow relative overflow-hidden"
    >
      {/* Cover Image */}
      {activity.cover_image_url && (
        <div className="relative h-40 -mx-6 -mt-6 mb-4">
          <img
            src={activity.cover_image_url}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Date Badge Overlay */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white rounded-lg shadow-md">
            <span className="text-sm font-bold text-text-primary">
              {formatActivityDate(activity.event_date)}
            </span>
          </div>
        </div>
      )}

      {/* Type Badge & Today Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-teal/10 text-teal">
          <TypeIcon className="w-3 h-3" />
          {activityTypeLabels[activity.activity_type]}
        </span>
        {isToday && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700">
            Vandaag
          </span>
        )}
        {activity.is_free && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
            Gratis
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
        {activity.title}
      </h3>

      {/* Date & Time (if no cover image) */}
      {!activity.cover_image_url && (
        <div className="flex items-center gap-2 p-3 bg-teal/10 rounded-xl mb-3">
          <Calendar className="w-5 h-5 text-teal" />
          <span className="font-semibold text-teal">
            {formatActivityDate(activity.event_date)}
          </span>
          {(activity.start_time || activity.end_time) && (
            <>
              <span className="text-teal">|</span>
              <Clock className="w-4 h-4 text-teal" />
              <span className="text-teal">
                {formatActivityTime(activity.start_time, activity.end_time)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Time (if cover image exists) */}
      {activity.cover_image_url && (activity.start_time || activity.end_time) && (
        <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
          <Clock className="w-4 h-4" />
          <span>{formatActivityTime(activity.start_time, activity.end_time)}</span>
        </div>
      )}

      {/* Location */}
      <div className="space-y-1 mb-4">
        <div className="flex items-start gap-2 text-text-primary text-sm font-medium">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{activity.location_name}</span>
        </div>
        <div className="flex items-start gap-2 text-text-muted text-sm pl-6">
          <span>
            {activity.address}, {activity.city}
          </span>
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <p className="text-sm text-text-muted line-clamp-2 mb-4">
          {activity.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm">
        {activity.capacity && (
          <div className="flex items-center gap-2 text-text-muted">
            <Users className="w-4 h-4" />
            <span>Capaciteit: {activity.capacity} personen</span>
          </div>
        )}

        {!activity.is_free && activity.price && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-amber-700">{activity.price}</span>
          </div>
        )}
      </div>

      {/* Target Audience Tags */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {activity.for_men && (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
            Mannen
          </span>
        )}
        {activity.for_women && (
          <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
            Vrouwen
          </span>
        )}
        {activity.for_families && (
          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
            Gezinnen
          </span>
        )}
        {activity.for_youth && (
          <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
            Jeugd
          </span>
        )}
      </div>

      {/* Links */}
      {(activity.registration_url ||
        activity.website_url ||
        activity.facebook_url ||
        activity.instagram_url) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {activity.registration_url && (
            <a
              href={activity.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs rounded-full hover:bg-teal/90 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Inschrijven
            </a>
          )}
          {activity.website_url && (
            <a
              href={activity.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
          {activity.facebook_url && (
            <a
              href={activity.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
            >
              <Facebook className="w-3 h-3" />
            </a>
          )}
          {activity.instagram_url && (
            <a
              href={activity.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200 transition-colors"
            >
              <Instagram className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
