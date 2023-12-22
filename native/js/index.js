export default function (runtime) {
    runtime.afterRegistered(["Oak.Program"], () => {
        runtime.register("Oak.Time", {
            "after": (_delay) => {
                return runtime.scope("Oak.Program").newTask((success, _) => {
                    setTimeout(() => {
                        success(runtime.float(Date.now() / 1000.0));
                    }, runtime.unwrap(_delay).$values[0]);
                });
            },
            "atEndOfFrame": runtime.scope("Oak.Program").newTask((success, _) => {
                requestAnimationFrame((time) => {
                    success(runtime.float(time / 1000.0));
                });
            }),
        }, ["Oak.Program"]);
    });
}
