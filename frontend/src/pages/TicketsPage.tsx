import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Ticket as TicketIcon, RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  CreateTicketPayload,
  Ticket,
  TicketComment,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketUser,
} from '../types/ticket';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/api';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { TicketFormModal } from '../components/tickets/TicketFormModal';
import { TicketDetailModal } from '../components/tickets/TicketDetailModal';
import { Button } from '../components/ui/Button';

const initialMockTickets: Ticket[] = [
  {
    id: 't-101',
    ticketNumber: 'TCK-1001',
    title: 'Payment Gateway Timeout during High Traffic Checkout',
    description: `Customers are encountering HTTP 504 Gateway Timeout errors when attempting to complete checkout with credit cards.
    
Reproduction steps:
1. Add items to shopping cart exceeding $100.
2. Select Credit Card payment option.
3. Click 'Complete Order' - request hangs for 30s then times out.`,
    status: 'open',
    priority: 'urgent',
    category: 'Billing',
    assignee: { id: 'usr-2', name: 'Alex Morgan', email: 'alex@example.com', role: 'Senior Engineer' },
    reporter: { id: 'usr-5', name: 'Customer John Doe', email: 'john@acme.com' },
    createdAt: '2026-07-24',
    updatedAt: '2026-07-24',
    dueDate: '2026-07-25',
    tags: ['stripe', 'checkout', 'critical'],
    commentsCount: 3,
  },
  {
    id: 't-102',
    ticketNumber: 'TCK-1002',
    title: 'OAuth 2.0 Refresh Token Interceptor failing on 401 response',
    description: 'The refresh token loop triggers duplicate requests in axios interceptor when token expires after 1 hour.',
    status: 'in_progress',
    priority: 'high',
    category: 'Technical',
    assignee: { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Support Lead' },
    reporter: { id: 'usr-6', name: 'Developer Alice', email: 'alice@dev.com' },
    createdAt: '2026-07-23',
    updatedAt: '2026-07-24',
    dueDate: '2026-07-26',
    tags: ['oauth', 'auth', 'axios'],
    commentsCount: 2,
  },
  {
    id: 't-103',
    ticketNumber: 'TCK-1003',
    title: 'Request for SSO SAML integration support for Okta',
    description: 'Enterprise client requests SAML 2.0 SSO provisioning instructions and metadata XML files for Okta integration.',
    status: 'pending',
    priority: 'medium',
    category: 'Feature Request',
    assignee: { id: 'usr-3', name: 'Michael Chen', email: 'michael@example.com', role: 'DevOps' },
    reporter: { id: 'usr-7', name: 'IT Admin Bob', email: 'bob@enterprise.org' },
    createdAt: '2026-07-22',
    updatedAt: '2026-07-23',
    tags: ['sso', 'saml', 'okta'],
    commentsCount: 1,
  },
  {
    id: 't-104',
    ticketNumber: 'TCK-1004',
    title: 'UI glitch on mobile view layout when opening sidebar drawer',
    description: 'On iPhone Safari view, the sidebar navigation overlaps with top header buttons during rotation.',
    status: 'resolved',
    priority: 'low',
    category: 'Bug',
    assignee: { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Support Lead' },
    reporter: { id: 'usr-8', name: 'QA Tester Clara', email: 'clara@qa.com' },
    createdAt: '2026-07-20',
    updatedAt: '2026-07-21',
    tags: ['ui', 'mobile', 'responsive'],
    commentsCount: 4,
  },
  {
    id: 't-105',
    ticketNumber: 'TCK-1005',
    title: 'Security Vulnerability Patch Audit for Node.js dependencies',
    description: 'Automated vulnerability scanner flagged low-severity dependency warning in package.json.',
    status: 'closed',
    priority: 'low',
    category: 'Security',
    assignee: { id: 'usr-3', name: 'Michael Chen', email: 'michael@example.com', role: 'DevOps' },
    reporter: { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah@example.com' },
    createdAt: '2026-07-18',
    updatedAt: '2026-07-19',
    tags: ['security', 'audit', 'npm'],
    commentsCount: 2,
  },
];

const initialMockComments: Record<string, TicketComment[]> = {
  't-101': [
    {
      id: 'tc-1',
      ticketId: 't-101',
      author: { id: 'usr-5', name: 'Customer John Doe', email: 'john@acme.com' },
      content: 'We had 3 customers report failed checkout in the last 15 minutes. Please investigate urgently!',
      createdAt: '2026-07-24 09:15 AM',
      isInternal: false,
    },
    {
      id: 'tc-2',
      ticketId: 't-101',
      author: { id: 'usr-2', name: 'Alex Morgan', email: 'alex@example.com', role: 'Senior Engineer' },
      content: 'I am reviewing payment gateway logs right now. It seems Stripe API rate limit triggered on server endpoint.',
      createdAt: '2026-07-24 09:30 AM',
      isInternal: true,
    },
    {
      id: 'tc-3',
      ticketId: 't-101',
      author: { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Support Lead' },
      content: 'I updated the customer that our engineering team is actively patching the webhook timeout limits.',
      createdAt: '2026-07-24 09:45 AM',
      isInternal: false,
    },
  ],
};

export const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const currentStaffUser: TicketUser = useMemo(() => ({
    id: user?.id || 'usr-1',
    name: user?.name || user?.email?.split('@')[0] || 'Support Specialist',
    email: user?.email || 'agent@enterprise.com',
    role: user?.role || 'Support Lead',
  }), [user]);

  const [tickets, setTickets] = useState<Ticket[]>(initialMockTickets);
  const [commentsMap, setCommentsMap] = useState<Record<string, TicketComment[]>>(initialMockComments);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch tickets from API or fallback
  const loadTickets = useCallback(async () => {
    try {
      const response = await ticketService.getTickets({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response && response.tickets) {
        setTickets(response.tickets);
      }
    } catch {
      // Backend not mounted yet: client local filtering operates cleanly
    }
  }, [statusFilter, priorityFilter, categoryFilter, searchQuery, currentPage]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Client-side filtering & sorting for smooth UX
  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        let valA: string | number = a[sortBy as keyof Ticket] as string;
        let valB: string | number = b[sortBy as keyof Ticket] as string;

        if (sortBy === 'priority') {
          const priorityWeight: Record<TicketPriority, number> = { low: 1, medium: 2, high: 3, urgent: 4 };
          valA = priorityWeight[a.priority];
          valB = priorityWeight[b.priority];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTickets.length / itemsPerPage));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTickets.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTickets, currentPage, itemsPerPage]);

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleCreateOrUpdateTicket = async (payload: CreateTicketPayload | Partial<Ticket>) => {
    if (editingTicket) {
      // Edit mode
      try {
        await ticketService.updateTicket(editingTicket.id, payload);
      } catch {
        // Fallback local update
      }

      setTickets((prev) =>
        prev.map((t) =>
          t.id === editingTicket.id
            ? {
                ...t,
                ...payload,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : t
        )
      );

      if (selectedTicket && selectedTicket.id === editingTicket.id) {
        setSelectedTicket((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } else {
      // Create mode
      const newTicketNumber = `TCK-${1000 + tickets.length + 1}`;
      const newTicket: Ticket = {
        id: `t-${Date.now()}`,
        ticketNumber: newTicketNumber,
        title: (payload as CreateTicketPayload).title,
        description: (payload as CreateTicketPayload).description,
        status: 'open',
        priority: (payload as CreateTicketPayload).priority || 'medium',
        category: (payload as CreateTicketPayload).category || 'Technical',
        reporter: currentStaffUser,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        dueDate: (payload as CreateTicketPayload).dueDate,
        tags: (payload as CreateTicketPayload).tags || [],
        commentsCount: 0,
      };

      try {
        await ticketService.createTicket(payload as CreateTicketPayload);
      } catch {
        // Fallback local append
      }

      setTickets((prev) => [newTicket, ...prev]);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await ticketService.deleteTicket(id);
    } catch {
      // Fallback
    }

    setTickets((prev) => prev.filter((t) => t.id !== id));
    toast.success('Ticket deleted');
  };

  const handleUpdateStatus = async (id: string, newStatus: TicketStatus) => {
    try {
      await ticketService.updateTicket(id, { status: newStatus });
    } catch {
      // Fallback
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: 'Just now' } : t))
    );

    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: TicketPriority) => {
    try {
      await ticketService.updateTicket(id, { priority: newPriority });
    } catch {
      // Fallback
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );

    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, priority: newPriority } : null));
    }
  };

  const handleAddComment = async (content: string, isInternal: boolean) => {
    if (!selectedTicket) return;

    const newComment: TicketComment = {
      id: `tc-${Date.now()}`,
      ticketId: selectedTicket.id,
      author: currentStaffUser,
      content,
      createdAt: 'Just now',
      isInternal,
    };

    try {
      await ticketService.addComment(selectedTicket.id, content, isInternal);
    } catch {
      // Fallback
    }

    setCommentsMap((prev) => ({
      ...prev,
      [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newComment],
    }));

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, commentsCount: t.commentsCount + 1 } : t
      )
    );
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Ticket ID', 'Title', 'Status', 'Priority', 'Category', 'Assignee', 'Created At'],
      ...filteredAndSortedTickets.map((t) => [
        t.ticketNumber,
        `"${t.title.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.category,
        t.assignee ? t.assignee.name : 'Unassigned',
        t.createdAt,
      ]),
    ];

    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Ticket queue exported to CSV');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <TicketIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Support Ticket Management</h1>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Track, filter, assign, and resolve customer support inquiries with internal discussion logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingTicket(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-sm"
          >
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TicketFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        priorityFilter={priorityFilter}
        onPriorityChange={(p) => {
          setPriorityFilter(p);
          setCurrentPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(c) => {
          setCategoryFilter(c);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        totalResults={filteredAndSortedTickets.length}
      />

      {/* Ticket Table / Mobile Cards */}
      <TicketTable
        tickets={paginatedTickets}
        viewMode={viewMode}
        onViewTicket={(ticket) => {
          setSelectedTicket(ticket);
          setIsDetailModalOpen(true);
        }}
        onEditTicket={(ticket) => {
          setEditingTicket(ticket);
          setIsFormModalOpen(true);
        }}
        onDeleteTicket={handleDeleteTicket}
        onQuickStatusChange={handleUpdateStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Ticket Form Modal (Create / Edit) */}
      <TicketFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateOrUpdateTicket}
        initialTicket={editingTicket}
      />

      {/* Ticket Detail Drawer Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEditTicket={(ticket) => {
          setIsDetailModalOpen(false);
          setEditingTicket(ticket);
          setIsFormModalOpen(true);
        }}
        onDeleteTicket={handleDeleteTicket}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        comments={selectedTicket ? commentsMap[selectedTicket.id] || [] : []}
        onAddComment={handleAddComment}
      />
    </div>
  );
};
