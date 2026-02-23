export type Action<input = undefined, output = undefined> = (
  input: input
) => Promise<{
  data?: output;
  message?: string;
  ok: boolean;
}>;
