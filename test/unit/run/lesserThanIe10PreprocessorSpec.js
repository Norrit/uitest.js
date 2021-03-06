describe('run/lesserThanIe10Preprocessor', function() {
    var preprocessor, instrumentor, config, documentUtils, testframe;
    beforeEach(function() {
        config = {};
        testframe = {
            navigator: {
                appName: "Internet Explorer",
                appVersion: "8"
            }
        };
        instrumentor = {
            addPreprocessor: jasmine.createSpy('addPreprocessor'),
            createRemoteCallExpression: jasmine.createSpy('createRemoteCallExpression').andCallFake(function(cb) {
                var args = Array.prototype.slice.call(arguments, 1);
                return "##rc(" + args.join(",") + ");";
            })
        };
        var modules = uitest.require({
            "run/config": config,
            "run/instrumentor": instrumentor,
            "run/testframe": testframe
        }, ["run/lesserThanIe10Preprocessor", "documentUtils"]);
        preprocessor = modules["run/lesserThanIe10Preprocessor"];
        documentUtils = modules.documentUtils;
        spyOn(documentUtils, "loadAndEvalScriptSync");
    });

    it('should not nothing for other browsers', function() {
        testframe.navigator.appName = 'test';
        var html = preprocessor('<script src="someUrl" data="test"></script>');
        expect(html).toBe('<script src="someUrl" data="test"></script>');
    });

    it('should remove the src attribute from script tags, add an inline call and leave the other attributes ok', function() {
        var html = preprocessor('<script src="someUrl" data="test"></script>');
        expect(html).toBe('<script  data="test">##rc(window);</script>');
    });
    it('should load and eval the script using xhr on callback', function() {
        preprocessor('<script src="someUrl"></script>', {
            ieLt10: true
        });
        var win = {};
        instrumentor.createRemoteCallExpression.mostRecentCall.args[0](win);
        expect(documentUtils.loadAndEvalScriptSync).toHaveBeenCalledWith(win, "someUrl");
    });

});