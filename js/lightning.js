/* Lightning: procedural animated bolts - https://github.com/chaseleantj/js-lightning-effect */
class Lightning {
    constructor(args) {
        this.ctx = args.ctx; //the drawing context
        this.start = args.start ?? { x: 200, y: 0 }; //the coordinates of the start of the lightning bolt
        this.strength = args.strength ?? 10; //the intensity of the lightning bolt, recommended between [5, 15]
        this.slant = args.slant ?? 0; //the angle of the lightning bolt, 0 = downwards, Math.PI = upwards
        this.length = args.length ?? 1; //the length of each segment of a bolt, recommended [0.5, 1.5]
        this.minStrength = args.minStrength ?? 1; //the minimum strength of a bolt before disappearing, recommended [0.1, 2]
        this.mainBolt = args.mainBolt ?? true; //whether the lightning drawn is the "main" lighting bolt, main lightning bolts are thicker and have different properties
        this.mainBoltAnimate = args.mainBoltAnimate ?? false; //whether the main lightning bolt is drawn instantaneously
        this.animate = args.animate ?? true; //whether to draw the bolts slowly or instantaneously
        this.animationSpeed = args.animationSpeed ?? 0.4; //sets the speed of animation, value between [0, 1]
        this.branchFactor = args.branchFactor ?? 0; //affects the probability of branching, value between (-inf, inf)
        this.branchOff = args.branchOff ?? true; //whether the lightning bolt should branch
        this.showFlash = args.showFlash ?? false; //whether to show a flash of light when the lightning strikes
        this.color = args.color ?? "white"; //the stroke color of the lightning bolt
        this.glowColor = args.glowColor ?? "rgb(100, 200, 255)"; 
        this.bound = args.bound ? Object.assign({ top: -1000, right: 2000, bottom: 5000, left: -1000 }, args.bound) : { top: -1000, right: 2000, bottom: 5000, left: -1000 }; //the bounding box of the lightning
        this.iterations = 0;
        this.maxIterations = this.mainBolt ? Math.floor(10 + this.strength) * 10 : Math.floor(10 + this.strength) * 2;
        this.path = [this.start];

        this.extend = function () {
            if (this.strength < this.minStrength / 5 || this.iterations == this.maxIterations) return;

            var radius = (this.strength * (0.5 + Math.random()) + 5) * this.length;
            var angle = ((60 * Math.random() - 30)) * Math.PI / 180 + this.slant;
            var oldPoint = { x: this.path[this.iterations].x, y: this.path[this.iterations].y };
            var newPoint = this.generatePoint(oldPoint, radius, angle);

            this.path.push(newPoint);
            this.draw(oldPoint, newPoint);
            this.iterations++;
            var lightning = this;

            if (!this.branch(newPoint) || (oldPoint.x < this.bound.left || oldPoint.x > this.bound.right || oldPoint.y < this.bound.top || oldPoint.y > this.bound.bottom)) return;
            else if ((this.mainBolt && !this.mainBoltAnimate) || !this.animate) this.extend();
            else if (this.animationSpeed > Math.random()) this.extend();
            else requestAnimationFrame(function () { lightning.extend(); });
        }

        this.branch = function (newPoint) {
            if (!this.branchOff) return true;

            var slantOptions = [-0.4, -0.3, -0.2, 0.2, 0.3, 0.4];
            var branchSlant = slantOptions[Math.floor(Math.random() * slantOptions.length)];
            var newStrength = this.strength * (0.5 + Math.random() * 0.4);

            if (0.35 * (1 - Math.exp(- 0.15 * this.strength)) + 0.65 * Math.random() > 0.9 - 0.1 / (1 + Math.exp(-this.branchFactor))) {
                var newStrength = this.strength * (1.5 / (1 + Math.exp(-10 * Math.random())) - 0.75);
                new Lightning(Object.assign(args, { start: newPoint, strength: newStrength, slant: this.slant + branchSlant * 1.5, mainBolt: false, showFlash: false }))
                return true;
            }
            if (this.strength >= this.minStrength && !this.mainBolt && 0.5 * (1 - Math.exp(-0.1 * this.path.length)) + 0.35 * Math.random() + 0.15 * Math.min(1, 1 / this.strength) > 0.85 - 0.1 / (1 + Math.exp(-this.branchFactor))) {
                this.fork(newStrength, newPoint, branchSlant);
                return false;
            }
            if (this.strength >= this.minStrength * 2 && this.iterations == this.maxIterations) {
                this.fork(newStrength, newPoint, branchSlant);
                return false;
            }
            else return true;
        }

        this.fork = function (newStrength, newPoint, branchSlant) {
            new Lightning(Object.assign(args, { start: newPoint, strength: newStrength, slant: this.slant - branchSlant, mainBolt: false, showFlash: false }));
            new Lightning(Object.assign(args, { start: newPoint, strength: 0.75 * newStrength, slant: this.slant + branchSlant, mainBolt: false, showFlash: false }));
        }

        this.generatePoint = function (point, radius, angle) {
            var x_prime = - radius * Math.sin(angle);
            var y_prime = radius * Math.cos(angle);
            return { x: point.x + x_prime, y: point.y + y_prime };
        }

        this.draw = function (oldPoint, newPoint) {
            this.ctx.lineWidth = this.mainBolt ? this.strength * 1.5 : this.strength;
            this.ctx.shadowBlur = 25;
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = this.color;
            this.ctx.shadowColor = this.glowColor;
            this.ctx.beginPath();
            this.ctx.moveTo(oldPoint.x, oldPoint.y);
            this.ctx.lineTo(newPoint.x, newPoint.y);
            this.ctx.stroke();
        }

        this.flash = function () {
            var flashAlpha = 0.5 * (1 - Math.exp(-0.1 * this.strength));
            this.ctx.fillStyle = "rgba(255, 255, 255, alpha)".replace("alpha", flashAlpha);
            this.ctx.fillRect(0, 0, this.bound.right, this.bound.bottom);

            var gradient = this.ctx.createRadialGradient(this.start.x, this.start.y, 10, this.start.x, this.start.y, 1000);
            gradient.addColorStop(0, "rgba(255, 255, 255, alpha)".replace("alpha", flashAlpha));
            gradient.addColorStop(1, "transparent");

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.bound.right, this.bound.bottom);
        }

        this.extend();
        if (this.showFlash) this.flash();
        if (this.mainBolt) {
            var lightning = this;
            setTimeout(function () {
                for (var i = 1; i < lightning.path.length; i++) {
                    lightning.draw(lightning.path[i - 1], lightning.path[i]);
                }
            }, 50);
        }
    }
}

var fadeLightning = function (ctx, width = 2000, height = 5000) {
    requestAnimationFrame(function () { fadeLightning(ctx, width, height) });
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "black";
    ctx.shadowColor = "transparent"
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
}
