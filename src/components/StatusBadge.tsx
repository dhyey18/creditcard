interface StatusBadgeProps {
  status: 'approved' | 'rejected' | 'pending'
}

const config = {
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200' },
  pending:  { label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, cls } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${cls}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}
