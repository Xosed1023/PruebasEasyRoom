// Configuración de producción para Android
// Si las variables de entorno no están disponibles, usa valores por defecto o muestra error

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key] || defaultValue;
    if (!value) {
        console.error(`❌ Variable de entorno faltante: ${key}`);
        console.error('Asegúrate de que tu archivo .env contenga todas las variables necesarias');
    }
    return value || '';
};

export const VITE_APP_GQL_API = getEnvVar('VITE_APP_GQL_API');
export const VITE_APP_GQL_API_WS = getEnvVar('VITE_APP_GQL_API_WS');
export const VITE_APP_GOOGLE_OAUTH_API_CLIENT_ID = getEnvVar('VITE_APP_GOOGLE_OAUTH_API_CLIENT_ID');
export const VITE_APP_ACCESS_KEY = getEnvVar('VITE_APP_ACCES_KEY');
export const VITE_APP_SECRET_KEY = getEnvVar('VITE_APP_SECRET_KEY');
export const VITE_APP_BUCKET_REGION = getEnvVar('VITE_APP_BUCKET_REGION');
export const VITE_APP_SPACES_ENDPOINT = getEnvVar('VITE_APP_SPACES_ENDPOINT');
export const VITE_APP_ARTICULOS_BUCKET = getEnvVar('VITE_APP_ARTICULOS_BUCKET');
export const VITE_APP_AVATARS_BUCKET_FOLDER = getEnvVar('VITE_APP_AVATARS_BUCKET_FOLDER');
export const VITE_APP_REST_API = getEnvVar('VITE_APP_REST_API');
export const VITE_APP_LOCAL_API = getEnvVar('VITE_APP_LOCAL_API');
export const VITE_S3_ACCESS_KEY = getEnvVar('VITE_S3_ACCESS_KEY');
export const VITE_APP_USER_KEY = getEnvVar('VITE_APP_USER_KEY');

// Verificar configuración al cargar
if (typeof window !== 'undefined') {
    console.log('🔧 Configuración de entorno cargada:');
    console.log('- GraphQL API:', VITE_APP_GQL_API ? '✅' : '❌');
    console.log('- WebSocket API:', VITE_APP_GQL_API_WS ? '✅' : '❌');
    console.log('- REST API:', VITE_APP_REST_API ? '✅' : '❌');
}
