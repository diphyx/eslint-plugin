// multiline-block-padding: a multi-line declaration must be followed by a blank
// line before the next statement.
const callError = await call({
    method: "POST",
    body: { force: payload.force },
});
if (callError) {
    throw callError;
}
