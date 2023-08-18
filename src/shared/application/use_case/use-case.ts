export interface ApplicationAction<Input, Output> {
  executeSignup?(input: Input): Output | Promise<Output>;
  findOne?(input: Input): Output | Promise<Output>;
  findAll?(input: Input): Promise<Output>;
}
