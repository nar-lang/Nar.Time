export default function (runtime) {
    function toPosix(time) {
        return runtime.optionShallow("Nar.Time.Posix", "Millis", [runtime.float(time / 1000.0)]);
    }

    runtime.afterRegistered(["Nar.Program"], () => {
        runtime.register("Nar.Time", {
            "after": (_delay) => {
                return runtime.scope("Nar.Program").newTask((success, _) => {
                    setTimeout(() => {
                        success(toPosix(Date.now()));
                    }, runtime.unwrap(_delay).$values[0]);
                });
            },
            "atEndOfFrame": runtime.scope("Nar.Program").newTask((success, _) => {
                requestAnimationFrame((time) => {
                    success(toPosix(time));
                });
            }),
            "every": (_delay, _toMsg) => {
                return runtime.scope("Nar.Program").newSub("Nar.Time.every", [_delay], _toMsg, (args, post) => {
                    const interval = setInterval(() => {
                        post(toPosix(Date.now()));
                    }, runtime.unwrap(_delay).$values[0]);
                    return () => {
                        clearInterval(interval);
                    }
                });
            },
        }, ["Nar.Program"]);
    });
}
