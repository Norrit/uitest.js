describe('loadSensor', function() {
    var loadSensorModule, readyModule, globalModule, config, injectorModule, otherCallback, sensorInstance;
    beforeEach(function() {
        otherCallback = jasmine.createSpy('someOtherCallback');
        readyModule = {
            addSensor: jasmine.createSpy('addSensor'),
            ready: jasmine.createSpy('ready')
        };
        config = {
            appends: [otherCallback]
        };
        var modules = uitest.require({
            "run/ready": readyModule,
            "run/config": config
        }, ["run/loadSensor", "injector"]);
        loadSensorModule = modules["run/loadSensor"];
        sensorInstance = loadSensorModule.sensor;
        injectorModule = modules.injector;
    });

    it('should register the sensor at the ready module', function() {
        expect(readyModule.addSensor).toHaveBeenCalledWith('load', sensorInstance);
    });
    it('should add itself after all other config.appends', function() {
        expect(config.appends.length).toBe(2);
        expect(config.appends[0]).toBe(otherCallback);
    });

    describe('reloaded', function() {
        it('should increment the loadSensor.count and set loadSensor.ready to false', function() {
            loadSensorModule.reloaded();
            expect(sensorInstance().count).toBe(1);
            expect(sensorInstance().ready).toBe(false);
        });
        it('should forward the callback to readyModule.ready', function() {
            var someCallback = jasmine.createSpy('callback');
            loadSensorModule.reloaded(someCallback);
            expect(readyModule.ready).toHaveBeenCalledWith(someCallback);
        });
    });

    describe('loadSensor', function() {
        it('should be waiting initially', function() {
            expect(sensorInstance()).toEqual({
                count: 0,
                ready: false
            });
        });
        it('should wait for the append function to be called and document.readyState==="complete"', function() {
            var doc = {
                readyState: ''
            };
            injectorModule.inject(config.appends[config.appends.length-1], null, [{
                document: doc
            }]);
            expect(sensorInstance()).toEqual({
                count: 0,
                ready: false
            });
            doc.readyState = 'complete';
            expect(sensorInstance()).toEqual({
                count: 0,
                ready: true
            });
        });
    });
});