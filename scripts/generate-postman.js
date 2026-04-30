"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePostmanArtifacts = generatePostmanArtifacts;
exports.buildPostmanEnvironment = buildPostmanEnvironment;
exports.convertOpenApiToPostmanCollection = convertOpenApiToPostmanCollection;
exports.fetchSwaggerSpec = fetchSwaggerSpec;
exports.readEnvFile = readEnvFile;
const dotenv_1 = require("dotenv");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const SWAGGER_JSON_URL = 'http://localhost:3001/api/docs-json';
const FETCH_FAILURE_MESSAGE = 'Error: Could not reach the Swagger JSON endpoint. Ensure the NestJS server is running at http://localhost:3001.';
const PROJECT_ROOT = process.cwd();
const POSTMAN_DIRECTORY = node_path_1.default.join(PROJECT_ROOT, 'postman');
const COLLECTION_PATH = node_path_1.default.join(POSTMAN_DIRECTORY, 'collection.json');
const ENVIRONMENT_PATH = node_path_1.default.join(POSTMAN_DIRECTORY, 'environment.json');
const openapiToPostmanv2 = require('openapi-to-postmanv2');
function readEnvFile(filePath) {
    return (0, promises_1.readFile)(filePath, 'utf8')
        .then((contents) => (0, dotenv_1.parse)(contents))
        .catch((error) => {
        if (error.code === 'ENOENT') {
            return {};
        }
        throw error;
    });
}
function mergeEnvironmentFiles(exampleEnv, localEnv) {
    return {
        ...exampleEnv,
        ...localEnv,
    };
}
function buildBaseUrl(env) {
    const port = env.PORT?.trim() || '3000';
    return `http://localhost:${port}`;
}
function buildPostmanEnvironment(env) {
    const mergedEnv = new Map(Object.entries(env));
    const port = mergedEnv.get('PORT')?.trim() || '3000';
    const apiVersion = mergedEnv.get('API_VERSION')?.trim() || 'v1';
    const jwtSecret = mergedEnv.get('JWT_SECRET')?.trim() ||
        mergedEnv.get('JWT_ACCESS_SECRET')?.trim() ||
        mergedEnv.get('JWT_REFRESH_SECRET')?.trim() ||
        '';
    mergedEnv.set('PORT', port);
    mergedEnv.set('API_VERSION', apiVersion);
    mergedEnv.set('JWT_SECRET', jwtSecret);
    mergedEnv.set('baseUrl', buildBaseUrl({ ...env, PORT: port }));
    const preferredOrder = new Map([
        ['baseUrl', 0],
        ['PORT', 1],
        ['API_VERSION', 2],
        ['JWT_SECRET', 3],
    ]);
    const values = Array.from(mergedEnv.entries())
        .sort(([leftKey], [rightKey]) => {
        const leftRank = preferredOrder.get(leftKey) ?? Number.POSITIVE_INFINITY;
        const rightRank = preferredOrder.get(rightKey) ?? Number.POSITIVE_INFINITY;
        if (leftRank !== rightRank) {
            return leftRank - rightRank;
        }
        return leftKey.localeCompare(rightKey);
    })
        .map(([key, value]) => ({
        key,
        value,
        enabled: true,
        type: 'default',
    }));
    return {
        name: 'aimalya',
        values,
        _postman_variable_scope: 'environment',
        _postman_exported_at: new Date().toISOString(),
        _postman_exported_using: 'Aimalya Swagger to Postman generator',
    };
}
async function fetchSwaggerSpec() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
        const response = await fetch(SWAGGER_JSON_URL, {
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch Swagger JSON from ${SWAGGER_JSON_URL}: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        if (!data || typeof data !== 'object') {
            throw new Error('Swagger JSON endpoint did not return a valid object.');
        }
        return data;
    }
    catch (error) {
        const fetchError = new Error(FETCH_FAILURE_MESSAGE);
        fetchError.cause = error;
        throw fetchError;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
function convertOpenApiToPostmanCollection(spec) {
    return new Promise((resolve, reject) => {
        openapiToPostmanv2.convert({
            type: 'json',
            data: spec,
        }, {}, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (!result?.result || !Array.isArray(result.output) || !result.output[0]) {
                reject(new Error(result?.reason ?? 'Unable to convert the OpenAPI spec into a Postman collection.'));
                return;
            }
            resolve(result.output[0].data);
        });
    });
}
async function writeJsonFile(filePath, data) {
    await (0, promises_1.writeFile)(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
async function generatePostmanArtifacts() {
    const [exampleEnv, localEnv] = await Promise.all([
        readEnvFile(node_path_1.default.join(PROJECT_ROOT, '.env.example')),
        readEnvFile(node_path_1.default.join(PROJECT_ROOT, '.env')),
    ]);
    const mergedEnv = mergeEnvironmentFiles(exampleEnv, localEnv);
    const swaggerSpec = await fetchSwaggerSpec();
    const collection = await convertOpenApiToPostmanCollection(swaggerSpec);
    const environment = buildPostmanEnvironment(mergedEnv);
    await (0, promises_1.mkdir)(POSTMAN_DIRECTORY, { recursive: true });
    await Promise.all([
        writeJsonFile(COLLECTION_PATH, collection),
        writeJsonFile(ENVIRONMENT_PATH, environment),
    ]);
}
async function main() {
    try {
        await generatePostmanArtifacts();
        console.log(`Generated Postman artifacts in ${POSTMAN_DIRECTORY}`);
    }
    catch (error) {
        if (error instanceof Error && error.message === FETCH_FAILURE_MESSAGE) {
            console.error(FETCH_FAILURE_MESSAGE);
            process.exitCode = 1;
            return;
        }
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Postman generation failed: ${message}`);
        process.exitCode = 1;
    }
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=generate-postman.js.map