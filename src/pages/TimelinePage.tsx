import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getEvents } from '../services/timelineService';
import { RentalEvent } from '../types';
import { TimelineEvent } from '../components/timeline/TimelineEvent';
import { TimelineFilter } from '../components/timeline/TimelineFilter';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Clock } from 'lucide-react';

export default function TimelinePage() {
  const { agreement } = useAuth();
  const [events, setEvents] = useState<RentalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    async function fetchEvents() {
      if (!agreement?.id) return;
      setLoading(true);
      try {
        const data = await getEvents(agreement.id);
        // apply local filters
        let filtered = data;
        if (filters.type) {
          filtered = filtered.filter(e => e.event_type === filters.type);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || (e.description ?? '').toLowerCase().includes(s));
        }
        if (filters.startDate) {
          filtered = filtered.filter(e => new Date(e.created_at) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
          filtered = filtered.filter(e => new Date(e.created_at) <= new Date(filters.endDate));
        }
        setEvents(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [agreement, filters]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Rental Trust Timeline</h1>
        <p className="text-[#667085] mt-1">Every event, verified and timestamped.</p>
      </div>

      <TimelineFilter filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Clock size={48} />}
          title="No events found"
          description="Try adjusting your filters to see more events."
        />
      ) : (
        <div className="space-y-2 pl-4 md:pl-0">
          {events.map((event, index) => (
            <TimelineEvent key={event.id} event={event} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
