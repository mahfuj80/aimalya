export class AdminAuditLogEntity {
  constructor(
    public readonly id: string,
    public readonly actorUserId: string,
    public readonly businessId: string | null,
    public readonly action: string,
    public readonly targetType: string | null,
    public readonly targetId: string | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly metadata: unknown,
    public readonly createdAt: Date,
  ) {}
}
