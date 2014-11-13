function loadImageTexture(ctx, url) {
	var texture = ctx.createTexture();
	$('<img src="{0}" />'.format(url)).load(function() {
		doLoadImageTexture(ctx, this, texture);
	});
	return texture;
}

function doLoadImageTexture(ctx, image, texture) {
	ctx.bindTexture(ctx.TEXTURE_2D, texture);
	ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
	ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
	ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
	ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
	ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
	//ctx.generateMipmap(ctx.TEXTURE_2D)
	ctx.bindTexture(ctx.TEXTURE_2D, null);
}