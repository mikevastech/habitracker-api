/**
 * Domain exceptions – application layer throws these; no Nest dependency.
 * Exception filter maps them to HTTP status.
 */
export const DomainErrorCode = {
  NotFound: 'NotFound',
  Forbidden: 'Forbidden',
  Validation: 'Validation',
  Conflict: 'Conflict',
  Unauthorized: 'Unauthorized',
  Internal: 'Internal',
} as const;

export type DomainErrorCodeType = (typeof DomainErrorCode)[keyof typeof DomainErrorCode];

export class DomainException extends Error {
  constructor(
    public readonly code: DomainErrorCodeType,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}

export class NotFoundDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('NotFound', message, details);
    this.name = 'NotFoundDomainError';
  }
}

export class ForbiddenDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('Forbidden', message, details);
    this.name = 'ForbiddenDomainError';
  }
}

export class ValidationDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('Validation', message, details);
    this.name = 'ValidationDomainError';
  }
}

export class ConflictDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('Conflict', message, details);
    this.name = 'ConflictDomainError';
  }
}

export class UnauthorizedDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('Unauthorized', message, details);
    this.name = 'UnauthorizedDomainError';
  }
}

export class InternalDomainError extends DomainException {
  constructor(message: string, details?: unknown) {
    super('Internal', message, details);
    this.name = 'InternalDomainError';
  }
}
