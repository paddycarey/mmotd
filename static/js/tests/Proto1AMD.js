require.config({
    baseUrl: '../',
    paths: {
        'underscore': 'lib/underscore'
    }
});

require(
    [
        "tests/spec/Proto1"
    ],
    function(){
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };

        jasmineEnv.execute();

    }
);