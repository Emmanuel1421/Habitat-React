// Tipos que espelham exatamente os DTOs, enums e formato de paginação do backend.
// Mantidos separados de `types/index.ts` (que são os tipos "de UI" já usados
// pelas telas) para deixar claro o que vem literalmente da API.

export type UserRoleApi = 'ADMINISTRATOR' | 'COORDINATOR' | 'INTERN';

export type ProcessStatusApi =
  | 'INITIAL'
  | 'CITATION'
  | 'INSTRUCTION'
  | 'JUDGMENT'
  | 'APPEAL'
  | 'EXECUTION'
  | 'CLOSED'
  | 'ARCHIVED';

export type CitationStatusApi = 'PENDING' | 'CITED' | 'NOT_FOUND' | 'REFUSED' | 'NOTICE';

export type DocumentTypeApi = 'POWER_OF_ATTORNEY' | 'DECLARATION_OF_INSUFFICIENCY_OF_RESOURCES';

export type DocumentFormatApi = 'PDF' | 'DOCX';

// ---------- Auth / Users ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRoleApi;
  coordinatorName: string;
  status: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRoleApi;
  coordinatorId?: number | null;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  coordinatorId?: number | null;
  status?: boolean;
}

// ---------- Associates ----------

export interface AssociateResponse {
  id: number;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  caseReport?: string;
  legalGuidance?: string;
  attendanceStatus: string;
  attendanceType: string;
  coordinatorId?: number | null;
  internId: number;
  internName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssociateRequest {
  name: string;
  cpf: string;
  address: string;
  phone: string;
  caseReport?: string | null;
  legalGuidance?: string | null;
  attendanceStatus?: string | null;
  attendanceType?: string | null;
  coordinatorId?: number | null;
  internId?: number | null;
}

export interface CaseHistoryEntry {
  id: number;
  action: string;
  userName: string;
  createdAt: string;
}

// ---------- Processes ----------

export interface ProcessResponse {
  id: number;
  processNumber: string;
  city: string;
  court: string;
  description?: string;
  currentStatus: ProcessStatusApi;
  associateId: number;
  associateName: string;
  internId: number;
  internName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessRequest {
  processNumber: string;
  city: string;
  court: string;
  description?: string;
  status: ProcessStatusApi;
  associateId: number;
}

// ---------- Consultations (usado como "anotações" no front) ----------

export interface ConsultationResponse {
  id: number;
  summary: string;
  date: string;
  internId: number;
  internName: string;
  associateId: number;
  associateName: string;
  createdAt: string;
}

export interface ConsultationRequest {
  summary: string;
  date: string;
  associateId: number;
}

// ---------- Conciliations ----------

export interface ConciliationResponse {
  id: number;
  oppositePartyName: string;
  oppositePartyContact?: string;
  audienceDateTime?: string;
  summary?: string;
  citationStatus: CitationStatusApi;
  associateId: number;
  associateName: string;
  internId: number;
  internName: string;
  createdAt: string;
}

export interface ConciliationRequest {
  oppositePartyName: string;
  oppositePartyContact?: string;
  audienceDateTime?: string;
  summary?: string;
  citationStatus: CitationStatusApi;
  associateId: number;
}

// ---------- Documents / Files ----------

export interface GenerateDocumentRequest {
  type: DocumentTypeApi;
  format: DocumentFormatApi;
  associateId: number;
  coordinatorId?: number | null;
}

export interface FileAttachmentResponse {
  id: number;
  fileName: string;
  contentType: string;
  referenceId?: string;
}

// ---------- Paginação (Spring Data, PageSerializationMode.VIA_DTO) ----------
// Formato: { content: [...], page: { size, number, totalElements, totalPages } }

export interface ApiPage<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  message: string;
  error: number;
  timestamp: string;
}
