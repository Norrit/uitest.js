describe('requirejs', function() {
    var uit = uitest.current;
    uit.url("/test/ui/fixtures/requirejs.html");

    describe('append', function() {
        it('should exec append functions before the require callback', function() {
            var savedExecState;
            uit.append(function(execState) {
                savedExecState = {
                    state: execState
                };
            });
            uitest.runs(function(execState) {
                expect(savedExecState.state).toBe("end");
                expect(execState).toBe("loaded");
            });
        });
        it('should load append scripts before the require callback', function() {
            uit.append("saveExecState.js");
            uitest.runs(function(savedExecState, execState) {
                expect(savedExecState.state).toBe("end");
                expect(execState).toBe("loaded");
            });
        });
    });

    describe('intercept', function() {
        it('should intercept private functions by name', function() {
            var savedData = {};
            uit.intercept({
                scriptUrl: "./sayHello.js",
                fnName: "sayHello",
                callback: function(userName, execState, $delegate) {
                    savedData.execState = execState;
                    savedData.$delegate = $delegate;
                    return "intercepted " + userName;
                }
            });
            uitest.runs(function(document) {
                var el = document.getElementById("greeting");
                expect(el.textContent).toBe("intercepted someUser");
                expect(savedData.execState).toBe('end');
            });
        });
    });    


});