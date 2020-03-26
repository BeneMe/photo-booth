
import ws from "rpi-ws281x-native";

class NeopixelCountdown {

	constructor() {
        this.countdown = 0;
        // Create my pixels
        this.pixels = new Uint32Array(24);

        
        this.config = {};

        // Number of leds in my strip
        this.config.leds = 24;
        this.config.spinnerColors = [0x420000, 0x320600, 0x201100, 0x151500, 0x112000, 0x051100, 0x000000];
        this.config.countdownColors = [0x008053, 0x008024, 0x008013, 0x2f8000, 0x4f8000, 0x738000, 0x806b00, 0x804b00, 0x803700 , 0x802200 , 0x801300 , 0x700000];

        // Configure ws281x
        ws.init(this.config.leds);


        // ---- trap the SIGINT and reset before exit
        process.on('SIGINT', function () {
            ws281x.reset();
            process.nextTick(function () { process.exit(0); });
        });

        this.offset = 0;
        this.clearLeds();
        this.startSpinner();
    }

    startCountdown(length) {
        // Render pixels to the Neopixel strip
        console.log('Neopixel filling countdown');
        this.pixels[0] = this.config.countdownColors[0];
        this.pixels[1] = this.config.countdownColors[0];
        this.pixels[2] = this.config.countdownColors[1];
        this.pixels[3] = this.config.countdownColors[1];
        this.pixels[4] = this.config.countdownColors[2];
        this.pixels[5] = this.config.countdownColors[2];
        this.pixels[6] = this.config.countdownColors[3];
        this.pixels[7] = this.config.countdownColors[3];
        this.pixels[8] = this.config.countdownColors[4];
        this.pixels[9] = this.config.countdownColors[4];
        this.pixels[10] = this.config.countdownColors[5];
        this.pixels[11] = this.config.countdownColors[5];
        this.pixels[12] = this.config.countdownColors[6];
        this.pixels[13] = this.config.countdownColors[6];
        this.pixels[14] = this.config.countdownColors[7];
        this.pixels[15] = this.config.countdownColors[7];
        this.pixels[16] = this.config.countdownColors[8];
        this.pixels[17] = this.config.countdownColors[8];
        this.pixels[18] = this.config.countdownColors[9];
        this.pixels[19] = this.config.countdownColors[9];
        this.pixels[20] = this.config.countdownColors[10];
        this.pixels[21] = this.config.countdownColors[10];
        this.pixels[22] = this.config.countdownColors[11];
        this.pixels[23] = this.config.countdownColors[11];
        ws.render(this.pixels);
        this.offset = 0;
        this.countdown = setInterval(this.updateCountdown.bind(this), (1000*length)/24 );
    }

    updateCountdown() {
        this.pixels[this.offset] = 0x000000;
        ws.render(this.pixels);
        if (this.offset > 23) {
            console.log('Neopixel countdown finished');
            this.stop();
        } else {
            this.offset++
        }
    }

    startSpinner() {
        this.offset = 0;
        this.spinner = setInterval(this.updateSpinner.bind(this), 100);
    }

    stop() {
        if(this.spinner) {
            clearInterval(this.spinner);
        }
        if(this.countdown) {
            clearInterval(this.countdown);
        }        
        this.pixels.fill(0x000000);
        ws.render(this.pixels);
    }

    clearLeds() {
        this.pixels.fill(0x000000);
        ws.render(this.pixels);
    }

    updateSpinner() {
        this.pixels[this.getRingPixelIndex(this.offset -6)] = this.config.spinnerColors[6];
        this.pixels[this.getRingPixelIndex(this.offset -5)] = this.config.spinnerColors[5];
        this.pixels[this.getRingPixelIndex(this.offset -4)] = this.config.spinnerColors[4];
        this.pixels[this.getRingPixelIndex(this.offset -3)] = this.config.spinnerColors[3];
        this.pixels[this.getRingPixelIndex(this.offset -2)] = this.config.spinnerColors[2];
        this.pixels[this.getRingPixelIndex(this.offset -1)] = this.config.spinnerColors[1];
        // Set a specific pixel
        this.pixels[this.offset] = this.config.spinnerColors[0];

        // Move on to next
        this.offset = (this.offset + 1) % this.config.leds;

        // Render to strip
        ws.render(this.pixels);

    }

    getRingPixelIndex(position) {
        if (position < 0 ) {
            return this.config.leds + position;
        } else if (position > this.config.leds - 1) {
            return position - this.config.leds;
        } else {
            return position;
        }
    }
}

export { NeopixelCountdown as default };
