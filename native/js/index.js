export default function (runtime) {
    function toPosix(time) {
        return runtime.optionShallow("Oak.Time.Posix", "Millis", [runtime.float(time / 1000.0)]);
    }

    runtime.afterRegistered(["Oak.Program"], () => {
        runtime.register("Oak.Time", {
            "after": (_delay) => {
                return runtime.scope("Oak.Program").newTask((success, _) => {
                    setTimeout(() => {
                        success(toPosix(Date.now()));
                    }, runtime.unwrap(_delay).$values[0]);
                });
            },
            "atEndOfFrame": runtime.scope("Oak.Program").newTask((success, _) => {
                requestAnimationFrame((time) => {
                    success(toPosix(time));
                });
            }),
            "every": (_delay, _toMsg) => {
                return runtime.scope("Oak.Program").newSub("Oak.Time.every", [_delay], _toMsg, (args, post) => {
                    const interval = setInterval(() => {
                        post(toPosix(Date.now()));
                    }, runtime.unwrap(_delay).$values[0]);
                    return () => {
                        clearInterval(interval);
                    }
                });
            },
        }, ["Oak.Program"]);
    });
}
