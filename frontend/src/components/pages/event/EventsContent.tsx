import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState
} from '@tanstack/react-table';

// Import data and components

import { getEventColumns } from './components/EventsColumns';
import EventsTable from './components/EventsTable';
import EventsTableHeader from './components/EventsTabHeader';
import EventsSearch from './components/EventsSearch';
import { eventsData } from './data/eventsData';


const EventsContent: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Get column definitions
  const columns = getEventColumns();

  // Create table instance
  const table = useReactTable({
    data: eventsData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <EventsTableHeader totalEvents={eventsData.length} />
      
      {/* Search and filter */}
      <EventsSearch 
        value={globalFilter ?? ''} 
        onChange={setGlobalFilter}
        resultCount={table.getFilteredRowModel().rows.length}
      />
      
      {/* Table with pagination */}
      <EventsTable table={table} />
    </div>
  );
};

export default EventsContent;