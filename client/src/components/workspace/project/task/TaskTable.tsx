import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { X } from 'lucide-react';
import { Task } from '@/types/task.type';
import { getAllTasksQueryFn } from '@/lib/api';
import { useTaskTableFilter } from '@/hooks/use-task-table-filters';
import { getMemberOptions, getProjectOptions } from '@/hoc/options';
import { useGetProjectsInWorkspace, useGetWorkspaceMembers } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getColumns } from './table/Columns';
import { DataTable } from './table/DataTable';
import { priorities, statuses } from './table/Data';
import { DataTableFacetedFilter } from './table/TableFactedFilter';

type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  projectId?: string;
  filters: Filters;
  setFilters: SetFilters;
}

export const TaskTable = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = getColumns();
  const workspaceId = useWorkspaceId();
  const [filters, setFilters] = useTaskTableFilter();

  const { data, isLoading } = useQuery({
    queryKey: [
      'all-task',
      workspaceId,
      pageSize,
      pageNumber,
      filters,
      projectId,
    ],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        keyword: filters.keyword,
        priority: filters.priority,
        status: filters.status,
        projectId: projectId || filters.projectId,
        assignedTo: filters.assigneeId,
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
  });

  const tasks: Task[] = data?.tasks || [];
  const totalCount = data?.pagination.totalCount || 0;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className='w-full relative'>
      <DataTable
        isLoading={isLoading}
        data={tasks}
        columns={columns}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{ totalCount, pageNumber, pageSize }}
        filtersToolbar={
          <DataTableFilterToolbar
            isLoading={isLoading}
            projectId={projectId}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </div>
  );
};

const DataTableFilterToolbar = ({
  isLoading,
  projectId,
  filters,
  setFilters,
}: DataTableFilterToolbarProps) => {
  const workspaceId = useWorkspaceId();

  const { data } = useGetProjectsInWorkspace({ workspaceId });
  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = data?.projects || [];
  const members = memberData?.members || [];

  const projectOptions = getProjectOptions(projects);
  const assigneesOptions = getMemberOptions(members);

  const handleFilterChange = (key: keyof Filters, values: string[]) => {
    setFilters({
      ...filters,
      [key]: values.length > 0 ? values.join(',') : null,
    });
  };

  return (
    <div className='flex flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2  lg:space-y-0'>
      <Input
        placeholder='Filter tasks...'
        value={filters.keyword || ''}
        onChange={(e) =>
          setFilters({
            keyword: e.target.value,
          })
        }
        className='h-8 w-full lg:w-[250px]'
      />
      {/* Status filter */}
      <DataTableFacetedFilter
        title='Status'
        multiSelect={true}
        options={statuses}
        disabled={isLoading}
        selectedValues={filters.status?.split(',') || []}
        onFilterChange={(values) => handleFilterChange('status', values)}
      />

      {/* Priority filter */}
      <DataTableFacetedFilter
        title='Priority'
        multiSelect={true}
        options={priorities}
        disabled={isLoading}
        selectedValues={filters.priority?.split(',') || []}
        onFilterChange={(values) => handleFilterChange('priority', values)}
      />

      {/* Assigned To filter */}
      <DataTableFacetedFilter
        title='Assigned To'
        multiSelect={true}
        options={assigneesOptions}
        disabled={isLoading}
        selectedValues={filters.assigneeId?.split(',') || []}
        onFilterChange={(values) => handleFilterChange('assigneeId', values)}
      />

      {!projectId && (
        <DataTableFacetedFilter
          title='Projects'
          multiSelect={false}
          options={projectOptions}
          disabled={isLoading}
          selectedValues={filters.projectId?.split(',') || []}
          onFilterChange={(values) => handleFilterChange('projectId', values)}
        />
      )}

      {Object.values(filters).some(
        (value) => value !== null && value !== ''
      ) && (
        <Button
          disabled={isLoading}
          variant='ghost'
          className='h-8 px-2 lg:px-3'
          onClick={() =>
            setFilters({
              keyword: null,
              status: null,
              priority: null,
              projectId: null,
              assigneeId: null,
            })
          }
        >
          Reset
          <X className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
};
