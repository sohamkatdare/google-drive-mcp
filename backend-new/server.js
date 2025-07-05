"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAndSaveCredentials = authenticateAndSaveCredentials;
exports.loadCredentialsAndRunServer = loadCredentialsAndRunServer;
var local_auth_1 = require("@google-cloud/local-auth");
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var node_fs_1 = require("node:fs");
var googleapis_1 = require("googleapis");
var node_path_1 = require("node:path");
var drive = googleapis_1.google.drive("v3");
var server = new index_js_1.Server({
    name: "gdrive",
    version: "0.1.0",
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var pageSize, params, res, files;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pageSize = 10;
                params = {
                    pageSize: pageSize,
                    fields: "nextPageToken, files(id, name, mimeType)",
                };
                if ((_a = request.params) === null || _a === void 0 ? void 0 : _a.cursor) {
                    params.pageToken = request.params.cursor;
                }
                return [4 /*yield*/, drive.files.list(params)];
            case 1:
                res = _b.sent();
                files = res.data.files;
                return [2 /*return*/, {
                        resources: files.map(function (file) { return ({
                            uri: "gdrive:///".concat(file.id),
                            mimeType: file.mimeType,
                            name: file.name,
                        }); }),
                        nextCursor: res.data.nextPageToken,
                    }];
        }
    });
}); });
function readFileContent(fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var file, exportMimeType, res_1, res, mimeType;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, drive.files.get({
                        fileId: fileId,
                        fields: "mimeType",
                    })];
                case 1:
                    file = _b.sent();
                    if (!((_a = file.data.mimeType) === null || _a === void 0 ? void 0 : _a.startsWith("application/vnd.google-apps"))) return [3 /*break*/, 3];
                    exportMimeType = void 0;
                    switch (file.data.mimeType) {
                        case "application/vnd.google-apps.document":
                            exportMimeType = "text/markdown";
                            break;
                        case "application/vnd.google-apps.spreadsheet":
                            exportMimeType = "text/csv";
                            break;
                        case "application/vnd.google-apps.presentation":
                            exportMimeType = "text/plain";
                            break;
                        case "application/vnd.google-apps.drawing":
                            exportMimeType = "image/png";
                            break;
                        default:
                            exportMimeType = "text/plain";
                    }
                    return [4 /*yield*/, drive.files.export({ fileId: fileId, mimeType: exportMimeType }, { responseType: "text" })];
                case 2:
                    res_1 = _b.sent();
                    return [2 /*return*/, {
                            mimeType: exportMimeType,
                            content: res_1.data,
                        }];
                case 3: return [4 /*yield*/, drive.files.get({ fileId: fileId, alt: "media" }, { responseType: "arraybuffer" })];
                case 4:
                    res = _b.sent();
                    mimeType = file.data.mimeType || "application/octet-stream";
                    if (mimeType.startsWith("text/") || mimeType === "application/json") {
                        return [2 /*return*/, {
                                mimeType: mimeType,
                                content: Buffer.from(res.data).toString("utf-8"),
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                mimeType: mimeType,
                                content: Buffer.from(res.data).toString("base64"),
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var fileId, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileId = request.params.uri.replace("gdrive:///", "");
                return [4 /*yield*/, readFileContent(fileId)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, {
                        contents: [
                            {
                                uri: request.params.uri,
                                mimeType: result.mimeType,
                                text: result.content,
                            },
                        ],
                    }];
        }
    });
}); });
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: [
                    {
                        name: "gdrive_search",
                        description: "Search for files specifically in your Google Drive account (don't use exa nor brave to search for files)",
                        inputSchema: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "Search query",
                                },
                            },
                            required: ["query"],
                        },
                    },
                    {
                        name: "gdrive_read_file",
                        description: "Read a file from Google Drive using its Google Drive file ID (don't use exa nor brave to read files)",
                        inputSchema: {
                            type: "object",
                            properties: {
                                file_id: {
                                    type: "string",
                                    description: "The ID of the file to read",
                                },
                            },
                            required: ["file_id"],
                        },
                    },
                ],
            }];
    });
}); });
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var userQuery, escapedQuery, formattedQuery, res, fileList, fileId, result, error_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(request.params.name === "gdrive_search")) return [3 /*break*/, 2];
                userQuery = (_a = request.params.arguments) === null || _a === void 0 ? void 0 : _a.query;
                escapedQuery = userQuery.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                formattedQuery = "fullText contains '".concat(escapedQuery, "'");
                return [4 /*yield*/, drive.files.list({
                        q: formattedQuery,
                        pageSize: 10,
                        fields: "files(id, name, mimeType, modifiedTime, size)",
                    })];
            case 1:
                res = _f.sent();
                fileList = (_b = res.data.files) === null || _b === void 0 ? void 0 : _b.map(function (file) { return "".concat(file.name, " (").concat(file.mimeType, ") - ID: ").concat(file.id); }).join("\n");
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Found ".concat((_d = (_c = res.data.files) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0, " files:\n").concat(fileList),
                            },
                        ],
                        isError: false,
                    }];
            case 2:
                if (!(request.params.name === "gdrive_read_file")) return [3 /*break*/, 6];
                fileId = (_e = request.params.arguments) === null || _e === void 0 ? void 0 : _e.file_id;
                if (!fileId) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "File ID is required");
                }
                _f.label = 3;
            case 3:
                _f.trys.push([3, 5, , 6]);
                return [4 /*yield*/, readFileContent(fileId)];
            case 4:
                result = _f.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: result.content,
                            },
                        ],
                        isError: false,
                    }];
            case 5:
                error_1 = _f.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Error reading file: ".concat(error_1.message),
                            },
                        ],
                        isError: true,
                    }];
            case 6: throw new Error("Tool not found");
        }
    });
}); });
var credentialsPath = process.env.MCP_GDRIVE_CREDENTIALS || node_path_1.default.join(process.cwd(), "credentials", ".gdrive-server-credentials.json");
function authenticateAndSaveCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var keyPath, auth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('called auth function');
                    keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || node_path_1.default.join(process.cwd(), "credentials", "gcp-oauth.keys.json");
                    console.log("Looking for keys at:", keyPath);
                    console.log("Will save credentials to:", credentialsPath);
                    return [4 /*yield*/, (0, local_auth_1.authenticate)({
                            keyfilePath: keyPath,
                            scopes: ["https://www.googleapis.com/auth/drive.readonly"],
                        })];
                case 1:
                    auth = _a.sent();
                    node_fs_1.default.writeFileSync(credentialsPath, JSON.stringify(auth.credentials));
                    console.log("Credentials saved. You can now run the server.");
                    return [2 /*return*/];
            }
        });
    });
}
function loadCredentialsAndRunServer() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, auth, transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!node_fs_1.default.existsSync(credentialsPath)) {
                        console.error("Credentials not found. Please run with 'auth' argument first.");
                        process.exit(1);
                    }
                    credentials = JSON.parse(node_fs_1.default.readFileSync(credentialsPath, "utf-8"));
                    auth = new googleapis_1.google.auth.OAuth2();
                    auth.setCredentials(credentials);
                    googleapis_1.google.options({ auth: auth });
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (process.argv[2] === "auth") {
    authenticateAndSaveCredentials().catch(console.error);
}
else {
    loadCredentialsAndRunServer().catch(function (error) {
        process.stderr.write("Error: ".concat(error, "\n"));
        process.exit(1);
    });
}
