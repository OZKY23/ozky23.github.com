const path = require("path");
const cheerio = require("cheerio"); // assuming this is the correct path
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	output: {
		filename: "./dist/bundle.js",
		path: path.resolve(__dirname),
	},
	devServer: {
		static: path.resolve(__dirname),
		port: 8080,
		hot: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
			templateParameters: async (compilation, assets, options) => {
				if (compilation.htmlWebpackPlugin === undefined) return {};
				const htmlFiles = await Promise.all(
					Object.entries(
						compilation.htmlWebpackPlugin.files.html
					).map(async ([filename, content]) => {
						const metaData = extractMetaData(content); // Extract meta data from the HTML content
						return { filename, metaData };
					})
				);

				return {
					metaData: htmlFiles.reduce(
						(acc, { metaData }) => ({ ...acc, ...metaData }),
						{}
					),
				};
			},
		}),
		new HtmlWebpackPlugin({
			template: "./src/projects.html",
			filename: "./projects.html",
		}),
		new MiniCssExtractPlugin({
			filename: "./dist/bundle.css",
		}),
		{
			apply: (compiler) => {
				compiler.hooks.done.tap("GenerateProjectsIndex", (stats) => {
					const projectsDirectory = path.resolve(
						__dirname,
						"projects"
					);
					const posts = [];
					console.log("\n INDEXING PROJECTS \n");

					// Read HTML files from the projects directory
					const htmlFiles = fs
						.readdirSync(projectsDirectory)
						.filter((file) => file.endsWith(".html"));

					htmlFiles.forEach((file) => {
						console.log(
							">>> PROJECT:",
							file.replace(".html", "").replaceAll("_", " "),
							"\n"
						);
						const relativePath = path.join("projects", file);
						const metaData =
							extractMetaDataFromHtmlFile(relativePath);
						posts.push({
							url: `/${relativePath}`,
							metaData,
						});
					});

					fs.writeFileSync(
						path.join(projectsDirectory, "index.json"),
						JSON.stringify(posts, null, 2)
					);
				});
			},
		},
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
		],
	},
};

function extractMetaData(htmlContent) {
	const $ = cheerio.load(htmlContent);
	const metaTags = $("meta");

	const metaData = { title: $("title").text() };
	metaTags.each((index, element) => {
		const name = $(element).attr("name");
		const content = $(element).attr("content");
		if (name && content && name !== "viewport") {
			metaData[name] = content;
		}
	});

	return metaData;
}

function extractMetaDataFromHtmlFile(filePath) {
	const htmlContent = fs.readFileSync(filePath, "utf8");
	return extractMetaData(htmlContent);
}
