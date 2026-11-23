import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Skeleton from '../components/atoms/Skeleton';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import EmptyState from '../components/molecules/EmptyState';
import ErrorState from '../components/molecules/ErrorState';
import PageHeader from '../components/molecules/PageHeader';
import Pagination from '../components/molecules/Pagination';
import EmployeeTable from '../components/organisms/EmployeeTable';
import { fetchEmployees, removeEmployee, selectAllEmployees } from '../store/employeesSlice';
import { DEPARTMENTS, STATUSES } from '../data/seed';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { errMsg, pluralize } from '../utils/format';

const PAGE_SIZE = 8;

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  joined: (a, b) => b.joinDate.localeCompare(a.joinDate),
  salary: (a, b) => b.salary - a.salary,
};

const selectClass =
  'h-11 rounded-xl border border-line-strong bg-card px-3 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

export default function Employees() {
  useDocumentTitle('Employees');
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { notify } = useToast();

  const employees = useSelector(selectAllEmployees);
  const status = useSelector((s) => s.employees.status);
  const error = useSelector((s) => s.employees.error);

  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All');
  const [state, setState] = useState('All');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return employees
      .filter((e) => department === 'All' || e.department === department)
      .filter((e) => state === 'All' || e.status === state)
      .filter((e) => !q || [e.name, e.email, e.id, e.jobTitle].some((v) => v.toLowerCase().includes(q)))
      .sort(SORTERS[sort]);
  }, [employees, debouncedQuery, department, state, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const onFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const requestDelete = useCallback((employee) => setToDelete(employee), []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(removeEmployee(toDelete.id)).unwrap();
      notify(`${toDelete.name} was removed.`);
      setToDelete(null);
    } catch (e) {
      notify(errMsg(e), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const loading = status === 'idle' || status === 'loading';
  const hasFilters = query || department !== 'All' || state !== 'All';

  return (
    <>
      <PageHeader
        title="Employees"
        description="Add people, update their roles and keep records current."
        actions={
          <Button as={Link} to="/employees/new" icon="plus">
            Add employee
          </Button>
        }
      />

      {status === 'failed' ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchEmployees())} />
      ) : (
        <Card padded={false}>
          <div role="search" className="flex flex-wrap gap-3 p-4 sm:p-5">
            <div className="relative min-w-[14rem] flex-1">
              <label htmlFor="employee-search" className="sr-only">
                Search employees by name, email, ID or role
              </label>
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="search" className="h-[18px] w-[18px]" />
              </span>
              <input
                id="employee-search"
                type="search"
                value={query}
                onChange={onFilter(setQuery)}
                placeholder="Search by name, email, ID or role"
                className="h-11 w-full rounded-xl border border-line-strong bg-card pl-10 pr-3 text-sm placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <label className="sr-only" htmlFor="filter-department">Filter by department</label>
            <select id="filter-department" value={department} onChange={onFilter(setDepartment)} className={selectClass}>
              <option value="All">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="filter-status">Filter by status</label>
            <select id="filter-status" value={state} onChange={onFilter(setState)} className={selectClass}>
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="sort-by">Sort by</label>
            <select id="sort-by" value={sort} onChange={onFilter(setSort)} className={selectClass}>
              <option value="name">Sort: Name</option>
              <option value="joined">Sort: Newest first</option>
              <option value="salary">Sort: Highest CTC</option>
            </select>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {loading ? 'Loading employees' : `${pluralize(filtered.length, 'employee')} found`}
          </p>

          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No employees match"
              description={hasFilters ? 'Try a different search or clear the filters.' : 'Add your first employee to get started.'}
              action={
                hasFilters ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('');
                      setDepartment('All');
                      setState('All');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button as={Link} to="/employees/new" icon="plus">
                    Add employee
                  </Button>
                )
              }
            />
          ) : (
            <>
              <EmployeeTable employees={visible} currentUserId={user.id} onDelete={requestDelete} />
              <Pagination page={currentPage} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Remove this employee?"
        message={toDelete ? `${toDelete.name} and their leave and attendance records will be permanently deleted. This can’t be undone.` : ''}
        confirmLabel="Remove employee"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
