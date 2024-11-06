export type Hold = {
  id: number;
  hold_type: string;
  impact: string;
  icon: string;
  action: string;
  created_at: string;
  due_date_at: string;
  description?: string;
  resolution?: string;
  status: "not_started" | "in_progress" | "completed";
  steps?: string[]; // New field for steps to clear the hold
  required_documents?: string[]; // New field for required documents
};
