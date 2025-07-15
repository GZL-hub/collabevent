import React, { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState
} from '@tanstack/react-table';

import { getEventColumns } from './components/EventsColumns';
import EventsTable from './components/EventsTable';
import EventsTableHeader from './components/EventsTabHeader';
import EventsSearch from './components/EventsSearch';
import CreateEventModal from './components/CreateEventModal';
import EditEventModal from './components/EditEventModal';
import DeleteEventModal from './components/DeleteEventModal';
import { Event } from './types/event';
import { EventService } from './service/eventService';

const EventsContent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await EventService.getAllEvents({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id || 'startDate',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      });
      
      if (response.success && response.data) {
        // Convert date strings back to Date objects
        const eventsWithDates = response.data.events.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
          updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
        }));
        
        setEvents(eventsWithDates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount and when pagination/sorting changes
  useEffect(() => {
    fetchEvents();
  }, [pagination.pageIndex, pagination.pageSize, sorting]);

  // Handle creating new event
  const handleCreateEvent = async (eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      
      const response = await EventService.createEvent(eventData);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        console.log('✅ Event created successfully:', response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Error creating event:', err);
    }
  };

  // Handle updating event
  const handleUpdateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      setError(null);
      
      const response = await EventService.updateEvent(eventId, eventData);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        console.log('✅ Event updated successfully:', response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  // Handle deleting event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      setError(null);
      
      const response = await EventService.deleteEvent(eventId);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        console.log('✅ Event deleted successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  // Handle edit button click
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  // Get column definitions with action handlers
  const columns = getEventColumns(handleEditClick, handleDeleteClick);

  // Create table instance
  const table = useReactTable({
    data: events,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    pageCount: -1,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-gray-600 ml-2">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-400 mr-2">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Events</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <EventsTableHeader 
        totalEvents={events.length} 
        onCreateEvent={() => setIsCreateModalOpen(true)}
      />
      
      {/* Search and filter */}
      <EventsSearch 
        value={globalFilter ?? ''} 
        onChange={setGlobalFilter}
        resultCount={table.getFilteredRowModel().rows.length}
      />
      
      {/* Table with pagination */}
      <EventsTable table={table} />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleUpdateEvent}
        event={selectedEvent}
      />

      {/* Delete Event Modal */}
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteEvent}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventsContent;