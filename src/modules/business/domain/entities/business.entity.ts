export class BusinessEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly industry: string | null,
    public readonly description: string | null,
    public readonly timezone: string,
    public readonly currency: string,
    public readonly isActive: boolean,
    public readonly ownerUserId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
