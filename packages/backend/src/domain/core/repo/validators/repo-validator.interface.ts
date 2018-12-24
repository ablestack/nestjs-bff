export interface IRepoValidator<TD, TO> {
  validate(data: TD, options?: TO);
}
