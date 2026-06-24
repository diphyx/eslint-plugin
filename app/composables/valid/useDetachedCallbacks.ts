// Regression guard for #6: raw browser APIs used inside detached callbacks of a
// composable (event handlers, timers, promise continuations) run after the
// synchronous setup/composable body, when no effect scope is active. VueUse's
// scope-bound cleanup can't register there, so these must NOT be flagged.
export const useRealtime = (options: { path: string; heartbeat: number }) => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const connect = () => {
        const socket = new WebSocket(options.path);

        socket.onopen = () => {
            // detached: fires on the open event, not during the composable body
            timer = setInterval(() => {
                socket.send("ping");
            }, options.heartbeat);
        };

        socket.onclose = () => {
            if (timer) {
                clearInterval(timer);
            }
        };

        return socket;
    };

    const load = () => {
        return fetch(options.path).then(() => {
            // detached: runs in a microtask after the promise settles
            const theme = localStorage.getItem("theme");

            window.addEventListener("resize", () => {});

            return theme;
        });
    };

    return { connect, load };
};
