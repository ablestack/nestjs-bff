export interface IValidator<TD, TO> {
  validate(data: TD, options?: TO);
}
