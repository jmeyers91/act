export default interface Action<Options, Result> {
  run(options: Options): Result;
  name: string;
  optionsSchema: { type: string };
  resultSchema: { type: string };
}
