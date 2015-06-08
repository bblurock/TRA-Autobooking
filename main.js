var casper = require('casper').create();

console.log('\nThis is a auto-booking system for Taiwan Railway. This project should not be used for any commercial usage. \n');

var mainUrl = 'http://railway.hinet.net/ctkind1.htm';

var randomAudioUrl = '';

casper.start(mainUrl);

casper.then(function() {
    casper.page.injectJs('./jquery-2.1.4.js');

    this.evaluate(function() {
        $('#person_id').val('B122380974');
        $('#from_station').val('146'); // From: Taichung 
        $('#to_station').val('098'); // To: SongShang
        $('#train_type').val('*1'); // Train Type
        $('#getin_date').val('2015/06/08-00');
        $('#getin_start_dtime').val('18:00');
        $('#getin_end_dtime').val('20:00');
    });

    this.captureSelector('output.png', 'body');
});

casper.thenEvaluate(function() {
    $('button').click();
});

casper.then(function() {
    casper.page.injectJs('./jquery-2.1.4.js');

    console.log('Invoke generating random number ... \n');

    this.evaluate(function() {
        try {
            playRandom();
        } catch (e) {
            return JSON.stringify(e);
        }
    });
});

casper.then(function() {
    console.log('Get audio url ... \n');
    randomAudioUrl = casper.evaluate(function() {

        $('.text_10p').text($('#nsRnSound').prop('src'));

        return $('.text_10p').text().toString();
    });
});

casper.then(function() {
    console.log('Random audio URL: ' + randomAudioUrl + '\n');

    this.download(randomAudioUrl, 'randomAudio.wav');

    this.captureSelector('redirect.png', 'body');
});

casper.then(function (){
    try {
        var spawn = require("child_process").spawn
        var execFile = require("child_process").execFile
        
        var child = spawn("afconvert -f 'WAVE' -d I16@16000 randomAudio.wav randomAudio16.wav")

        child.stdout.on("data", function(data) {
            console.log("spawnSTDOUT:", JSON.stringify(data))
        })

        child.stderr.on("data", function(data) {
            console.log("spawnSTDERR:", JSON.stringify(data))
        })

        child.on("exit", function(code) {
            console.log("spawnEXIT:", code)
        })

        //child.kill("SIGKILL")

        execFile("afconvert", ["-f 'WAVE'", "-d I16@16000", "randomAudio.wav", "randomAudio16.wav"], null, function(err, stdout, stderr) {
            console.log("execFileSTDOUT:", JSON.stringify(stdout))
            console.log("execFileSTDERR:", JSON.stringify(stderr))
        })

        // var childProcess = require('child_process'),
        // ls;
        // ls = childProcess.exec("afconvert -f 'WAVE' -d I16@16000 randomAudio.wav randomAudio16.wav", function(error, stdout, stderr) {
        //     if (error) {
        //         console.log(error.stack);
        //         console.log('Error code: ' + error.code);
        //         console.log('Signal received: ' + error.signal);
        //     }
        //     console.log('Child Process STDOUT: ' + stdout);
        //     console.log('Child Process STDERR: ' + stderr);
        // });

        // ls.on('exit', function(code) {
        //     console.log('Child process exited with exit code ' + code);
        // });

    } catch (e) {
        return JSON.stringify(e);
    }
});

casper.run(function() {
    this.exit();
});