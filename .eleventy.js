const htmlmin = require("html-minifier");
const i18n = require("eleventy-i18n");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

const now = String(Date.now())
const en = require("./src/_data/i18n/en.json");
const es = require("./src/_data/i18n/es.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations: { es, en },
    fallbackLanguageTag: "es",
    keySeparator: "."
  });

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "es",
    filters: {
      url: "locale_url",
      links: "locale_links"
    },
    errorMode: "allow-fallback"
  });

  eleventyConfig.addWatchTarget("src/assets/css/tailwind.config.js")
  eleventyConfig.addWatchTarget("src//assets/css/tailwind.css")
  eleventyConfig.addWatchTarget("src/_data/i18n/")

  eleventyConfig.addPassthroughCopy({ "src/assets/img/*.{webp,svg}": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./assets/js/alpine.js",
  })

  eleventyConfig.addShortcode("version", function () {
    return now
  })

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })

	return {
    dir: {
      input: "src",
      output: "_site",
    }
	};
}
