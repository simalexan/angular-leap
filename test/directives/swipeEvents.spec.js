describe("A swipe gesture directive", function () {
    // Test Values
    var directions = ["left", "right", "up", "down", "forward", "backward"],
        defaultEvent = {startPosition: [0, 0, 0], type: 'swipe'},
        testEventsFor = {
            left: [-1, 0, 0],
            right: [1, 0, 0],
            up: [0, 1, 0],
            down: [0, -1, 0],
            forward: [0, 0, 1],
            backward: [0, 0, -1]
        },
    // Leap Mock
        _Leap,
        _LeapController,
    // Services
        $rootScope,
        $compile;

    beforeEach(module("angular-leap"));

    // Add Leap Mock to globals
    beforeEach(inject(function ($window) {
        _LeapController = function () {
        };
        _LeapController.prototype.connect = function () {
        };
        _LeapController.prototype.on = function () {
        };
        _Leap = function () {
        };
        _Leap.Controller = _LeapController;

        $window.Leap = _Leap;
    }));


    // Inject needed services
    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));


    var direction = directions[0];

    //TODO: Write generic tesFOrDirection func to reduce redundant code
    angular.forEach(directions, function (direction) {

        describe("leap-swipe-"+direction, function () {

            it("should be executed and register gesture event listener", inject(function () {
                spyOn(_LeapController.prototype, "connect");
                spyOn(_LeapController.prototype, "on");

                var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
                var scope = $rootScope.$new();
                var element = $compile(html)(scope);

                expect(_LeapController.prototype.connect).toHaveBeenCalled();
                expect(_LeapController.prototype.on).toHaveBeenCalled();
                expect(_LeapController.prototype.on.calls[0].args[0]).toEqual("gesture");
            }));


            it("should be executed and register gesture event listener for " + direction, inject(function () {


                spyOn(_LeapController.prototype, "on");
                var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
                var scope = $rootScope.$new();
                var element = $compile(html)(scope);
                spyOn(scope, "$apply");
                // Simulate Swipe Event, execute function
                defaultEvent.position = testEventsFor[direction];
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);
                expect(scope.$apply).toHaveBeenCalled();
            }));

            it("should use the timeout function to prevent unwanted double event triggers for " + direction, inject(function ($timeout) {
                spyOn(_LeapController.prototype, "on");


                var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
                var scope = $rootScope.$new();
                var element = $compile(html)(scope);


                spyOn(scope, "$apply");
                // Simulate Swipe Event, execute function
                defaultEvent.position = testEventsFor[direction];
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);
                expect(scope.$apply.calls.length).toBe(1);

                $timeout.flush();

                _LeapController.prototype.on.calls[0].args[1](defaultEvent);
                expect(scope.$apply.calls.length).toBe(2);
            }));


            it("should execute expressions", inject(function () {
                spyOn(_LeapController.prototype, "on");

                var html = "<div leap-swipe-" + direction + "='test=test+1'></div>";
                var scope = $rootScope.$new();
                var element = $compile(html)(scope);

                scope.test = 1;

                defaultEvent.position = testEventsFor[direction];

                _LeapController.prototype.on.calls[0].args[1](defaultEvent);

                expect(scope.test).toBe(2);
            }));

            it("should execute scope function", inject(function () {
                var scope = $rootScope.$new();
                scope.testFunction = function () {
                };
                spyOn(scope, "testFunction");
                spyOn(_LeapController.prototype, "on");

                var html = "<div leap-swipe-" + direction + "='testFunction()'></div>";
                var element = $compile(html)(scope);

                defaultEvent.position = testEventsFor[direction];
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);

                expect(scope.testFunction).toHaveBeenCalled();
            }));


            it("should use defaultTimeout of not configured via attribute", inject(function ($browser, leapConfig) {
                spyOn($browser, "defer");
                spyOn(_LeapController.prototype, "on");
                var scope = $rootScope.$new();
                var html = "<div leap-swipe-" + direction + "='testFunction()'></div>";
                var element = $compile(html)(scope);

                defaultEvent.position = testEventsFor[direction];
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);

                expect($browser.defer.calls[0].args[1]).toBe(leapConfig.defaultTimeout);
            }));

            it("should use timeout if it configured", inject(function ($browser) {
                spyOn($browser, "defer");
                spyOn(_LeapController.prototype, "on");
                var scope = $rootScope.$new();
                var html = "<div leap-swipe-" + direction + "='testFunction()' leap-timeout='1000'></div>";
                var element = $compile(html)(scope);

                defaultEvent.position = testEventsFor[direction];
                _LeapController.prototype.on.calls[0].args[1](defaultEvent);

                expect($browser.defer.calls[0].args[1]).toBe('1000');
            }));

        });
    });


});