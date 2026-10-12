import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  CornerDownRight,
  Sparkles,
  Layers,
  Calendar,
  Filter
} from 'lucide-react';
import { Department, DepartmentFeedback } from '../types';
import { initialDepartmentFeedbacks, departmentKeyExecutives } from '../data';

interface DepartmentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
  departmentName: string;
  onFeedbackSubmitted?: (newFeedback: DepartmentFeedback) => void;
}

export default function DepartmentFeedbackModal({
  isOpen,
  onClose,
  department,
  departmentName,
  onFeedbackSubmitted
}: DepartmentFeedbackModalProps) {
  const [feedbacks, setFeedbacks] = useState<DepartmentFeedback[]>(() => {
    const saved = localStorage.getItem('ccc_department_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialDepartmentFeedbacks;
      }
    }
    return initialDepartmentFeedbacks;
  });

  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Form states
  const [senderRole, setSenderRole] = useState<'Chairman' | 'Secretary' | 'Treasurer' | 'Unit Officer'>('Secretary');
  const [senderName, setSenderName] = useState('');
  const [category, setCategory] = useState<DepartmentFeedback['category']>('Operational Report');
  const [priority, setPriority] = useState<DepartmentFeedback['priority']>('Important');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [kpiMetrics, setKpiMetrics] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-fill executive name if available from session or credentials
  useEffect(() => {
    // Check if there is an active session
    const savedSessionStr = localStorage.getItem('ccc_auth_session');
    if (savedSessionStr) {
      try {
        const session = JSON.parse(savedSessionStr);
        if (session.department === department && session.officerName) {
          setSenderName(session.officerName);
          return;
        }
      } catch {
        // Continue
      }
    }

    const creds = departmentKeyExecutives[department];
    if (creds && creds.length > 0) {
      const match = creds.find(c => c.role === senderRole);
      if (match) {
        setSenderName(match.name);
      } else {
        setSenderName(creds[0].name);
      }
    }
  }, [department, senderRole]);

  // Filter feedback for this department
  const departmentFeedbacks = feedbacks.filter(f => f.department === department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!subject.trim() || !details.trim()) {
      setValidationError('Please fill out both the subject and report details for the Church Secretary.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newFeedback: DepartmentFeedback = {
      id: `FDB-${Date.now()}`,
      department,
      departmentName,
      senderName: senderName.trim() || `${senderRole} (${departmentName})`,
      senderRole,
      category,
      priority,
      subject: subject.trim(),
      details: details.trim(),
      dateSubmitted: formattedDate,
      status: 'Pending Review',
      kpiMetricsSummary: kpiMetrics.trim() || undefined
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('ccc_department_feedbacks', JSON.stringify(updated));

    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(newFeedback);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('history');
      setSubject('');
      setDetails('');
      setKpiMetrics('');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-celestial-gray-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MessageSquare className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  Secretariat Monitoring Bridge
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Feedback Channel
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Send Feedback to Church Secretary
              </h2>
              <p className="text-xs text-blue-100">
                Department: <span className="font-semibold text-white">{departmentName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-celestial-gray-200 bg-celestial-offwhite px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'compose'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-celestial-gray-500 hover:text-celestial-gray-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose New Feedback / Report</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-celestial-gray-500 hover:text-celestial-gray-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Transmitted Feedback History ({departmentFeedbacks.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'compose' ? (
            <div>
              {isSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Feedback transmitted successfully to Church Secretary & Main Dashboard! Switching to history...</span>
                </div>
              )}

              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold">{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200/70 p-3 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <p className="font-semibold flex items-center gap-1.5 mb-1 text-blue-950">
                    <Shield className="w-4 h-4 text-blue-700" />
                    Direct Link to Parochial Secretariat Central Dashboard
                  </p>
                  This report will be received immediately by Church Secretary Evang. Olusegun Faleti on the Cathedral Main Monitoring Console for evaluation, directive replies, or parish council intervention.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                      Sender Executive Role
                    </label>
                    <select
                      value={senderRole}
                      onChange={(e) => setSenderRole(e.target.value as any)}
                      className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                    >
                      <option value="Secretary">Secretary (Reporting Officer)</option>
                      <option value="Chairman">Chairman (Department Head)</option>
                      <option value="Treasurer">Treasurer (Financial Officer)</option>
                      <option value="Unit Officer">Unit Operational Officer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                      Sender Officer Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Sis. Grace Awolowo"
                      className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                      Feedback Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                    >
                      <option value="Operational Report">Operational Report</option>
                      <option value="Logistics & Requisition">Logistics & Requisition</option>
                      <option value="Urgent Alert">Urgent Alert</option>
                      <option value="Welfare & Pastoral">Welfare & Pastoral</option>
                      <option value="Event Summary">Event Summary</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                    >
                      <option value="Routine">Routine Notice</option>
                      <option value="Important">Important (Action Needed)</option>
                      <option value="Urgent">Urgent (Immediate Attention)</option>
                      <option value="Emergency">Emergency (Immediate Intervention)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                    Subject / Memo Heading
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Weekly rehearsal attendance report & equipment maintenance requisition"
                    className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                    Detailed Feedback / Observation / Requisition
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Provide full description of operations, challenges, requirements, or status updates for the Church Secretary..."
                    className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                    Key Performance Indicators / Attendance Summary (Optional)
                  </label>
                  <input
                    type="text"
                    value={kpiMetrics}
                    onChange={(e) => setKpiMetrics(e.target.value)}
                    placeholder="e.g. Sunday attendance: 64 members, 12 new converts, 3 rehearsals held"
                    className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Feedback to Church Secretary</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              {departmentFeedbacks.length === 0 ? (
                <div className="text-center py-12 text-celestial-gray-500 bg-celestial-offwhite rounded-xl border border-dashed border-celestial-gray-300">
                  <MessageSquare className="w-8 h-8 mx-auto text-celestial-gray-400 mb-2" />
                  <p className="text-sm font-semibold">No feedback transmitted yet from {departmentName}.</p>
                  <p className="text-xs text-celestial-gray-400 mt-1">Use the "Compose" tab to transmit your first operational feedback.</p>
                </div>
              ) : (
                departmentFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white border border-celestial-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-all space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          fb.priority === 'Emergency'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : fb.priority === 'Urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : fb.priority === 'Important'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {fb.priority}
                        </span>
                        <span className="text-[10px] font-medium text-celestial-gray-500 bg-celestial-offwhite px-2 py-0.5 rounded border border-celestial-gray-200">
                          {fb.category}
                        </span>
                        <span className="text-xs text-celestial-gray-400 font-mono">
                          {fb.dateSubmitted}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        fb.status === 'Resolved'
                          ? 'bg-green-100 text-green-800'
                          : fb.status === 'Action Taken'
                          ? 'bg-blue-100 text-blue-800'
                          : fb.status === 'Acknowledged'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-celestial-gray-100 text-celestial-gray-600'
                      }`}>
                        {fb.status === 'Action Taken' || fb.status === 'Resolved' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{fb.status}</span>
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-celestial-blue-900">
                      {fb.subject}
                    </h4>

                    <p className="text-xs text-celestial-gray-700 leading-relaxed font-sans">
                      {fb.details}
                    </p>

                    {fb.kpiMetricsSummary && (
                      <div className="bg-celestial-offwhite p-2 rounded-lg text-[11px] text-celestial-gray-600 font-mono">
                        📊 <span className="font-semibold text-celestial-gray-800">Operational Metrics:</span> {fb.kpiMetricsSummary}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-celestial-gray-100 text-[11px] text-celestial-gray-500">
                      <span>Submitted by: <strong className="text-celestial-gray-700">{fb.senderName}</strong> ({fb.senderRole})</span>
                    </div>

                    {/* Church Secretary Response / Directive */}
                    {fb.secretaryRemarks && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 text-xs text-amber-950">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                          <CornerDownRight className="w-4 h-4 text-amber-700" />
                          <span>Church Secretary Directive / Response</span>
                          {fb.reviewedAt && (
                            <span className="text-[10px] text-amber-700/80 font-normal ml-auto font-mono">
                              {fb.reviewedAt}
                            </span>
                          )}
                        </div>
                        <p className="text-amber-900 leading-relaxed font-medium">
                          {fb.secretaryRemarks}
                        </p>
                        {fb.reviewedBy && (
                          <p className="text-[10px] text-amber-700 font-semibold mt-1">
                            — {fb.reviewedBy}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-celestial-offwhite px-5 py-3 border-t border-celestial-gray-200 flex justify-between items-center text-xs text-celestial-gray-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CCC Ibara Cathedral • Parochial Secretariat Inter-Unit Bridge</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-celestial-gray-700 hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
