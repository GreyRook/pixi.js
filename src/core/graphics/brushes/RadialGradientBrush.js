var Brush = require('./Brush');

/**
 * A brush for creating radial gradient fills and borders
 *
 * @class
 * @extends Brush
 * @param colors {number[]} An array of color values. For example, [0xFF0000,0x0000FF] would define a gradient drawing from red to blue
 * @param alphas {Number[]} An array of alpha values which correspond to the colors
 * @param ratios {Number[]} An array of gradient positions which correspond to the colors
 * For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%
 * @param x0 {Number}  The x axis of the coordinate of the start point
 * @param y0 {Number}  The y axis of the coordinate of the start point
 * @param r0 {Number}  The radius of the start circle.
 * @param x1 {Number}  The x axis of the coordinate of the end point
 * @param y1 {Number}  The y axis of the coordinate of the end point
 * @param r1 {Number}  The radius of the end circle
 * @memberof PIXI
 */
function RadialGradientBrush(colors, alphas, ratios, x0, y0, r0, x1, y1, r1)
{
    Brush.call(this, 0xFFFFFF, 1);

    /**
     * @member {number[]} An array of color values.
     */
    this.colors = colors;

    /**
     * @member {number[]}  An array of alpha values
     */
    this.alphas = alphas;

    /**
     * @member {number[]} An array of gradient positions which correspond to the colors
     */
    this.ratios = ratios;

    /**
     * @member {number} The x axis of the coordinate of the start point
     */
    this.x0 = x0;

    /**
     * @member {number} The y axis of the coordinate of the start point
     */
    this.y0 = y0;

    /**
     * @member {number} The radius of the start circle
     */
    this.r0 = r0;

    /**
     * @member {number} The x axis of the coordinate of the end point
     */
    this.x1 = x1;

    /**
     * @member {number} The y axis of the coordinate of the end point
     */
    this.y1 = y1;

    /**
     * @member {number} The radius of the end circle
     */
    this.r1 = r1;

    /**
     * @member {CanvasGradient} the value that can be assigned to a context.fillStyle of StrokeStyle
     * @private
     */
    this._canvasBrush = null;

    /**
     * @member {number} the tint of the graphics. Will be assigned by CanvasGraphics
     */
    this.tint = 0xFFFFFF;

    /**
     * @member {number} the previous tint. Whent it !== tint, we need to regenerate _canvasBrush
     * @private
     */
    this._prevTint = 0xFFFFFF;
}

RadialGradientBrush.prototype = Object.create(Brush.prototype);
RadialGradientBrush.prototype.constructor = RadialGradientBrush;

/**
 * Returns the value that can be assigned to a context.fillStyle of StrokeStyle
 *
 * @return {CanvasGradient}
 */
RadialGradientBrush.prototype.getCanvasBrush = function (context)
{
    var color, r, g, b, colors, i;
    if (this.tint !== this._prevTint || this._canvasBrush === null)
    {
        this._prevTint = this.tint;
        if (this.tint === 0xFFFFFF)
        {
            colors = this.colors;
        }
        else
        {
            var tintR = (this.tint >> 16 & 0xFF) / 255,
                tintG = (this.tint >> 8 & 0xFF) / 255,
                tintB = (this.tint & 0xFF)/ 255;

            colors = [];
            for (i = 0; i < this.colors.length; i++)
            {
                color = this.colors[i];
                colors.push(
                    ((color >> 16 & 0xFF) / 255 * tintR*255 << 16)
                    + ((color >> 8 & 0xFF) / 255 * tintG*255 << 8)
                    +  (color & 0xFF) / 255 * tintB*255
                );

            }
        }

        this._canvasBrush = context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
        for (var i = 0; i < colors.length; i++)
        {
            color = colors[i];
            r = (color & 0xFF0000) >> 16;
            g = (color & 0x00FF00) >> 8;
            b = color & 0x0000FF;
            this._canvasBrush.addColorStop(this.ratios[i], 'rgba(' + r + ', ' + g + ', ' + b + ', ' + this.alphas[i].toFixed(3) + ')');
        }
    }
    return this._canvasBrush;
};

/**
 * Sets the brush as a fill style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
RadialGradientBrush.prototype.fillCanvas = function (context, worldAlpha) {
    context.globalAlpha = this.alpha * worldAlpha;
    context.fillStyle = this.getCanvasBrush(context);
    context.fill();
};


/**
 * Sets the brush as a stroke style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
RadialGradientBrush.prototype.strokeCanvas = function (context, worldAlpha) {
    context.globalAlpha = this.alpha * worldAlpha;
    context.strokeStyle = this.getCanvasBrush(context);
    context.stroke();
};



module.exports = RadialGradientBrush;