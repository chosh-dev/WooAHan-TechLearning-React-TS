//! Webpack
//* webpack은 자바스크립트 모듈 번들러
// Node에서 실행되기 때문에 모듈 사용시에는 require() 사용
//  webpack.config.js의 config 객체를 export하고 webpack 받아서 실행시킴

//* webpack 설정 파일을 쪼개는 게 유지관리에 좋다.
// (ex) plugin,loader를 하나의 일만 하도록 짠다.

//* React + TS 웹팩 설정
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { TsconfigPathPlugin } = require("tsconfig-paths-webpack-plugin");

const config = {
  context: path.resolve(__dirname, "."),

  entry: {
    main: ["core-js", `./src/index.tsx`],
  },

  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },

  devtool: "source-map",

  devServer: {
    contentBase: path.resolve("./build"),
    hot: true,
    port: 9000,
  },

  resolve: {
    modules: [
      path.
      resolve(__dirname, "./src"),
      path.resolve(__dirname, "./node_modules"),
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      react: require.resolve("react"),
    },
    plugins: [
      new TsconfigPathPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.json"),
      }),
    ],
  },


  //! loader
  //* loader는 모듈안에 rules 배열안에 객체로 작성
  //* 미들웨어와 같은 역할을 한다고 생각하면 된다. 
  module: {
    rules: [
      {
        // 정규표현식으로 어떤 확장자인지 확인
        test: /\.(ts|js)x?$/,
        // 어떤 것을 포함시킬 것인지
        include: path.resolve("src"),
        // 어떤 것을 제외 시킬지
        exclude: /node_modules/,
        use: {
            // 위에서 찾은 설정 파일들을 babel loader로 보낸다.
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "./images/",
        },
      },
    ],
  },
  //! Plugin
  //* plugin은 loader가 끝나고 난 다음에 실행됨
  //* loader는 컨버팅이고 plugin 후처리
  //* loader 보다 복잡한 일을 하는데 안쪽에 있는 웹팩의 low-level의 기능을 사용할 수 있기 때문
  plugin: [
    new webpack.SourceMapDevToolPlugin({}),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env.Node_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  optimiazation: {
    minimmize: false,
  },
};

module.exports = config;


// 추천 링크
// https://joshua1988.github.io/webpack-guide/