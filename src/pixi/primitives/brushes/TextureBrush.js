/**
 * A Brush that uses a texture for filling or outlining a shape.
 *
 * @class
 * @extends Brush
 * @param texture {Texture} The texture of the brush
 * @param transformMatrix {Matrix} The transformation matrix of the brush
 * @param repeat {bool} Whether the texture should be repeated or not
 * @memberof PIXI
 */
PIXI.TextureBrush = function (texture, transformMatrix, repeat)
{
    PIXI.Brush.call(this, 0xFFFFFF, 1);

    /**
     * @member texture {Texture} The texture of the brush
     */
    this.texture = texture;

    /**
     * @member transformMatrix {Matrix} The transformation matrix of the brush
     */
    this.transformMatrix = transformMatrix || PIXI.identityMatrix;

    /**
     * @member repeat {bool} Whether the texture should be repeated or not
     */
    this.repeat = (repeat === undefined) ? true : repeat;

    /**
     * @member {CanvasPattern} the value that can be assigned to a context.fillStyle of StrokeStyle
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

};

PIXI.TextureBrush.prototype = Object.create(PIXI.Brush.prototype);
PIXI.TextureBrush.prototype.constructor = PIXI.TextureBrush;

/**
 * Returns the value that can be assigned to a context.fillStyle of StrokeStyle
 *
 * @return {CanvasPattern}
 */
PIXI.TextureBrush.prototype.getCanvasBrush = function (context)
{
    if (this.tint !== this._prevTint || this._canvasBrush === null)
    {
        if (this.texture.baseTexture.hasLoaded)
        {
            this._prevTint = this.tint;

            var texture = (this.tint === 0xFFFFFF) ? this.texture.baseTexture.source : PIXI.CanvasTinter.getTintedTexture({texture: this.texture}, this.tint);

            this._canvasBrush = context.createPattern(texture, this.repeat ? 'repeat' : 'no-repeat');
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
PIXI.TextureBrush.prototype.fillCanvas = function (context, worldAlpha)
{
    if (this.transformMatrix !== PIXI.identityMatrix)
    {
        context.save();
        context.transform(
            this.transformMatrix.a, this.transformMatrix.b, this.transformMatrix.c,
            this.transformMatrix.d, this.transformMatrix.tx, this.transformMatrix.ty
        );
    }

    context.globalAlpha = worldAlpha;
    context.fillStyle = this.getCanvasBrush(context);
    context.fill();

    if (this.transformMatrix !== PIXI.identityMatrix)
    {
        context.restore();
    }
};


/**
 * Sets the brush as a stroke style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
PIXI.TextureBrush.prototype.strokeCanvas = function (context, worldAlpha)
{
    if (this.transformMatrix !== PIXI.identityMatrix)
    {
        context.save();
        context.transform(
            this.transformMatrix.a, this.transformMatrix.b, this.transformMatrix.c,
            this.transformMatrix.d, this.transformMatrix.tx, this.transformMatrix.ty
        );
    }

    context.globalAlpha = worldAlpha;
    context.strokeStyle = this.getCanvasBrush(context);
    context.stroke();

    if (this.transformMatrix !== PIXI.identityMatrix)
    {
        context.restore();
    }
};