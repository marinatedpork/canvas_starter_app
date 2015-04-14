// From https://github.com/webpack/react-starter
// MIT License Copyright (c) 2012-2015 Tobias Koppers

module.exports = [
	require("./webpack/make-webpack-config")({
		// commonsChunk: true,
		longTermCaching: true,
		separateStylesheet: true,
		minimize: true
		// devtool: "source-map"
	}),
	require("./webpack/make-webpack-config")({
		prerender: true
	})
];