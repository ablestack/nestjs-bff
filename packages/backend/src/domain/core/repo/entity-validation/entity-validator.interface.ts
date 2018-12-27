export interface IEntityValidator<TD, TO> {
  validate(data: TD, options?: TO);
}
