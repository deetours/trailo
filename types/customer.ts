export interface CustomerNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  leadId?: string;
  preferences?: string;
  notes: CustomerNote[];
  createdAt: string;
  updatedAt: string;
}
