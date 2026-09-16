import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, Send } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import KudosCard from '../components/kudos/KudosCard';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';

const KudosFeedPage = () => {
  const { openGiveKudos } = useOutletContext();

  const [kudosList, setKudosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [search, setSearch] = useState('');

  const fetchFeed = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: 8
      });

      if (selectedDept) params.append('department', selectedDept);
      if (selectedTag) params.append('tag', selectedTag);
      if (search) params.append('search', search);

      const res = await api.get(`/kudos?${params.toString()}`);
      if (res.data.success) {
        if (append) {
          setKudosList((prev) => [...prev, ...res.data.kudos]);
        } else {
          setKudosList(res.data.kudos);
        }
        setHasMore(res.data.hasMore);
      }
    } catch (err) {
      // error handled
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedDept, selectedTag, search]);

  useEffect(() => {
    setPage(1);
    fetchFeed(1, false);
  }, [selectedDept, selectedTag, search, fetchFeed]);

  useEffect(() => {
    const handleCreated = () => {
      setPage(1);
      fetchFeed(1, false);
    };
    window.addEventListener('kudos:created', handleCreated);
    return () => window.removeEventListener('kudos:created', handleCreated);
  }, [fetchFeed]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(nextPage, true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Social Kudos Feed</h1>
          <p className="text-xs sm:text-sm text-slate-500">Celebrate wins, peer achievements, and company values</p>
        </div>
        <button
          onClick={openGiveKudos}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Give Kudos</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appreciation feed..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>

          {/* Value Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Value Tags</option>
            <option value="#Teamwork">#Teamwork</option>
            <option value="#CustomerObsession">#CustomerObsession</option>
            <option value="#Innovation">#Innovation</option>
          </select>

          {(selectedDept || selectedTag || search) && (
            <button
              onClick={() => {
                setSelectedDept('');
                setSelectedTag('');
                setSearch('');
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-xs font-medium"
              title="Clear filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : kudosList.length > 0 ? (
        <div className="space-y-4">
          {kudosList.map((kudos) => (
            <KudosCard key={kudos._id} kudos={kudos} />
          ))}

          {/* Infinite Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-sm transition-all"
              >
                {loadingMore ? 'Loading more...' : 'Load More Feed Activity'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No kudos posts matched your filters"
          description="Try clearing your search or department filter to see more recognitions."
          actionText="Give Kudos"
          onAction={openGiveKudos}
        />
      )}
    </div>
  );
};

export default KudosFeedPage;
