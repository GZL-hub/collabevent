import { createColumnHelper } from '@tanstack/react-table';
import { Calendar, MapPin, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/event';
import { formatDate, formatTime } from '../util/dateUtil';
import React from 'react';
import StatusBadge from './StatusBadge';
import AttendeeBadge from './AttendeeBadge';

const columnHelper = createColumnHelper<Event>();

export const getEventColumns = () => [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: info => (
      <div className="font-medium text-gray-900 text-sm">{info.getValue()}</div>
    ),
  }),
  // Date column
  columnHelper.accessor(row => row.startDate, {
    id: 'date',
    header: () => (
      <div className="flex items-center">
        <Calendar size={14} className="mr-1" />
        <span>Date</span>
      </div>
    ),
    cell: info => (
      <div className="text-sm text-gray-600">
        {formatDate(info.getValue())}
      </div>
    ),
  }),
  // Start Time column
  columnHelper.accessor(row => row.startDate, {
    id: 'startTime',
    header: () => (
      <div className="flex items-center">
        <Clock size={14} className="mr-1" />
        <span>Start Time</span>
      </div>
    ),
    cell: info => (
      <div className="text-sm text-gray-600">
        {formatTime(info.getValue())}
      </div>
    ),
  }),
  // End Time column
  columnHelper.accessor(row => row.endDate, {
    id: 'endTime',
    header: () => (
      <div className="flex items-center">
        <Clock size={14} className="mr-1" />
        <span>End Time</span>
      </div>
    ),
    cell: info => (
      <div className="text-sm text-gray-600">
        {formatTime(info.getValue())}
      </div>
    ),
  }),
  columnHelper.accessor('assignee', {
    header: 'Assignee',
    cell: info => {
      const assignee = info.getValue();
      return (
        <div className="flex items-center">
          <div className={`h-7 w-7 rounded-full bg-${assignee.avatarColor}-100 flex items-center justify-center text-${assignee.avatarColor}-800 font-medium text-xs`}>
            {assignee.initials}
          </div>
          <span className="ml-2 text-sm">{assignee.name}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('location', {
    header: () => (
      <div className="flex items-center">
        <MapPin size={14} className="mr-1" />
        <span>Location</span>
      </div>
    ),
    cell: info => (
      <div className="flex items-center text-sm text-gray-600">
        <MapPin size={14} className="text-gray-400 mr-2" />
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('attendeeType', {
    header: () => (
      <div className="flex items-center">
        <Users size={14} className="mr-1" />
        <span>Attendee Type</span>
      </div>
    ),
    cell: info => <AttendeeBadge type={info.getValue()} />,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => (
      <div className="flex space-x-3 text-sm">
        <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
          <Edit size={14} className="mr-1" />
          <span>Edit</span>
        </button>
        <button className="text-red-600 hover:text-red-900 flex items-center">
          <Trash2 size={14} className="mr-1" />
          <span>Delete</span>
        </button>
      </div>
    ),
  }),
];