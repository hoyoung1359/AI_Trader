"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/stocks/route";
exports.ids = ["app/api/stocks/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fstocks%2Froute&page=%2Fapi%2Fstocks%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstocks%2Froute.ts&appDir=C%3A%5CCoding%5CVirtual%20Trader%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CCoding%5CVirtual%20Trader&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fstocks%2Froute&page=%2Fapi%2Fstocks%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstocks%2Froute.ts&appDir=C%3A%5CCoding%5CVirtual%20Trader%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CCoding%5CVirtual%20Trader&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Coding_Virtual_Trader_src_app_api_stocks_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/stocks/route.ts */ \"(rsc)/./src/app/api/stocks/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/stocks/route\",\n        pathname: \"/api/stocks\",\n        filename: \"route\",\n        bundlePath: \"app/api/stocks/route\"\n    },\n    resolvedPagePath: \"C:\\\\Coding\\\\Virtual Trader\\\\src\\\\app\\\\api\\\\stocks\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Coding_Virtual_Trader_src_app_api_stocks_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/stocks/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZzdG9ja3MlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnN0b2NrcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnN0b2NrcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDQ29kaW5nJTVDVmlydHVhbCUyMFRyYWRlciU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q0NvZGluZyU1Q1ZpcnR1YWwlMjBUcmFkZXImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDVztBQUN4RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzZKOztBQUU3SiIsInNvdXJjZXMiOlsid2VicGFjazovL3N0b2NrLXRyYWRpbmctYXBwLz9kN2M2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXENvZGluZ1xcXFxWaXJ0dWFsIFRyYWRlclxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxzdG9ja3NcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3N0b2Nrcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3N0b2Nrc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc3RvY2tzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcQ29kaW5nXFxcXFZpcnR1YWwgVHJhZGVyXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXHN0b2Nrc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9zdG9ja3Mvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fstocks%2Froute&page=%2Fapi%2Fstocks%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstocks%2Froute.ts&appDir=C%3A%5CCoding%5CVirtual%20Trader%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CCoding%5CVirtual%20Trader&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/stocks/route.ts":
/*!*************************************!*\
  !*** ./src/app/api/stocks/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var _lib_supabase_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase-client */ \"(rsc)/./src/lib/supabase-client.ts\");\n/* harmony import */ var _lib_korea_investment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/korea-investment */ \"(rsc)/./src/lib/korea-investment.ts\");\n\n\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const query = searchParams.get(\"query\") || \"\";\n    try {\n        const { data: stocks, error } = await _lib_supabase_client__WEBPACK_IMPORTED_MODULE_1__.supabase.from(\"stock_master\").select(\"*\").ilike(\"name\", `%${query}%`).limit(20);\n        if (error) throw error;\n        const api = new _lib_korea_investment__WEBPACK_IMPORTED_MODULE_2__.KoreaInvestmentAPI();\n        const stocksWithPrices = await Promise.all(stocks.map(async (stock)=>{\n            try {\n                const price = await api.getStockPrice(stock.symbol);\n                return {\n                    ...stock,\n                    ...price\n                };\n            } catch (error) {\n                console.error(`Error fetching price for ${stock.symbol}:`, error);\n                return {\n                    ...stock,\n                    price: 0,\n                    change: 0\n                };\n            }\n        }));\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(stocksWithPrices);\n    } catch (error) {\n        console.error(\"Error fetching stocks:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Failed to fetch stocks\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9zdG9ja3Mvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEwQztBQUNNO0FBQ1c7QUFFcEQsZUFBZUcsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQzVDLE1BQU1DLFFBQVFILGFBQWFJLEdBQUcsQ0FBQyxZQUFZO0lBRTNDLElBQUk7UUFDRixNQUFNLEVBQUVDLE1BQU1DLE1BQU0sRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTVgsMERBQVFBLENBQzNDWSxJQUFJLENBQUMsZ0JBQ0xDLE1BQU0sQ0FBQyxLQUNQQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRVAsTUFBTSxDQUFDLENBQUMsRUFDMUJRLEtBQUssQ0FBQztRQUVULElBQUlKLE9BQU8sTUFBTUE7UUFFakIsTUFBTUssTUFBTSxJQUFJZixxRUFBa0JBO1FBQ2xDLE1BQU1nQixtQkFBbUIsTUFBTUMsUUFBUUMsR0FBRyxDQUN4Q1QsT0FBT1UsR0FBRyxDQUFDLE9BQU9DO1lBQ2hCLElBQUk7Z0JBQ0YsTUFBTUMsUUFBUSxNQUFNTixJQUFJTyxhQUFhLENBQUNGLE1BQU1HLE1BQU07Z0JBQ2xELE9BQU87b0JBQUUsR0FBR0gsS0FBSztvQkFBRSxHQUFHQyxLQUFLO2dCQUFDO1lBQzlCLEVBQUUsT0FBT1gsT0FBTztnQkFDZGMsUUFBUWQsS0FBSyxDQUFDLENBQUMseUJBQXlCLEVBQUVVLE1BQU1HLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRWI7Z0JBQzNELE9BQU87b0JBQUUsR0FBR1UsS0FBSztvQkFBRUMsT0FBTztvQkFBR0ksUUFBUTtnQkFBRTtZQUN6QztRQUNGO1FBR0YsT0FBTzNCLGtGQUFZQSxDQUFDNEIsSUFBSSxDQUFDVjtJQUMzQixFQUFFLE9BQU9OLE9BQU87UUFDZGMsUUFBUWQsS0FBSyxDQUFDLDBCQUEwQkE7UUFDeEMsT0FBT1osa0ZBQVlBLENBQUM0QixJQUFJLENBQUM7WUFBRWhCLE9BQU87UUFBeUIsR0FBRztZQUFFaUIsUUFBUTtRQUFJO0lBQzlFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdG9jay10cmFkaW5nLWFwcC8uL3NyYy9hcHAvYXBpL3N0b2Nrcy9yb3V0ZS50cz9lMzRiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5pbXBvcnQgeyBzdXBhYmFzZSB9IGZyb20gJ0AvbGliL3N1cGFiYXNlLWNsaWVudCdcclxuaW1wb3J0IHsgS29yZWFJbnZlc3RtZW50QVBJIH0gZnJvbSAnQC9saWIva29yZWEtaW52ZXN0bWVudCdcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKVxyXG4gIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoUGFyYW1zLmdldCgncXVlcnknKSB8fCAnJ1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBkYXRhOiBzdG9ja3MsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbSgnc3RvY2tfbWFzdGVyJylcclxuICAgICAgLnNlbGVjdCgnKicpXHJcbiAgICAgIC5pbGlrZSgnbmFtZScsIGAlJHtxdWVyeX0lYClcclxuICAgICAgLmxpbWl0KDIwKVxyXG5cclxuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3JcclxuXHJcbiAgICBjb25zdCBhcGkgPSBuZXcgS29yZWFJbnZlc3RtZW50QVBJKClcclxuICAgIGNvbnN0IHN0b2Nrc1dpdGhQcmljZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgc3RvY2tzLm1hcChhc3luYyAoc3RvY2spID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcHJpY2UgPSBhd2FpdCBhcGkuZ2V0U3RvY2tQcmljZShzdG9jay5zeW1ib2wpXHJcbiAgICAgICAgICByZXR1cm4geyAuLi5zdG9jaywgLi4ucHJpY2UgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyBwcmljZSBmb3IgJHtzdG9jay5zeW1ib2x9OmAsIGVycm9yKVxyXG4gICAgICAgICAgcmV0dXJuIHsgLi4uc3RvY2ssIHByaWNlOiAwLCBjaGFuZ2U6IDAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIClcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc3RvY2tzV2l0aFByaWNlcylcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgc3RvY2tzOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggc3RvY2tzJyB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZSIsIktvcmVhSW52ZXN0bWVudEFQSSIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJxdWVyeSIsImdldCIsImRhdGEiLCJzdG9ja3MiLCJlcnJvciIsImZyb20iLCJzZWxlY3QiLCJpbGlrZSIsImxpbWl0IiwiYXBpIiwic3RvY2tzV2l0aFByaWNlcyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJzdG9jayIsInByaWNlIiwiZ2V0U3RvY2tQcmljZSIsInN5bWJvbCIsImNvbnNvbGUiLCJjaGFuZ2UiLCJqc29uIiwic3RhdHVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/stocks/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/korea-investment.ts":
/*!*************************************!*\
  !*** ./src/lib/korea-investment.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   KoreaInvestmentAPI: () => (/* binding */ KoreaInvestmentAPI)\n/* harmony export */ });\nclass KoreaInvestmentAPI {\n    constructor(){\n        this.baseUrl = \"https://openapi.koreainvestment.com:9443\";\n        this.apiKey = process.env.KOREA_INVESTMENT_API_KEY;\n        this.apiSecret = process.env.KOREA_INVESTMENT_API_SECRET;\n        this.accessToken = null;\n        this.tokenExpiresAt = null;\n    }\n    async getAccessToken() {\n        try {\n            // 토큰이 있고 아직 유효한 경우\n            if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {\n                return this.accessToken;\n            }\n            const response = await fetch(`${this.baseUrl}/oauth2/tokenP`, {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    grant_type: \"client_credentials\",\n                    appkey: this.apiKey,\n                    appsecret: this.apiSecret\n                })\n            });\n            if (!response.ok) {\n                throw new Error(\"Failed to get access token\");\n            }\n            const data = await response.json();\n            this.accessToken = data.access_token;\n            this.tokenExpiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000) // 23시간\n            ;\n            return this.accessToken;\n        } catch (error) {\n            console.error(\"Error getting access token:\", error);\n            throw error;\n        }\n    }\n    async getStockPrice(symbol) {\n        try {\n            const token = await this.getAccessToken();\n            const response = await fetch(`${this.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${symbol}`, {\n                headers: {\n                    Authorization: `Bearer ${token}`,\n                    appkey: this.apiKey,\n                    appsecret: this.apiSecret,\n                    tr_id: \"FHKST01010100\"\n                }\n            });\n            if (!response.ok) {\n                throw new Error(\"Failed to fetch stock price\");\n            }\n            const data = await response.json();\n            return {\n                price: parseFloat(data.output.stck_prpr),\n                change: parseFloat(data.output.prdy_ctrt),\n                volume: parseInt(data.output.acml_vol),\n                high: parseFloat(data.output.high),\n                low: parseFloat(data.output.low)\n            };\n        } catch (error) {\n            console.error(\"Error fetching stock price:\", error);\n            throw error;\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2tvcmVhLWludmVzdG1lbnQudHMiLCJtYXBwaW5ncyI6Ijs7OztBQVVPLE1BQU1BO0lBT1hDLGFBQWM7UUFDWixJQUFJLENBQUNDLE9BQU8sR0FBRztRQUNmLElBQUksQ0FBQ0MsTUFBTSxHQUFHQyxRQUFRQyxHQUFHLENBQUNDLHdCQUF3QjtRQUNsRCxJQUFJLENBQUNDLFNBQVMsR0FBR0gsUUFBUUMsR0FBRyxDQUFDRywyQkFBMkI7UUFDeEQsSUFBSSxDQUFDQyxXQUFXLEdBQUc7UUFDbkIsSUFBSSxDQUFDQyxjQUFjLEdBQUc7SUFDeEI7SUFFQSxNQUFNQyxpQkFBa0M7UUFDdEMsSUFBSTtZQUNGLG1CQUFtQjtZQUNuQixJQUFJLElBQUksQ0FBQ0YsV0FBVyxJQUFJLElBQUksQ0FBQ0MsY0FBYyxJQUFJLElBQUksQ0FBQ0EsY0FBYyxHQUFHLElBQUlFLFFBQVE7Z0JBQy9FLE9BQU8sSUFBSSxDQUFDSCxXQUFXO1lBQ3pCO1lBRUEsTUFBTUksV0FBVyxNQUFNQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUNaLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDNURhLFFBQVE7Z0JBQ1JDLFNBQVM7b0JBQ1AsZ0JBQWdCO2dCQUNsQjtnQkFDQUMsTUFBTUMsS0FBS0MsU0FBUyxDQUFDO29CQUNuQkMsWUFBWTtvQkFDWkMsUUFBUSxJQUFJLENBQUNsQixNQUFNO29CQUNuQm1CLFdBQVcsSUFBSSxDQUFDZixTQUFTO2dCQUMzQjtZQUNGO1lBRUEsSUFBSSxDQUFDTSxTQUFTVSxFQUFFLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSUMsTUFBTTtZQUNsQjtZQUVBLE1BQU1DLE9BQU8sTUFBTVosU0FBU2EsSUFBSTtZQUNoQyxJQUFJLENBQUNqQixXQUFXLEdBQUdnQixLQUFLRSxZQUFZO1lBQ3BDLElBQUksQ0FBQ2pCLGNBQWMsR0FBRyxJQUFJRSxLQUFLQSxLQUFLZ0IsR0FBRyxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU0sT0FBTzs7WUFFeEUsT0FBTyxJQUFJLENBQUNuQixXQUFXO1FBQ3pCLEVBQUUsT0FBT29CLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLCtCQUErQkE7WUFDN0MsTUFBTUE7UUFDUjtJQUNGO0lBRUEsTUFBTUUsY0FBY0MsTUFBYyxFQUF1QjtRQUN2RCxJQUFJO1lBQ0YsTUFBTUMsUUFBUSxNQUFNLElBQUksQ0FBQ3RCLGNBQWM7WUFFdkMsTUFBTUUsV0FBVyxNQUFNQyxNQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDWixPQUFPLENBQUMseUZBQXlGLEVBQUU4QixPQUFPLENBQUMsRUFDbkg7Z0JBQ0VoQixTQUFTO29CQUNQa0IsZUFBZSxDQUFDLE9BQU8sRUFBRUQsTUFBTSxDQUFDO29CQUNoQ1osUUFBUSxJQUFJLENBQUNsQixNQUFNO29CQUNuQm1CLFdBQVcsSUFBSSxDQUFDZixTQUFTO29CQUN6QjRCLE9BQU87Z0JBQ1Q7WUFDRjtZQUdGLElBQUksQ0FBQ3RCLFNBQVNVLEVBQUUsRUFBRTtnQkFDaEIsTUFBTSxJQUFJQyxNQUFNO1lBQ2xCO1lBRUEsTUFBTUMsT0FBTyxNQUFNWixTQUFTYSxJQUFJO1lBRWhDLE9BQU87Z0JBQ0xVLE9BQU9DLFdBQVdaLEtBQUthLE1BQU0sQ0FBQ0MsU0FBUztnQkFDdkNDLFFBQVFILFdBQVdaLEtBQUthLE1BQU0sQ0FBQ0csU0FBUztnQkFDeENDLFFBQVFDLFNBQVNsQixLQUFLYSxNQUFNLENBQUNNLFFBQVE7Z0JBQ3JDQyxNQUFNUixXQUFXWixLQUFLYSxNQUFNLENBQUNPLElBQUk7Z0JBQ2pDQyxLQUFLVCxXQUFXWixLQUFLYSxNQUFNLENBQUNRLEdBQUc7WUFDakM7UUFDRixFQUFFLE9BQU9qQixPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQywrQkFBK0JBO1lBQzdDLE1BQU1BO1FBQ1I7SUFDRjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3RvY2stdHJhZGluZy1hcHAvLi9zcmMvbGliL2tvcmVhLWludmVzdG1lbnQudHM/MzhiMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlcnJvciB9IGZyb20gJ2NvbnNvbGUnXHJcblxyXG5pbnRlcmZhY2UgU3RvY2tQcmljZSB7XHJcbiAgcHJpY2U6IG51bWJlclxyXG4gIGNoYW5nZTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBoaWdoOiBudW1iZXJcclxuICBsb3c6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS29yZWFJbnZlc3RtZW50QVBJIHtcclxuICBwcml2YXRlIGJhc2VVcmw6IHN0cmluZ1xyXG4gIHByaXZhdGUgYXBpS2V5OiBzdHJpbmdcclxuICBwcml2YXRlIGFwaVNlY3JldDogc3RyaW5nXHJcbiAgcHJpdmF0ZSBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbFxyXG4gIHByaXZhdGUgdG9rZW5FeHBpcmVzQXQ6IERhdGUgfCBudWxsXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5iYXNlVXJsID0gXCJodHRwczovL29wZW5hcGkua29yZWFpbnZlc3RtZW50LmNvbTo5NDQzXCJcclxuICAgIHRoaXMuYXBpS2V5ID0gcHJvY2Vzcy5lbnYuS09SRUFfSU5WRVNUTUVOVF9BUElfS0VZIVxyXG4gICAgdGhpcy5hcGlTZWNyZXQgPSBwcm9jZXNzLmVudi5LT1JFQV9JTlZFU1RNRU5UX0FQSV9TRUNSRVQhXHJcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbFxyXG4gICAgdGhpcy50b2tlbkV4cGlyZXNBdCA9IG51bGxcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyDthqDtgbDsnbQg7J6I6rOgIOyVhOyngSDsnKDtmqjtlZwg6rK97JqwXHJcbiAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuICYmIHRoaXMudG9rZW5FeHBpcmVzQXQgJiYgdGhpcy50b2tlbkV4cGlyZXNBdCA+IG5ldyBEYXRlKCkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlblxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYmFzZVVybH0vb2F1dGgyL3Rva2VuUGAsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgZ3JhbnRfdHlwZTogJ2NsaWVudF9jcmVkZW50aWFscycsXHJcbiAgICAgICAgICBhcHBrZXk6IHRoaXMuYXBpS2V5LFxyXG4gICAgICAgICAgYXBwc2VjcmV0OiB0aGlzLmFwaVNlY3JldCxcclxuICAgICAgICB9KSxcclxuICAgICAgfSlcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBnZXQgYWNjZXNzIHRva2VuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gZGF0YS5hY2Nlc3NfdG9rZW5cclxuICAgICAgdGhpcy50b2tlbkV4cGlyZXNBdCA9IG5ldyBEYXRlKERhdGUubm93KCkgKyAyMyAqIDYwICogNjAgKiAxMDAwKSAvLyAyM+yLnOqwhFxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHRoaXMuYWNjZXNzVG9rZW5cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYWNjZXNzIHRva2VuOicsIGVycm9yKVxyXG4gICAgICB0aHJvdyBlcnJvclxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0U3RvY2tQcmljZShzeW1ib2w6IHN0cmluZyk6IFByb21pc2U8U3RvY2tQcmljZT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKClcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgYCR7dGhpcy5iYXNlVXJsfS91YXBpL2RvbWVzdGljLXN0b2NrL3YxL3F1b3RhdGlvbnMvaW5xdWlyZS1wcmljZT9GSURfQ09ORF9NUktUX0RJVl9DT0RFPUomRklEX0lOUFVUX0lTQ0Q9JHtzeW1ib2x9YCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxyXG4gICAgICAgICAgICBhcHBrZXk6IHRoaXMuYXBpS2V5LFxyXG4gICAgICAgICAgICBhcHBzZWNyZXQ6IHRoaXMuYXBpU2VjcmV0LFxyXG4gICAgICAgICAgICB0cl9pZDogXCJGSEtTVDAxMDEwMTAwXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIHN0b2NrIHByaWNlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBwcmljZTogcGFyc2VGbG9hdChkYXRhLm91dHB1dC5zdGNrX3BycHIpLCAgICAvLyDtmITsnqzqsIBcclxuICAgICAgICBjaGFuZ2U6IHBhcnNlRmxvYXQoZGF0YS5vdXRwdXQucHJkeV9jdHJ0KSwgICAvLyDsoITsnbzrjIDruYRcclxuICAgICAgICB2b2x1bWU6IHBhcnNlSW50KGRhdGEub3V0cHV0LmFjbWxfdm9sKSwgICAgICAvLyDqsbDrnpjrn4lcclxuICAgICAgICBoaWdoOiBwYXJzZUZsb2F0KGRhdGEub3V0cHV0LmhpZ2gpLCAgICAgICAgICAvLyDqs6DqsIBcclxuICAgICAgICBsb3c6IHBhcnNlRmxvYXQoZGF0YS5vdXRwdXQubG93KSwgICAgICAgICAgICAvLyDsoIDqsIBcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgc3RvY2sgcHJpY2U6JywgZXJyb3IpXHJcbiAgICAgIHRocm93IGVycm9yXHJcbiAgICB9XHJcbiAgfVxyXG59ICJdLCJuYW1lcyI6WyJLb3JlYUludmVzdG1lbnRBUEkiLCJjb25zdHJ1Y3RvciIsImJhc2VVcmwiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiS09SRUFfSU5WRVNUTUVOVF9BUElfS0VZIiwiYXBpU2VjcmV0IiwiS09SRUFfSU5WRVNUTUVOVF9BUElfU0VDUkVUIiwiYWNjZXNzVG9rZW4iLCJ0b2tlbkV4cGlyZXNBdCIsImdldEFjY2Vzc1Rva2VuIiwiRGF0ZSIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJncmFudF90eXBlIiwiYXBwa2V5IiwiYXBwc2VjcmV0Iiwib2siLCJFcnJvciIsImRhdGEiLCJqc29uIiwiYWNjZXNzX3Rva2VuIiwibm93IiwiZXJyb3IiLCJjb25zb2xlIiwiZ2V0U3RvY2tQcmljZSIsInN5bWJvbCIsInRva2VuIiwiQXV0aG9yaXphdGlvbiIsInRyX2lkIiwicHJpY2UiLCJwYXJzZUZsb2F0Iiwib3V0cHV0Iiwic3Rja19wcnByIiwiY2hhbmdlIiwicHJkeV9jdHJ0Iiwidm9sdW1lIiwicGFyc2VJbnQiLCJhY21sX3ZvbCIsImhpZ2giLCJsb3ciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/korea-investment.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/supabase-client.ts":
/*!************************************!*\
  !*** ./src/lib/supabase-client.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nif (false) {}\nif (!process.env.SUPABASE_SERVICE_ROLE_KEY) {\n    throw new Error(\"Missing env.SUPABASE_SERVICE_ROLE_KEY\");\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(\"https://uypvrugprpujbbaudtoi.supabase.co\", process.env.SUPABASE_SERVICE_ROLE_KEY);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3N1cGFiYXNlLWNsaWVudC50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUFvRDtBQUdwRCxJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxJQUFJLENBQUNDLFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCLEVBQUU7SUFDMUMsTUFBTSxJQUFJRCxNQUFNO0FBQ2xCO0FBRU8sTUFBTUUsV0FBV04sbUVBQVlBLENBQ2xDQywwQ0FBb0MsRUFDcENBLFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCLEVBQ3RDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3RvY2stdHJhZGluZy1hcHAvLi9zcmMvbGliL3N1cGFiYXNlLWNsaWVudC50cz8xODAwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcydcclxuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tICdAL3R5cGVzL2RhdGFiYXNlLnR5cGVzJ1xyXG5cclxuaWYgKCFwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCcpXHJcbn1cclxuaWYgKCFwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZJylcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50PERhdGFiYXNlPihcclxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwsXHJcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWVxyXG4pICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwiRXJyb3IiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwic3VwYWJhc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/supabase-client.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/whatwg-url","vendor-chunks/tr46","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fstocks%2Froute&page=%2Fapi%2Fstocks%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstocks%2Froute.ts&appDir=C%3A%5CCoding%5CVirtual%20Trader%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CCoding%5CVirtual%20Trader&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();